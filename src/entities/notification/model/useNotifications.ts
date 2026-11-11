import { useCallback, useEffect, useRef, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { getNotifications } from '../api/getNotifications';
import {
   deleteAllNotifications,
   deleteNotification,
   markAllNotificationsRead,
} from '../api/updateNotifications';
import type { NotificationData } from '../types';

// 한 번 불러온 결과. attempt가 지금 시도 번호와 같을 때만 유효하다. (다시 불러오면 loading으로 돌아간다.)
interface Loaded {
   attempt: number;
   items: NotificationData[] | null;
   message: string | null;
}

// 목록이 없을 때 매번 새 배열을 만들지 않게 하는 빈 배열 (useCallback 의존성이 매 렌더링 바뀌는 것을 막는다.)
const NO_ITEMS: NotificationData[] = [];

// 최신순으로 되돌려 놓는다. (삭제에 실패해 항목을 되살릴 때 원래 자리로 돌아가게 한다.)
const byNewest = (a: NotificationData, b: NotificationData) =>
   b.createdAt.localeCompare(a.createdAt);

// 헤더의 알림 목록. 알림은 일정 기간 뒤 서버가 지우므로 페이지를 나누지 않고 한 번에 받는다.
// 삭제는 먼저 화면에서 지우고(낙관적), 서버가 실패하면 되돌린다.
export function useNotifications() {
   const [attempt, setAttempt] = useState(0);
   const [loaded, setLoaded] = useState<Loaded | null>(null);
   // 같은 알림의 삭제 요청이 두 번 가지 않게 하는 동기 가드
   const deletingRef = useRef(new Set<string>());

   useEffect(() => {
      let ignore = false;

      getNotifications()
         .then(({ notifications }) => {
            if (!ignore) setLoaded({ attempt, items: notifications, message: null });
         })
         .catch((error: unknown) => {
            if (!ignore) setLoaded({ attempt, items: null, message: toApiError(error).message });
         });

      return () => {
         ignore = true;
      };
   }, [attempt]);

   const current = loaded?.attempt === attempt ? loaded : null;
   const items = current?.items ?? NO_ITEMS;
   const status = current === null ? 'loading' : current.items ? 'ready' : 'error';
   const unreadCount = items.filter((item) => item.isNew).length;

   const retry = useCallback(() => setAttempt((count) => count + 1), []);

   // 알림 하나를 지운다. 실패하면 목록을 되돌리고 false를 돌려준다.
   const remove = useCallback(
      async (id: string): Promise<boolean> => {
         const target = items.find((item) => item.id === id);
         if (!target || deletingRef.current.has(id)) return true;

         deletingRef.current.add(id);
         setLoaded((prev) =>
            prev?.items ? { ...prev, items: prev.items.filter((item) => item.id !== id) } : prev,
         );
         try {
            await deleteNotification(id);
            return true;
         } catch {
            setLoaded((prev) =>
               prev?.items ? { ...prev, items: [...prev.items, target].sort(byNewest) } : prev,
            );
            return false;
         } finally {
            deletingRef.current.delete(id);
         }
      },
      [items],
   );

   // 알림을 모두 지운다. 서버가 끝낸 뒤에 목록을 비우고, 실패하면 false를 돌려준다.
   const removeAll = useCallback(async (): Promise<boolean> => {
      try {
         await deleteAllNotifications();
      } catch {
         return false;
      }
      setLoaded((prev) => (prev?.items ? { ...prev, items: [] } : prev));
      return true;
   }, []);

   // 모두 읽음으로 바꾼다. 화면은 바로 바꾸고, 서버 요청이 실패해도 사용자에게 알리지 않는다.
   // (다음에 불러올 때 다시 신규로 보일 뿐이다.)
   const markAllRead = useCallback(() => {
      setLoaded((prev) =>
         prev?.items
            ? { ...prev, items: prev.items.map((item) => ({ ...item, isNew: false })) }
            : prev,
      );
      void markAllNotificationsRead().catch(() => undefined);
   }, []);

   return {
      status,
      items,
      message: current?.message ?? null,
      unreadCount,
      retry,
      remove,
      removeAll,
      markAllRead,
   };
}
