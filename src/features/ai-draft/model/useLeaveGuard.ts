'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CREATE_PATH } from '@/shared/config/routes';

// 헤더의 로고와 메뉴 링크에 붙어 있는 표시. 이 표시가 있는 링크를 누르면 나가기 확인을 받는다.
const LEAVE_GUARD_LINK = 'a[data-leave-guard]';

// 뒤로 가기를 가로채려고 쌓아 두는 히스토리 항목의 표시.
const GUARD_KEY = 'aiDraftGuard';

function hasGuardMark(state: unknown) {
   return typeof state === 'object' && state !== null && GUARD_KEY in state;
}

// 같은 주소의 히스토리 항목을 하나 더 쌓는다. Next가 히스토리 항목에 넣어 둔 값(__NA 등)을 그대로 복사해야
// 뒤로 가기 때 Next가 이 항목을 알아보고 페이지를 새로고침하지 않는다.
function pushGuardEntry() {
   window.history.pushState(
      { ...(window.history.state ?? {}), [GUARD_KEY]: true },
      '',
      window.location.href,
   );
}

// 바로 앞 히스토리 항목이 허브인지. 허브에서 눌러 들어왔다면 뒤로 가기만으로 허브에 돌아갈 수 있고,
// 주소를 직접 열었거나 다른 화면에서 왔다면 뒤로 가기가 엉뚱한 곳(사이트 밖 포함)으로 가므로 허브 주소로 바꿔 보낸다.
// 브라우저의 Navigation API로 확인하고, 지원하지 않는 브라우저는 '아니다'로 보고 허브로 보낸다.
interface NavigationLike {
   currentEntry?: { index: number } | null;
   entries?: () => { url: string | null }[];
}

function isPreviousEntryHub() {
   const navigation = (window as unknown as { navigation?: NavigationLike }).navigation;
   const index = navigation?.currentEntry?.index;
   if (typeof index !== 'number' || index < 1) return false;

   const previousUrl = navigation?.entries?.()[index - 1]?.url;
   if (!previousUrl) return false;
   try {
      return new URL(previousUrl).pathname === CREATE_PATH;
   } catch {
      return false;
   }
}

export type LeaveRequest = 'back' | 'link';

// AI 초안 입력 화면을 벗어나려는 두 경로를 가로채 확인을 받게 한다.
// - 브라우저 뒤로 가기(back): 허브로 나간다. 주소를 직접 열었어도 허브로 보낸다.
// - 헤더 로고·메뉴 링크 클릭(link): 누른 링크로 이동한다.
// 입력한 값이 없으면(shouldConfirm이 false) 확인 없이 바로 나간다.
// 주소를 직접 바꾸거나 새로고침, 탭 닫기는 가로채지 않는다.
export function useLeaveGuard(shouldConfirm: boolean) {
   const router = useRouter();
   const [request, setRequest] = useState<LeaveRequest | null>(null);
   const shouldConfirmRef = useRef(shouldConfirm);
   const pendingLinkRef = useRef<HTMLAnchorElement | null>(null);
   // 확인을 받은 링크를 다시 누를 때, 이 훅이 또 가로채지 않게 한다.
   const bypassRef = useRef(false);
   // 나가는 중에 오는 뒤로 가기 신호는 무시한다. (허브로 나가는 뒤로 가기가 다시 가로채이는 것을 막는다)
   const leavingRef = useRef(false);

   useEffect(() => {
      shouldConfirmRef.current = shouldConfirm;
   });

   const leaveToHub = useCallback(() => {
      leavingRef.current = true;
      if (isPreviousEntryHub()) window.history.back();
      else router.replace(CREATE_PATH);
   }, [router]);

   useEffect(() => {
      // 이 화면 위에 뒤로 가기용 항목을 하나 쌓아 둔다. 개발 모드에서 효과가 두 번 실행돼도 한 번만 쌓는다.
      if (!hasGuardMark(window.history.state)) pushGuardEntry();

      const handlePopState = (event: PopStateEvent) => {
         if (leavingRef.current) return;
         // 앞으로 가기로 쌓아 둔 항목에 돌아온 경우다. 화면은 그대로 둔다.
         if (hasGuardMark(event.state)) return;

         // 뒤로 가기로 이 화면의 원래 항목에 도착했다.
         if (shouldConfirmRef.current) setRequest('back');
         else leaveToHub();
      };

      const handleClick = (event: MouseEvent) => {
         if (bypassRef.current) {
            bypassRef.current = false;
            return;
         }
         if (!shouldConfirmRef.current || event.defaultPrevented) return;
         // 새 탭으로 열기 등은 이 화면을 벗어나는 것이 아니다.
         if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
         ) {
            return;
         }

         const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
            LEAVE_GUARD_LINK,
         );
         if (!link) return;

         event.preventDefault();
         event.stopPropagation();
         pendingLinkRef.current = link;
         setRequest('link');
      };

      window.addEventListener('popstate', handlePopState);
      // 캡처 단계로 받아야 Next의 링크 이동보다 먼저 막을 수 있다.
      document.addEventListener('click', handleClick, true);
      return () => {
         window.removeEventListener('popstate', handlePopState);
         document.removeEventListener('click', handleClick, true);
      };
   }, [leaveToHub]);

   const confirm = () => {
      const current = request;
      setRequest(null);

      if (current === 'back') {
         leaveToHub();
         return;
      }
      if (current === 'link') {
         const link = pendingLinkRef.current;
         pendingLinkRef.current = null;
         if (!link) return;
         // 링크를 다시 눌러 원래 동작(이동, 모바일 메뉴 닫기)을 그대로 실행한다.
         // 화면에서 사라진 링크라면 주소로 직접 이동한다.
         if (link.isConnected) {
            bypassRef.current = true;
            link.click();
         } else {
            router.push(link.getAttribute('href') ?? '/');
         }
      }
   };

   const cancel = () => {
      // 뒤로 가기로 원래 항목까지 내려왔으므로, 다시 한 칸 쌓아 다음 뒤로 가기도 가로챌 수 있게 한다.
      if (request === 'back') pushGuardEntry();
      pendingLinkRef.current = null;
      setRequest(null);
   };

   return { request, confirm, cancel };
}
