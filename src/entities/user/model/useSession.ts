import { useEffect } from 'react';
import { useStore } from 'zustand';
import { sessionStore, startSession, type SessionState } from './sessionStore';

// 현재 로그인 상태. status가 'loading'인 동안에는 로그인 여부를 아직 모른다.
// zustand는 서버 렌더링과 첫 렌더링에 저장소의 초기값(loading)을 쓰므로 하이드레이션이 어긋나지 않는다.
export function useSession(): SessionState {
   const session = useStore(sessionStore);

   // 처음 쓰이는 시점에 세션 확인을 시작한다. (이펙트는 브라우저에서만 실행된다.)
   useEffect(() => {
      startSession();
   }, []);

   return session;
}
