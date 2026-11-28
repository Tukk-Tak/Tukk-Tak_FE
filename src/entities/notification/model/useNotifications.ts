import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, isUnauthorizedError, toApiError } from '@/shared/lib/apiClient';
import { fetchHasUnreadNotification, getNotifications } from '../api/getNotifications';
import { deleteNotifications, markNotificationRead } from '../api/updateNotifications';
import type { NotificationData } from '../types';

// 한 번 불러온 결과. request가 지금 요청 번호와 같을 때만 "이번에 받은 결과"이다.
interface Loaded {
   request: number;
   items: NotificationData[] | null;
   message: string | null;
}

// 목록이 없을 때 매번 새 배열을 만들지 않게 하는 빈 배열 (useCallback 의존성이 매 렌더링 바뀌는 것을 막는다.)
const NO_ITEMS: NotificationData[] = [];

// 최신순으로 되돌려 놓는다. (삭제에 실패해 항목을 되살릴 때 원래 자리로 돌아가게 한다.) 읽을 수 없는 시각은 가장 오래된 것으로 본다.
const time = (item: NotificationData) => {
   const value = Date.parse(item.createdAt);
   return Number.isNaN(value) ? -Infinity : value;
};
const byNewest = (a: NotificationData, b: NotificationData) => time(b) - time(a);

// 실패했을 때 사용자에게 보여 줄 문구. 로그인 시간이 지난 경우는 apiClient가 이미 안내했으므로 null이다.
function failureMessage(error: unknown): string | null {
   return isUnauthorizedError(error) ? null : toApiError(error).message;
}

// 헤더의 알림. 벨의 빨간 점은 목록을 받지 않고도 "읽지 않은 알림이 있는지"로 정하고, 목록은 드롭다운을 열 때 받는다.
// 알림은 서버가 일정 기간 뒤 지우므로 페이지를 나누지 않고 한 번에 받는다.
// 삭제는 먼저 화면에서 지우고(낙관적), 서버가 실패하면 되돌린다.
export function useNotifications() {
   // 목록을 받으라고 요청한 횟수. 0이면 아직 한 번도 열지 않은 것이다. (열 때, 다시 시도할 때 올라간다.)
   const [request, setRequest] = useState(0);
   const [loaded, setLoaded] = useState<Loaded | null>(null);
   // 목록을 받기 전의 "읽지 않은 알림이 있는지" (GET /notification/exists)
   const [existsUnread, setExistsUnread] = useState(false);
   // 같은 알림의 삭제 요청이 두 번 가지 않게 하는 동기 가드
   const deletingRef = useRef(new Set<string>());

   useEffect(() => {
      let ignore = false;

      // 점만 정하는 확인이라, 실패해도 알리지 않고 점을 띄우지 않는다.
      fetchHasUnreadNotification()
         .then((value) => {
            if (!ignore) setExistsUnread(value);
         })
         .catch(() => undefined);

      return () => {
         ignore = true;
      };
   }, []);

   useEffect(() => {
      if (request === 0) return;
      let ignore = false;

      getNotifications()
         .then((items) => {
            if (!ignore) setLoaded({ request, items, message: null });
         })
         .catch((error: unknown) => {
            if (!ignore) setLoaded({ request, items: null, message: toApiError(error).message });
         });

      return () => {
         ignore = true;
      };
   }, [request]);

   const current = loaded?.request === request ? loaded : null;
   // 다시 받는 동안에는 이전에 받은 목록을 그대로 보여 준다. (열 때마다 깜빡이지 않게)
   const items = (current?.items ?? loaded?.items) || NO_ITEMS;
   let status: 'idle' | 'loading' | 'ready' | 'error' = 'idle';
   if (request > 0) {
      if (current) status = current.items ? 'ready' : 'error';
      else status = loaded?.items ? 'ready' : 'loading';
   }

   // 목록을 한 번이라도 받았으면 목록 기준이고, 아니면 exists 결과로 정한다.
   const hasList = loaded?.items != null;
   const unreadCount = hasList ? items.filter((item) => item.isNew).length : null;
   const hasUnread = hasList ? (unreadCount ?? 0) > 0 : existsUnread;

   // 목록을 (다시) 받는다. 드롭다운을 열 때와 "다시 시도"에서 쓴다.
   const refresh = useCallback(() => setRequest((count) => count + 1), []);

   // 알림 하나를 지운다. 성공하면 null, 실패하면 보여 줄 문구를 돌려준다. (안내가 필요 없는 경우도 null이다.)
   const remove = useCallback(
      async (id: string): Promise<string | null> => {
         const target = items.find((item) => item.id === id);
         if (!target || deletingRef.current.has(id)) return null;

         deletingRef.current.add(id);
         setLoaded((prev) =>
            prev?.items ? { ...prev, items: prev.items.filter((item) => item.id !== id) } : prev,
         );
         try {
            await deleteNotifications([id]);
            return null;
         } catch (error) {
            // 이미 지워진 알림(다른 곳에서 지운 경우)이면 되살리지 않고 목록을 다시 받아 맞춘다.
            if (error instanceof ApiError && error.status === 404) {
               refresh();
            } else {
               setLoaded((prev) =>
                  prev?.items ? { ...prev, items: [...prev.items, target].sort(byNewest) } : prev,
               );
            }
            return failureMessage(error);
         } finally {
            deletingRef.current.delete(id);
         }
      },
      [items, refresh],
   );

   // 알림을 모두 지운다. 받아 둔 목록 전체를 한 번에 지우고, 서버가 끝낸 뒤에 목록을 비운다.
   // 성공하면 null, 실패하면 보여 줄 문구를 돌려준다.
   const removeAll = useCallback(async (): Promise<string | null> => {
      try {
         await deleteNotifications(items.map((item) => item.id));
      } catch (error) {
         if (error instanceof ApiError && error.status === 404) refresh();
         return failureMessage(error);
      }
      setLoaded((prev) => (prev?.items ? { ...prev, items: [] } : prev));
      return null;
   }, [items, refresh]);

   // 읽지 않은 알림을 모두 읽음으로 바꾼다. 화면은 바로 바꾸고, 서버는 하나씩만 읽음 처리를 받으므로 읽지 않은 것마다 요청을 보낸다.
   // 요청이 실패해도 사용자에게 알리지 않는다. (다음에 불러올 때 다시 신규로 보일 뿐이다.)
   const markAllRead = useCallback(() => {
      const unreadIds = items.filter((item) => item.isNew).map((item) => item.id);
      if (unreadIds.length === 0) return;

      setLoaded((prev) =>
         prev?.items
            ? { ...prev, items: prev.items.map((item) => ({ ...item, isNew: false })) }
            : prev,
      );
      void Promise.allSettled(unreadIds.map((id) => markNotificationRead(id)));
   }, [items]);

   return {
      status,
      items,
      message: current?.message ?? null,
      hasUnread,
      // 목록을 받기 전에는 개수를 모른다. (점만 있는 상태)
      unreadCount,
      refresh,
      remove,
      removeAll,
      markAllRead,
   };
}
