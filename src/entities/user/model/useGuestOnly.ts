import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from './useSession';

// 로그인/회원가입처럼 로그인하지 않은 사용자를 위한 화면에서, 이미 로그인한 사용자를 메인으로 돌려보낸다.
// 세션을 확인하는 짧은 순간에는 화면이 먼저 보일 수 있다.
export function useGuestOnly() {
   const router = useRouter();
   const { status, user } = useSession();

   useEffect(() => {
      if (status === 'ready' && user) router.replace('/');
   }, [status, user, router]);
}
