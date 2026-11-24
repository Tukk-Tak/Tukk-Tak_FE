import { useCallback, useRef, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { verifyBusiness } from '../api/verifyBusiness';
import type { BusinessVerifyInput } from '../types';

export type BusinessVerifyStatus = 'idle' | 'verified' | 'failed';

export function useBusinessVerify() {
   const [status, setStatus] = useState<BusinessVerifyStatus>('idle');
   const [message, setMessage] = useState<string | null>(null);
   // 인증에 성공했을 때 서버가 준 사업자 토큰. 가입 요청에 실어 보낸다. 인증이 무효가 되면 함께 버린다.
   const [token, setToken] = useState<string | null>(null);
   const { run, pending } = useSingleFlight();
   // 요청을 보낸 뒤 입력값이 바뀌면(reset) 값이 올라가, 그 이전에 보낸 요청의 응답은 무시한다.
   const versionRef = useRef(0);

   const verify = useCallback(
      (input: BusinessVerifyInput) =>
         run(async () => {
            const version = versionRef.current;
            try {
               const businessToken = await verifyBusiness(input);
               if (version !== versionRef.current) return;
               setStatus('verified');
               setMessage(null);
               setToken(businessToken);
            } catch (error) {
               if (version !== versionRef.current) return;
               setStatus('failed');
               setMessage(toApiError(error).message);
               setToken(null);
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
      setToken(null);
   }, []);

   // 가입 요청이 사업자 인증 때문에 거절된 경우(토큰 무효, 대표자명 불일치, 이미 인증된 번호)에 쓴다.
   // 인증을 실패로 돌려서, 사업자 칸에 사유를 보여 주고 다시 인증하게 한다.
   const fail = useCallback((reason: string) => {
      versionRef.current += 1;
      setStatus('failed');
      setMessage(reason);
      setToken(null);
   }, []);

   return { status, message, token, verifying: pending, verify, reset, fail };
}

export type BusinessVerifyState = ReturnType<typeof useBusinessVerify>;
