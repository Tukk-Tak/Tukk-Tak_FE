import { useCallback, useRef, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useCountdown } from '@/shared/lib/useCountdown';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { sendEmailCode } from '../api/sendEmailCode';
import { verifyEmailCode } from '../api/verifyEmailCode';

export type EmailVerificationStatus = 'idle' | 'sent' | 'verified';

interface Failure {
   code: string;
   message: string;
}

const toFailure = (error: unknown): Failure => {
   const { code, message } = toApiError(error);
   return { code, message };
};

// 이메일 인증 흐름: 인증번호 받기(idle → sent) → 인증번호 확인(sent → verified)
export function useEmailVerification() {
   const [status, setStatus] = useState<EmailVerificationStatus>('idle');
   const [code, setCode] = useState('');
   const [sendError, setSendError] = useState<Failure | null>(null);
   const [codeError, setCodeError] = useState<Failure | null>(null);

   const countdown = useCountdown();
   const { run: runSend, pending: sending } = useSingleFlight();
   const { run: runVerify, pending: verifying } = useSingleFlight();
   const { start: startCountdown, stop: stopCountdown } = countdown;
   // 이메일을 바꾸면(reset) 값이 올라가, 그 이전에 보낸 요청의 응답은 무시한다.
   const generationRef = useRef(0);

   const requestCode = useCallback(
      (email: string) =>
         runSend(async () => {
            const generation = generationRef.current;
            setSendError(null);
            setCodeError(null);
            try {
               const { expiresInSeconds } = await sendEmailCode(email);
               if (generation !== generationRef.current) return;
               setCode('');
               setStatus('sent');
               startCountdown(expiresInSeconds);
            } catch (error) {
               if (generation !== generationRef.current) return;
               setSendError(toFailure(error));
            }
         }),
      [runSend, startCountdown],
   );

   const confirmCode = useCallback(
      (email: string) =>
         runVerify(async () => {
            const generation = generationRef.current;
            setCodeError(null);
            try {
               await verifyEmailCode(email, code);
               if (generation !== generationRef.current) return;
               setStatus('verified');
               stopCountdown();
            } catch (error) {
               if (generation !== generationRef.current) return;
               setCodeError(toFailure(error));
            }
         }),
      [runVerify, code, stopCountdown],
   );

   // 입력을 고치면 이전 인증번호 오류는 더 이상 유효하지 않다.
   const changeCode = useCallback((value: string) => {
      setCode(value);
      setCodeError(null);
   }, []);

   const clearSendError = useCallback(() => setSendError(null), []);

   // 이메일을 바꾸려는 경우: 지금까지의 인증 진행 상황을 모두 버리고 처음으로 돌아간다.
   // 진행 중이던 요청의 응답이 나중에 도착해도 새 이메일에 적용되지 않게 한다.
   const reset = useCallback(() => {
      generationRef.current += 1;
      setStatus('idle');
      setCode('');
      setSendError(null);
      setCodeError(null);
      stopCountdown();
   }, [stopCountdown]);

   return {
      status,
      code,
      sendError,
      codeError,
      sending,
      verifying,
      remaining: countdown.remaining,
      timerRunning: countdown.running,
      requestCode,
      confirmCode,
      changeCode,
      clearSendError,
      reset,
   };
}

export type EmailVerificationState = ReturnType<typeof useEmailVerification>;
