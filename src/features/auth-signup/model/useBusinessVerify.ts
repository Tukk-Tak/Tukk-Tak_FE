import { useCallback, useRef, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { verifyBusiness } from '../api/verifyBusiness';
import type { BusinessVerifyInput } from '../types';

export type BusinessVerifyStatus = 'idle' | 'verified' | 'failed';

export function useBusinessVerify() {
   const [status, setStatus] = useState<BusinessVerifyStatus>('idle');
   const [message, setMessage] = useState<string | null>(null);
   const { run, pending } = useSingleFlight();
   // 요청을 보낸 뒤 입력값이 바뀌면(reset) 값이 올라가, 그 이전에 보낸 요청의 응답은 무시한다.
   const versionRef = useRef(0);

   const verify = useCallback(
      (input: BusinessVerifyInput) =>
         run(async () => {
            const version = versionRef.current;
            try {
               await verifyBusiness(input);
               if (version !== versionRef.current) return;
               setStatus('verified');
               setMessage(null);
            } catch (error) {
               if (version !== versionRef.current) return;
               setStatus('failed');
               setMessage(toApiError(error).message);
            }
         }),
      [run],
   );

   // 인증에 쓴 값(사업자 번호, 개업일자, 대표자명)이 바뀌면 이전 결과는 무효다.
   // 인증 요청이 진행 중이었다면 그 응답도 무효로 만든다.
   const reset = useCallback(() => {
      versionRef.current += 1;
      setStatus('idle');
      setMessage(null);
   }, []);

   return { status, message, verifying: pending, verify, reset };
}

export type BusinessVerifyState = ReturnType<typeof useBusinessVerify>;
