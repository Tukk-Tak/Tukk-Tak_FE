import { useCallback, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { signup } from '../api/signup';
import type { SignupPayload } from '../types';

export function useSignupSubmit() {
   const [error, setError] = useState<string | null>(null);
   const { run, pending } = useSingleFlight();

   // 성공하면 true. 가입 요청이 이미 진행 중이어서 무시된 경우에는 false다.
   const submit = useCallback(
      async (payload: SignupPayload) => {
         setError(null);
         const succeeded = await run(async () => {
            try {
               await signup(payload);
               return true;
            } catch (caught) {
               setError(toApiError(caught).message);
               return false;
            }
         });
         return succeeded === true;
      },
      [run],
   );

   // 입력을 고치면 직전 제출의 오류는 더 이상 현재 상태를 설명하지 않는다.
   const clearError = useCallback(() => setError(null), []);

   return { error, submitting: pending, submit, clearError };
}
