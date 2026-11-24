'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { signIn } from '@/entities/user/model/sessionStore';
import { useGoogleAuth } from '@/entities/user/model/useGoogleAuth';
import { useGuestOnly } from '@/entities/user/model/useGuestOnly';
import { FIND_PASSWORD_PATH } from '@/shared/config/routes';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { FormField } from '@/shared/ui/FormField';
import { GoogleSignInButton } from '@/shared/ui/GoogleSignInButton';
import { Input } from '@/shared/ui/Input';
import { OrDivider } from '@/shared/ui/OrDivider';
import { PasswordInput } from '@/shared/ui/PasswordInput';
import { LOGIN_ERROR } from '../model/errorCodes';
import { useLoginSubmit } from '../model/useLoginSubmit';
import { getLoginErrors } from '../model/validation';
import type { LoginValues } from '../types';

export function LoginForm() {
   const router = useRouter();
   // 이미 로그인한 사용자가 들어오면 메인으로 돌려보낸다.
   useGuestOnly();

   const [values, setValues] = useState<LoginValues>({ email: '', password: '', rememberMe: true });
   // 시안처럼 로그인 버튼은 항상 활성이다. 처음 눌러 보기 전에는 오류를 보여주지 않는다.
   const [showValidation, setShowValidation] = useState(false);
   const loginSubmit = useLoginSubmit();
   const googleAuth = useGoogleAuth();

   // 이메일 로그인과 구글 로그인은 한쪽이 끝날 때까지 다른 쪽을 시작하지 않는다.
   // 두 요청이 서로 다른 계정으로 성공하면 나중에 끝난 쪽이 최종 로그인 계정이 되기 때문이다.
   // 버튼을 비활성화하는 것만으로는 이미 열린 구글 창에서 돌아오는 응답이나 엔터 입력을 막지 못해서, 각 처리기에서도 확인한다.
   const authBusy = loginSubmit.submitting || googleAuth.busy;

   const errors = showValidation ? getLoginErrors(values) : {};
   const invalidCredentials = loginSubmit.error?.code === LOGIN_ERROR.INVALID_CREDENTIALS;

   const setValue = (patch: Partial<LoginValues>) => {
      setValues((prev) => ({ ...prev, ...patch }));
      loginSubmit.clearError();
   };

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (authBusy) return;

      if (Object.keys(getLoginErrors(values)).length > 0) {
         setShowValidation(true);
         return;
      }
      setShowValidation(false);

      const result = await loginSubmit.submit({ ...values, email: values.email.trim() });
      if (!result) return;

      if (result.ok) {
         signIn(result.user);
         router.replace('/');
         return;
      }

      // 이메일 또는 비밀번호가 틀리면 이메일은 남기고 비밀번호만 비운 뒤 다시 입력하게 한다.
      if (result.failure.code === LOGIN_ERROR.INVALID_CREDENTIALS) {
         setValues((prev) => ({ ...prev, password: '' }));
         document.getElementById('password')?.focus();
      }
   };

   // 이메일 로그인이 진행 중일 때 구글 창에서 돌아온 응답은 무시한다.
   const handleGoogleCredential = (credential: string) => {
      if (loginSubmit.submitting) return;
      googleAuth.handleCredential(credential);
   };

   return (
      <form onSubmit={handleSubmit} noValidate className="my-auto w-full max-w-135">
         <h1 className="text-2xl font-bold text-black">다시 만나 반가워요</h1>
         <p className="mt-2 text-xs text-black/50">사장님 · 로그인하고 가게 관리를 이어가세요</p>

         <div className="mt-10 space-y-6">
            <FormField label="이메일" htmlFor="email" required>
               <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="이메일 주소를 입력해 주세요"
                  value={values.email}
                  invalid={Boolean(errors.email) || invalidCredentials}
                  aria-describedby="email-message"
                  onChange={(event) => setValue({ email: event.target.value })}
               />
               {errors.email && (
                  <FieldMessage id="email-message" tone="error">
                     {errors.email}
                  </FieldMessage>
               )}
            </FormField>

            <FormField label="비밀번호" htmlFor="password" required>
               <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="비밀번호를 입력해 주세요"
                  value={values.password}
                  invalid={Boolean(errors.password) || invalidCredentials}
                  aria-describedby="password-message"
                  onChange={(event) => setValue({ password: event.target.value })}
               />
               {errors.password && (
                  <FieldMessage id="password-message" tone="error">
                     {errors.password}
                  </FieldMessage>
               )}
            </FormField>
         </div>

         <Checkbox
            className="mt-5"
            checked={values.rememberMe}
            onChange={(event) => setValue({ rememberMe: event.target.checked })}
         >
            로그인 상태 유지
         </Checkbox>

         {loginSubmit.error && (
            <FieldMessage tone="error" className="mt-4">
               {loginSubmit.error.message}
            </FieldMessage>
         )}

         <Button type="submit" size="form" disabled={authBusy} className="mt-5 w-full">
            {loginSubmit.submitting ? '로그인 중' : '로그인'}
         </Button>

         <div className="my-4">
            <OrDivider />
         </div>

         <GoogleSignInButton onCredential={handleGoogleCredential} disabled={authBusy} />
         {googleAuth.error && (
            <FieldMessage tone="error" className="mt-3 text-center">
               {googleAuth.error}
            </FieldMessage>
         )}

         <Link
            href={FIND_PASSWORD_PATH}
            className="mt-8 inline-block cursor-pointer text-xs font-bold text-brand-orange hover:underline underline-offset-4"
         >
            비밀번호를 잊으셨나요?
         </Link>
      </form>
   );
}
