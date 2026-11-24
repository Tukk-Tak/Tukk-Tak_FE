import { useCallback, useRef, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useCountdown } from '@/shared/lib/useCountdown';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';

export type EmailVerificationStatus = 'idle' | 'sent' | 'verified';

interface Failure {
   code: string;
   message: string;
}

const toFailure = (error: unknown): Failure => {
   const { code, message } = toApiError(error);
   return { code, message };
};

interface EmailVerificationOptions<TResult> {
   // 인증번호를 보낸다. 쓰임에 따라 서버가 다르게 판단한다. (가입: 이미 가입된 이메일이면 오류 / 재설정: 가입되지 않은 이메일이면 오류)
   // resendAfterSeconds는 서버가 정한 "다시 받기까지 기다려야 하는 시간"이다. 주지 않으면 기다리지 않는다.
   sendCode: (email: string) => Promise<{ expiresInSeconds: number; resendAfterSeconds?: number }>;
   // 인증번호를 확인한다. 맞지 않으면 예외를 던진다.
   // 서버가 인증 결과로 주는 값(가입의 이메일 토큰 등)이 있으면 돌려주고, 훅이 verifiedResult로 보관한다.
   verifyCode: (email: string, code: string) => Promise<TResult>;
}

// 이메일 인증 흐름: 인증번호 받기(idle → sent) → 인증번호 확인(sent → verified)
// 회원가입과 비밀번호 재설정이 함께 쓰고, 서버 요청만 각자 넘겨 받는다. (함수는 매 렌더링마다 새로 만들지 말고 고정된 것을 넘긴다.)
export function useEmailVerification<TResult = void>({
   sendCode,
   verifyCode,
}: EmailVerificationOptions<TResult>) {
   const [status, setStatus] = useState<EmailVerificationStatus>('idle');
   const [code, setCode] = useState('');
   const [sendError, setSendError] = useState<Failure | null>(null);
   const [codeError, setCodeError] = useState<Failure | null>(null);
   // 인증에 성공했을 때 서버가 준 값. 이메일을 바꾸거나 인증번호를 다시 받으면 버린다.
   const [verifiedResult, setVerifiedResult] = useState<TResult | null>(null);

   // 인증번호의 남은 유효 시간과, 다시 받을 수 있게 되기까지 남은 시간은 서로 다른 타이머다.
   const countdown = useCountdown();
   const resendCountdown = useCountdown();
   const { run: runSend, pending: sending } = useSingleFlight();
   const { run: runVerify, pending: verifying } = useSingleFlight();
   const { start: startCountdown, stop: stopCountdown } = countdown;
   const { start: startResendCountdown, stop: stopResendCountdown } = resendCountdown;
   // 이메일을 바꾸면(reset) 값이 올라가, 그 이전에 보낸 요청의 응답은 무시한다.
   const generationRef = useRef(0);

   const requestCode = useCallback(
      (email: string) =>
         runSend(async () => {
            const generation = generationRef.current;
            setSendError(null);
            setCodeError(null);
            try {
               const { expiresInSeconds, resendAfterSeconds } = await sendCode(email);
               if (generation !== generationRef.current) return;
               setCode('');
               setVerifiedResult(null);
               setStatus('sent');
               startCountdown(expiresInSeconds);
               if (resendAfterSeconds && resendAfterSeconds > 0) {
                  startResendCountdown(resendAfterSeconds);
               } else {
                  stopResendCountdown();
               }
            } catch (error) {
               if (generation !== generationRef.current) return;
               setSendError(toFailure(error));
            }
         }),
      [runSend, sendCode, startCountdown, startResendCountdown, stopResendCountdown],
   );

   const confirmCode = useCallback(
      (email: string) =>
         runVerify(async () => {
            const generation = generationRef.current;
            setCodeError(null);
            try {
               const result = await verifyCode(email, code);
               if (generation !== generationRef.current) return;
               setVerifiedResult(result);
               setStatus('verified');
               stopCountdown();
               stopResendCountdown();
            } catch (error) {
               if (generation !== generationRef.current) return;
               setCodeError(toFailure(error));
            }
         }),
      [runVerify, verifyCode, code, stopCountdown, stopResendCountdown],
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
      setVerifiedResult(null);
      stopCountdown();
      stopResendCountdown();
   }, [stopCountdown, stopResendCountdown]);

   return {
      status,
      code,
      sendError,
      codeError,
      verifiedResult,
      sending,
      verifying,
      remaining: countdown.remaining,
      timerRunning: countdown.running,
      resendRemaining: resendCountdown.remaining,
      resendWaiting: resendCountdown.running,
      requestCode,
      confirmCode,
      changeCode,
      clearSendError,
      reset,
   };
}

export type EmailVerificationState = ReturnType<typeof useEmailVerification>;
