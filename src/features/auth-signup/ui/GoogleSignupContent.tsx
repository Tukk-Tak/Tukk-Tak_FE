'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { useGoogleAuthStart } from '@/shared/lib/useGoogleAuthStart';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { cancelGoogleSignup } from '../api/cancelGoogleSignup';
import { useSignupSubmit } from '../model/useSignupSubmit';
import { useStoreForm } from '../model/useStoreForm';
import type { GoogleProfile } from '../types';
import { GoogleAccountCard } from './GoogleAccountCard';
import { StoreFields } from './StoreFields';

// 구글 가입: 구글에서 이름과 이메일을 가져왔으므로 이메일 인증과 비밀번호 없이 가게 정보만 입력한다.
// 이름 칸은 구글 이름으로 미리 채워 두며, 그대로 수정할 수 있다.
export function GoogleSignupContent({ profile }: { profile: GoogleProfile }) {
   const router = useRouter();
   const signupSubmit = useSignupSubmit();
   const form = useStoreForm({ initialName: profile.name, onEdit: signupSubmit.clearError });
   const googleStart = useGoogleAuthStart('signup');
   const { run: runCancel, pending: cancelling } = useSingleFlight();

   const canSubmit = form.isValid && !signupSubmit.submitting && !cancelling;

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit) return;

      const succeeded = await signupSubmit.submit({
         provider: 'GOOGLE',
         ...form.buildPayloadBase(),
      });
      if (succeeded) router.push('/login');
   };

   // 가입을 취소하면 구글에서 가져온 정보를 버리고 메인으로 돌아간다.
   const handleCancel = () =>
      runCancel(async () => {
         try {
            await cancelGoogleSignup();
         } catch {
            // 서버의 가입 대기 정보는 시간이 지나면 정리되므로, 실패해도 이동은 계속한다.
         }
         router.push('/');
      });

   return (
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-135">
         <h1 className="mt-2 text-2xl font-bold text-black">거의 다 됐어요</h1>
         <p className="mt-2 text-xs text-black/50">
            구글 계정 정보는 가져왔어요. 아래만 더 입력해주세요.
         </p>

         <div className="mt-8 space-y-6">
            <GoogleAccountCard
               profile={profile}
               changing={googleStart.connecting}
               onChangeAccount={() => googleStart.start({ selectAccount: true })}
            />
            <StoreFields form={form} />
         </div>

         {signupSubmit.error && (
            <FieldMessage tone="error" className="mt-4">
               {signupSubmit.error}
            </FieldMessage>
         )}
         {googleStart.failed && (
            <FieldMessage tone="error" className="mt-4">
               구글 연결에 실패했어요. 잠시 후 다시 시도해주세요
            </FieldMessage>
         )}

         <Button type="submit" size="form" disabled={!canSubmit} className="mt-6 w-full">
            {signupSubmit.submitting ? '가입 중' : '가입 완료'}
         </Button>
         <button
            type="button"
            disabled={cancelling || signupSubmit.submitting}
            onClick={handleCancel}
            className="mx-auto mt-4 mb-5 block cursor-pointer text-xs font-medium text-black/70 hover:underline underline-offset-4 not-disabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
         >
            가입 취소
         </button>
      </form>
   );
}
