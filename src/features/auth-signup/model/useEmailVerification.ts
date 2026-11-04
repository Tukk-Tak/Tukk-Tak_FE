import { useCallback, useState } from 'react';
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

   const requestCode = useCallback(
      (email: string) =>
         runSend(async () => {
            setSendError(null);
            setCodeError(null);
            try {
               const { expiresInSeconds } = await sendEmailCode(email);
               setCode('');
               setStatus('sent');
               startCountdown(expiresInSeconds);
            } catch (error) {
               setSendError(toFailure(error));
            }
         }),
      [runSend, startCountdown],
   );

   const confirmCode = useCallback(
      (email: string) =>
         runVerify(async () => {
            setCodeError(null);
            try {
               await verifyEmailCode(email, code);
               setStatus('verified');
               stopCountdown();
            } catch (error) {
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
   const reset = useCallback(() => {
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
