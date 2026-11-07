import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSession } from './useSession';

// 글쓰기처럼 로그인한 사용자만 쓸 수 있는 화면에서, 로그인하지 않은 사용자를 로그인 페이지로 보낸다.
// allowed가 true일 때만 화면을 그리면, 세션을 확인하는 동안과 이동하는 동안 비로그인 사용자에게 화면이 보이지 않는다.
// TODO: 로그인 후 원래 가려던 화면으로 돌아오는 기능이 생기면 이동 경로를 함께 넘긴다. (지금은 /login으로만 보낸다.)
export function useMemberOnly() {
   const router = useRouter();
   const { status, user } = useSession();

   useEffect(() => {
      if (status === 'ready' && !user) router.replace('/login');
   }, [status, user, router]);

   return { allowed: status === 'ready' && user !== null };
}
