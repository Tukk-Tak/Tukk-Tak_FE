import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { authenticateWithGoogle } from '../api/authenticateWithGoogle';
import { signIn } from './sessionStore';

// 구글 버튼에서 받은 토큰(credential)으로 로그인·가입 흐름을 시작한다. (로그인 화면과 회원가입 1단계가 함께 쓴다.)
// - 이미 가입한 계정: 로그인 상태를 반영하고 메인으로 간다.
// - 처음 온 계정: 가입 화면(/signup/google)으로 간다. 구글 계정 정보는 그쪽이 보관한 티켓에서 읽는다.
// - 실패: 서버 message를 error로 돌려준다. 화면은 그것을 구글 버튼 아래에 보여 준다.
export function useGoogleAuth() {
   const router = useRouter();
   const [error, setError] = useState<string | null>(null);
   // 성공하면 페이지 이동이 끝날 때까지 처리 중 상태를 유지한다. (같은 토큰으로 한 번 더 요청되는 것을 막는다.)
   const [completed, setCompleted] = useState(false);
   const { run, pending } = useSingleFlight();

   const handleCredential = useCallback(
      (credential: string) => {
         void run(async () => {
            setError(null);
            try {
               const result = await authenticateWithGoogle(credential);
               setCompleted(true);
               if (result.status === 'logged-in') {
                  signIn(result.user);
                  router.replace('/');
               } else {
                  router.push('/signup/google');
               }
            } catch (caught) {
               setError(toApiError(caught).message);
            }
         });
      },
      [run, router],
   );

   return { error, busy: pending || completed, handleCredential };
}
