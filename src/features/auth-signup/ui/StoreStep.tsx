'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { useSignupSubmit } from '../model/useSignupSubmit';
import { useStoreForm } from '../model/useStoreForm';
import { EmailSummaryCard } from './EmailSummaryCard';
import { StoreFields } from './StoreFields';

interface StoreStepProps {
   // 1단계에서 입력한 계정 정보. 가입 요청에 함께 보낸다.
   account: { email: string; password: string };
   onBack: () => void;
   onEditEmail: () => void;
}

// 이메일 가입의 2단계: 가게 정보
export function StoreStep({ account, onBack, onEditEmail }: StoreStepProps) {
   const router = useRouter();
   const signupSubmit = useSignupSubmit();
   const form = useStoreForm({ onEdit: signupSubmit.clearError });
   const canSubmit = form.isValid && !signupSubmit.submitting;

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit) return;

      const succeeded = await signupSubmit.submit({
         provider: 'EMAIL',
         email: account.email,
         password: account.password,
         ...form.buildPayloadBase(),
      });
      if (succeeded) router.push('/login');
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
