import { useCallback, useRef, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { resetPassword } from '../api/resetPassword';

// 새 비밀번호 저장 요청. 중복 제출을 막고, 실패하면 이유를 error로 남긴다. 성공하면 true를 돌려준다.
export function useResetSubmit() {
   const { run, pending } = useSingleFlight();
   const [error, setError] = useState<string | null>(null);
   // 입력을 고칠 때(clearError)마다 올라가는 번호. 요청 중에 입력을 고쳤다면, 그 요청의 실패 메시지는
   // 이미 지나간 입력에 대한 것이므로 보여 주지 않는다.
   const generationRef = useRef(0);

   const submit = useCallback(
      async (email: string, password: string): Promise<boolean> => {
         setError(null);
         const generation = generationRef.current;
         const result = await run(async () => {
            try {
               await resetPassword(email, password);
               return true;
            } catch (caught) {
               if (generation === generationRef.current) setError(toApiError(caught).message);
               return false;
            }
         });
         return result === true;
      },
      [run],
   );

   const clearError = useCallback(() => {
      generationRef.current += 1;
      setError(null);
   }, []);

   return { submit, submitting: pending, error, clearError };
}
