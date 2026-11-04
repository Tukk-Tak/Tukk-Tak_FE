import { useCallback, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { verifyBusiness } from '../api/verifyBusiness';
import type { BusinessVerifyInput } from '../types';

export type BusinessVerifyStatus = 'idle' | 'verified' | 'failed';

export function useBusinessVerify() {
   const [status, setStatus] = useState<BusinessVerifyStatus>('idle');
   const [message, setMessage] = useState<string | null>(null);
   const { run, pending } = useSingleFlight();

   const verify = useCallback(
      (input: BusinessVerifyInput) =>
         run(async () => {
            try {
               await verifyBusiness(input);
               setStatus('verified');
               setMessage(null);
            } catch (error) {
               setStatus('failed');
               setMessage(toApiError(error).message);
            }
         }),
      [run],
   );

   // 인증에 쓴 값(사업자 번호, 개업일자, 대표자명)이 바뀌면 이전 결과는 무효다.
   const reset = useCallback(() => {
      setStatus('idle');
      setMessage(null);
   }, []);

   return { status, message, verifying: pending, verify, reset };
}

export type BusinessVerifyState = ReturnType<typeof useBusinessVerify>;
