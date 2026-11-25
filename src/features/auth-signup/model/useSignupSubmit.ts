import { useCallback, useState } from 'react';
import type { User } from '@/entities/user/types';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { signup } from '../api/signup';
import type { SignupPayload } from '../types';

// ok: 가입 성공 / !ok: 실패(서버 에러 코드와 문구) / null: 가입 요청이 이미 진행 중이어서 무시됨
// user는 가입과 함께 로그인까지 된 경우(구글 가입)에만 있고, 이메일 가입은 null이다.
export type SignupResult =
   { ok: true; user: User | null } | { ok: false; code: string; message: string } | null;

export function useSignupSubmit() {
   const [error, setError] = useState<string | null>(null);
   // 가입에 성공하면 페이지 이동이 끝날 때까지 제출 중 상태를 유지한다. (같은 가입이 한 번 더 전송되는 것을 막는다.)
   const [completed, setCompleted] = useState(false);
   const { run, pending } = useSingleFlight();

   // 실패했을 때 어떤 코드인지까지 돌려준다. 코드에 따라 이메일 인증이나 사업자 인증을 처음부터 다시 하게 하는 등 호출한 쪽이 다음 행동을 정한다.
   const submit = useCallback(
      async (payload: SignupPayload): Promise<SignupResult> => {
         setError(null);
         const result = await run<SignupResult>(async () => {
            try {
               const user = await signup(payload);
               setCompleted(true);
               return { ok: true, user };
            } catch (caught) {
               const { code, message } = toApiError(caught);
               setError(message);
               return { ok: false, code, message };
            }
         });
         return result ?? null;
      },
      [run],
   );

   // 입력을 고치면 직전 제출의 오류는 더 이상 현재 상태를 설명하지 않는다.
   const clearError = useCallback(() => setError(null), []);

   return { error, submitting: pending || completed, submit, clearError };
}
