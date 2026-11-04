'use client';

import type { FormEvent } from 'react';
import { Button } from '@/shared/ui/Button';
import { GoogleButton } from '@/shared/ui/GoogleButton';
import { OrDivider } from '@/shared/ui/OrDivider';
import { GOOGLE_AUTH_ERROR, type GoogleAuthError } from '../model/googleAuthError';
import type { EmailVerificationState } from '../model/useEmailVerification';
import { useGoogleSignupStart } from '../model/useGoogleSignupStart';
import { checkPasswordRules } from '../model/validation';
import type { AccountValues } from '../types';
import { EmailVerification } from './EmailVerification';
import { GoogleAuthErrorMessage } from './GoogleAuthErrorMessage';
import { PasswordSection } from './PasswordSection';

interface AccountStepProps {
   account: AccountValues;
   emailVerification: EmailVerificationState;
   // 구글 인증이 실패해서 돌아왔을 때 주소(/signup?google=...)로 전달된 오류
   googleError?: GoogleAuthError;
   onChange: (patch: Partial<AccountValues>) => void;
   onNext: () => void;
}

// 1단계: 계정 정보
export function AccountStep({
   account,
   emailVerification,
   googleError,
   onChange,
   onNext,
}: AccountStepProps) {
   const googleStart = useGoogleSignupStart();
   // 이동을 시작하는 데 실패한 경우는 "연결 실패"로 보여준다.
   const shownGoogleError = googleStart.failed ? GOOGLE_AUTH_ERROR.FAILED : googleError;

   const canGoNext =
      emailVerification.status === 'verified' &&
      checkPasswordRules(account.password).every((rule) => rule.passed) &&
      account.passwordConfirm === account.password;

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (canGoNext) onNext();
   };

   return (
      <form onSubmit={handleSubmit}>
         <h1 className="mt-8 text-2xl font-bold text-black">사장님, 반가워요</h1>
         <p className="mt-2 text-xs text-black/50">먼저 로그인에 쓸 계정을 만들어요.</p>

         <div className="mt-10 space-y-6">
            <EmailVerification
               email={account.email}
               verification={emailVerification}
               onEmailChange={(email) => onChange({ email })}
            />
            <PasswordSection
               password={account.password}
               passwordConfirm={account.passwordConfirm}
               onPasswordChange={(password) => onChange({ password })}
               onPasswordConfirmChange={(passwordConfirm) => onChange({ passwordConfirm })}
            />
         </div>

         <Button type="submit" size="form" disabled={!canGoNext} className="mt-6 w-full">
            다음
         </Button>

         <div className="my-4">
            <OrDivider />
         </div>

         <GoogleButton disabled={googleStart.connecting} onClick={() => googleStart.start()} />
         {shownGoogleError && <GoogleAuthErrorMessage error={shownGoogleError} />}
      </form>
   );
}
