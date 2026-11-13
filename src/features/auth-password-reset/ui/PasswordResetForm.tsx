'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useGuestOnly } from '@/entities/user/model/useGuestOnly';
import { LOGIN_PATH } from '@/shared/config/routes';
import { isPasswordValid } from '@/shared/lib/passwordRules';
import { useEmailVerification } from '@/shared/lib/useEmailVerification';
import { Button } from '@/shared/ui/Button';
import { EmailCodeField, EmailInputField } from '@/shared/ui/EmailVerifyField';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { PasswordFields } from '@/shared/ui/PasswordFields';
import { useToast } from '@/shared/ui/toastContext';
import { sendResetCode } from '../api/sendResetCode';
import { verifyResetCode } from '../api/verifyResetCode';
import { useResetSubmit } from '../model/useResetSubmit';

// 비밀번호 재설정. 이메일 입력 → 인증번호 입력(인증이 끝나면 사라진다) → 새 비밀번호 입력 순서로 한 단계씩 나타나고,
// 저장하면 로그인 화면으로 보낸다. 이메일 인증을 마치기 전에는 비밀번호 입력과 변경 버튼이 보이지 않는다.
export function PasswordResetForm() {
   const router = useRouter();
   const toast = useToast();
   // 이미 로그인한 사용자가 들어오면 메인으로 돌려보낸다. (로그인한 뒤의 비밀번호 변경은 마이페이지에서 다룬다.)
   useGuestOnly();

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordConfirm, setPasswordConfirm] = useState('');
   const emailVerification = useEmailVerification({
      sendCode: sendResetCode,
      verifyCode: verifyResetCode,
   });
   const resetSubmit = useResetSubmit();

   const verified = emailVerification.status === 'verified';
   const canSubmit =
      verified &&
      isPasswordValid(password) &&
      passwordConfirm === password &&
      !resetSubmit.submitting;

   // 입력을 고치면 이전 저장 실패 메시지는 더 이상 맞지 않는다.
   const changePassword = (value: string) => {
      setPassword(value);
      resetSubmit.clearError();
   };
   const changePasswordConfirm = (value: string) => {
      setPasswordConfirm(value);
      resetSubmit.clearError();
   };

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit) return;

      const ok = await resetSubmit.submit(email.trim(), password);
      if (!ok) return;

      toast.show('비밀번호를 변경했어요. 새 비밀번호로 로그인해주세요', { tone: 'success' });
      router.replace(LOGIN_PATH);
   };

   return (
      // 바깥 틀이 화면 높이를 채우고, "로그인으로 돌아가기"는 맨 위에 고정한다.
      // 폼은 "제목 영역 / 이메일 입력 칸 / 나머지"로 나뉘고, 위와 아래가 남는 높이를 똑같이 나눠 가져서 입력 칸이 가운데에 온다.
      // 단계가 바뀌어 아래(인증번호, 새 비밀번호, 버튼)가 남는 높이의 절반보다 길어지면, 아래는 필요한 만큼만 차지하고
      // 입력 칸과 제목이 그만큼 위로 올라가서 내용 전체가 한 화면에 담긴다. 화면이 너무 낮아 그래도 모자라면 스크롤된다.
      <div className="relative flex w-full max-w-135 flex-col">
         {/* 링크는 흐름에서 빼서(absolute) 맨 위에 두고, 폼이 틀 전체 높이를 쓰게 한다. */}
         <Link
            href={LOGIN_PATH}
            // 화살표(16px)와 간격(8px)만큼 왼쪽으로 내어, 글자가 시작하는 위치를 아래 제목과 맞춘다.
            // (좁은 화면은 왼쪽 여백이 좁아 화살표가 잘리므로 md 이상에서만 적용한다.)
            className="absolute top-0 left-0 inline-flex items-center gap-2 text-sm font-bold text-brand-brown hover:underline md:-left-6"
         >
            <ArrowLeft aria-hidden className="size-4" />
            로그인으로 돌아가기
         </Link>

         {/* pt-8: 링크(20px)와 제목이 겹치지 않는 최소 간격이다. */}
         {/* 위쪽이 이 간격만큼 줄어든 것을 아래쪽 기준값(flex-basis 2rem = 32px)으로 맞춰서, 입력 칸이 화면의 정확한 가운데에 오게 한다. */}
         {/* (빈 공간이나 padding으로 맞추면 화면이 낮을 때도 그만큼 높이를 차지해서, 내용은 들어가는데 몇 px 넘쳐 스크롤바만 생긴다. */}
         {/*  기준값은 남는 높이를 나누는 데만 쓰이고, 내용이 더 크면 높이에 더해지지 않는다.) */}
         <form onSubmit={handleSubmit} className="flex flex-1 flex-col pt-8">
            {/* 위쪽: 제목은 입력 칸 바로 위에 붙는다. */}
            <div className="flex flex-1 flex-col justify-end">
               <div className="mb-8">
                  <h1 className="text-2xl font-bold text-black">비밀번호를 재설정해요</h1>
                  <p className="mt-2 text-xs text-black/50">
                     가입한 이메일을 인증하면 새 비밀번호를 정할 수 있어요.
                  </p>
               </div>
            </div>

            {/* 가운데: 이메일 입력 칸. 이 칸이 위아래 가운데에 오는 기준이다. */}
            <EmailInputField
               reserveMessageSpace
               email={email}
               verification={emailVerification}
               onEmailChange={setEmail}
            />

            {/* 아래쪽: 인증번호 → 새 비밀번호 → 변경 버튼이 단계마다 나타난다. (인증번호 입력칸은 인증이 끝나면 사라진다.) */}
            <div className="flex-[1_1_2rem]">
               {/* pt-2: 이메일 칸 아래 문구 자리(22px)와 합쳐 입력 칸과 다음 칸 사이를 30px로 둔다. */}
               <div className="space-y-6 pt-2">
                  <EmailCodeField email={email} verification={emailVerification} />

                  {verified && (
                     <>
                        <PasswordFields
                           autoFocus
                           label="새 비밀번호"
                           placeholder="8~16자 비밀번호"
                           password={password}
                           passwordConfirm={passwordConfirm}
                           onPasswordChange={changePassword}
                           onPasswordConfirmChange={changePasswordConfirm}
                        />
                        <div>
                           <Button
                              type="submit"
                              size="form"
                              disabled={!canSubmit}
                              className="w-full"
                           >
                              {resetSubmit.submitting ? '변경 중' : '비밀번호 변경하기'}
                           </Button>
                           {resetSubmit.error && (
                              <FieldMessage tone="error" className="mt-3 text-center">
                                 {resetSubmit.error}
                              </FieldMessage>
                           )}
                        </div>
                     </>
                  )}
               </div>
            </div>
         </form>
      </div>
   );
}
