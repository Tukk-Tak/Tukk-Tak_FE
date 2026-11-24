'use client';

import Link from 'next/link';
import type { FormEvent } from 'react';
import { useGoogleAuth } from '@/entities/user/model/useGoogleAuth';
import { isPasswordValid } from '@/shared/lib/passwordRules';
import type { EmailVerificationState } from '@/shared/lib/useEmailVerification';
import { Button } from '@/shared/ui/Button';
import { EmailVerifyField } from '@/shared/ui/EmailVerifyField';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { GoogleSignInButton } from '@/shared/ui/GoogleSignInButton';
import { OrDivider } from '@/shared/ui/OrDivider';
import { PasswordFields } from '@/shared/ui/PasswordFields';
import { SIGNUP_ERROR } from '../model/errorCodes';
import type { GoogleAuthError } from '../model/googleAuthError';
import type { AccountValues } from '../types';
import { GoogleAuthErrorMessage } from './GoogleAuthErrorMessage';

interface AccountStepProps {
   account: AccountValues;
   emailVerification: EmailVerificationState;
   // 구글 가입 화면에서 가입 티켓이 없거나 만료돼 돌아왔을 때 주소(/signup?google=expired)로 전달된 안내
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
   // 이미 가입한 구글 계정이면 여기서 눌러도 바로 로그인되고, 처음 온 계정이면 구글 가입 화면으로 이동한다.
   const googleAuth = useGoogleAuth();

   const canGoNext =
      emailVerification.status === 'verified' &&
      isPasswordValid(account.password) &&
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
            <EmailVerifyField
               email={account.email}
               verification={emailVerification}
               onEmailChange={(email) => onChange({ email })}
               // 이미 가입된 이메일이면 로그인으로 바로 갈 수 있게 알려 준다.
               renderSendErrorExtra={(error) =>
                  error.code === SIGNUP_ERROR.EMAIL_ALREADY_REGISTERED && (
                     <>
                        {' · '}
                        <Link href="/login" className="cursor-pointer underline underline-offset-4">
                           로그인하기
                        </Link>
                     </>
                  )
               }
            />
            <PasswordFields
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

         <GoogleSignInButton
            onCredential={googleAuth.handleCredential}
            disabled={googleAuth.busy}
         />
         {googleAuth.error ? (
            <FieldMessage tone="error" className="mt-3 text-center">
               {googleAuth.error}
            </FieldMessage>
         ) : (
            googleError && <GoogleAuthErrorMessage error={googleError} />
         )}
      </form>
   );
}
