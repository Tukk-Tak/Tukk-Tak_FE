import { useCallback, useEffect, useRef, useState } from 'react';
import { startGoogleAuth } from '@/shared/lib/startGoogleAuth';

// 구글 로그인으로 이동을 시작한다. 이동하는 동안 연타로 여러 번 시작되지 않게 막는다.
export function useGoogleSignupStart() {
   const busyRef = useRef(false);
   const [connecting, setConnecting] = useState(false);
   const [failed, setFailed] = useState(false);

   const start = useCallback((options?: { selectAccount?: boolean }) => {
      if (busyRef.current) return;

      busyRef.current = true;
      setConnecting(true);
      setFailed(false);
      try {
         startGoogleAuth({ intent: 'signup', ...options });
      } catch {
         busyRef.current = false;
         setConnecting(false);
         setFailed(true);
      }
      // 성공하면 페이지가 바뀌므로, 이동이 끝날 때까지 연결 중 상태를 유지한다.
   }, []);

   // 구글 화면에서 뒤로 가기로 돌아오면 이전 상태가 그대로 복원되므로, 연결 중 상태를 풀어준다.
   useEffect(() => {
      const handlePageShow = (event: PageTransitionEvent) => {
         if (!event.persisted) return;
         busyRef.current = false;
         setConnecting(false);
      };
      window.addEventListener('pageshow', handlePageShow);
      return () => window.removeEventListener('pageshow', handlePageShow);
   }, []);

   return { connecting, failed, start };
}
