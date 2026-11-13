import { useCallback, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { resetPassword } from '../api/resetPassword';

// 새 비밀번호 저장 요청. 중복 제출을 막고, 실패하면 이유를 error로 남긴다. 성공하면 true를 돌려준다.
export function useResetSubmit() {
   const { run, pending } = useSingleFlight();
   const [error, setError] = useState<string | null>(null);

   const submit = useCallback(
      async (email: string, password: string): Promise<boolean> => {
         setError(null);
         const result = await run(async () => {
            try {
               await resetPassword(email, password);
               return true;
            } catch (caught) {
               setError(toApiError(caught).message);
               return false;
            }
         });
         return result === true;
      },
      [run],
   );

   const clearError = useCallback(() => setError(null), []);

   return { submit, submitting: pending, error, clearError };
}
