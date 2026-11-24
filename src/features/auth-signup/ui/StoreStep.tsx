'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { useToast } from '@/shared/ui/toastContext';
import { applySignupFailure } from '../model/applySignupFailure';
import { SIGNUP_ERROR } from '../model/errorCodes';
import { useSignupSubmit } from '../model/useSignupSubmit';
import { useStoreForm } from '../model/useStoreForm';
import { EmailSummaryCard } from './EmailSummaryCard';
import { StoreFields } from './StoreFields';

interface StoreStepProps {
   // 1단계에서 입력한 계정 정보. 가입 요청에 함께 보낸다.
   // emailToken은 이메일 인증을 마쳤을 때 서버가 준 값이다. (인증하지 않았다면 이 단계에 올 수 없지만, 없으면 가입을 막는다.)
   account: { password: string; passwordConfirm: string; email: string; emailToken: string | null };
   onBack: () => void;
   // 이메일 인증을 처음부터 다시 하게 한다. (이메일을 고치거나 이메일 토큰을 더 쓸 수 없을 때)
   onEditEmail: () => void;
}

// 이메일 가입의 2단계: 가게 정보
export function StoreStep({ account, onBack, onEditEmail }: StoreStepProps) {
   const router = useRouter();
   const toast = useToast();
   const signupSubmit = useSignupSubmit();
   const form = useStoreForm({ onEdit: signupSubmit.clearError });
   const canSubmit = form.isValid && !signupSubmit.submitting && account.emailToken !== null;

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit || account.emailToken === null) return;

      // 가입을 요청하는 동안에도 입력을 고칠 수 있으므로, 요청 당시의 입력을 기억해 둔다. (아래 실패 처리에서 비교한다.)
      const submitted = form.snapshotInputs();
      const result = await signupSubmit.submit({
         provider: 'EMAIL',
         emailToken: account.emailToken,
         password: account.password,
         passwordConfirm: account.passwordConfirm,
         ...form.buildPayloadBase(),
      });
      if (!result) return;

      if (result.ok) {
         toast.show('가입이 완료됐어요. 로그인해주세요', { tone: 'success' });
         router.push('/login');
         return;
      }

      // 서버가 거절한 이유에 따라, 어느 단계를 다시 해야 하는지 알려 준다. (문구는 모두 서버 message다.)
      switch (result.code) {
         // 이메일 인증을 더 쓸 수 없다. 1단계로 돌아가 처음부터 다시 인증한다.
         case SIGNUP_ERROR.EMAIL_TOKEN_INVALID:
         case SIGNUP_ERROR.EMAIL_ALREADY_REGISTERED:
            signupSubmit.clearError();
            toast.show(result.message, { tone: 'error' });
            onEditEmail();
            break;
         // 닉네임 중복, 사업자 인증 오류는 이메일·구글 가입이 같은 방식으로 처리한다.
         // 그 밖의 오류(입력값 오류 등)는 폼 아래에 서버 message를 그대로 보여 준다. (useSignupSubmit이 이미 보관했다.)
         default:
            applySignupFailure({
               code: result.code,
               message: result.message,
               submitted,
               form,
               clearError: signupSubmit.clearError,
            });
      }
   };

   return (
      <form onSubmit={handleSubmit} noValidate>
         <h1 className="mt-8 text-2xl font-bold text-black">거의 다 왔어요</h1>
         <p className="mt-2 text-xs text-black/50">가게 정보를 알려주세요.</p>

         <div className="mt-8 space-y-6">
            <EmailSummaryCard email={account.email} onEdit={onEditEmail} />
            <StoreFields form={form} />
         </div>

         {signupSubmit.error && (
            <FieldMessage tone="error" className="mt-4">
               {signupSubmit.error}
            </FieldMessage>
         )}

         <div className="mt-6 flex gap-3">
            <Button type="button" variant="outline" size="form" className="w-28" onClick={onBack}>
               이전
            </Button>
            <Button type="submit" size="form" disabled={!canSubmit} className="flex-1">
               {signupSubmit.submitting ? '가입 중' : '가입 완료'}
            </Button>
         </div>
      </form>
   );
}
