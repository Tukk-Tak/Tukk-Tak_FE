'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import {
   clearGoogleSignupTicket,
   type GoogleSignupTicket,
} from '@/entities/user/model/googleSignupTicket';
import { signIn } from '@/entities/user/model/sessionStore';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { useToast } from '@/shared/ui/toastContext';
import { applySignupFailure } from '../model/applySignupFailure';
import { SIGNUP_ERROR } from '../model/errorCodes';
import { GOOGLE_AUTH_ERROR } from '../model/googleAuthError';
import { useSignupSubmit } from '../model/useSignupSubmit';
import { useStoreForm } from '../model/useStoreForm';
import { GoogleAccountCard } from './GoogleAccountCard';
import { StoreFields } from './StoreFields';

// 구글 가입: 구글에서 이름과 이메일을 가져왔으므로 이메일 인증과 비밀번호 없이 가게 정보만 입력한다.
// 이름 칸은 구글 이름으로 미리 채워 두며, 그대로 수정할 수 있다.
// 가입에 성공하면 서버가 토큰까지 주므로 로그인된 채로 메인으로 간다.
export function GoogleSignupContent({ ticket }: { ticket: GoogleSignupTicket }) {
   const router = useRouter();
   const toast = useToast();
   const signupSubmit = useSignupSubmit();
   const form = useStoreForm({ initialName: ticket.name, onEdit: signupSubmit.clearError });

   const canSubmit = form.isValid && !signupSubmit.submitting;

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!canSubmit) return;

      // 가입을 요청하는 동안에도 입력을 고칠 수 있으므로, 요청 당시의 입력을 기억해 둔다. (아래 실패 처리에서 비교한다.)
      const submitted = form.snapshotInputs();
      const result = await signupSubmit.submit({
         provider: 'GOOGLE',
         signupTicket: ticket.signupTicket,
         ...form.buildPayloadBase(),
      });
      if (!result) return;

      if (result.ok) {
         // 티켓은 한 번만 쓸 수 있으므로 가입이 끝나면 지운다.
         clearGoogleSignupTicket();
         if (result.user) {
            signIn(result.user);
            toast.show('가입이 완료됐어요', { tone: 'success' });
            router.replace('/');
         } else {
            // 가입은 끝났는데 로그인 상태를 만들지 못한 경우다. 로그인 화면에서 다시 로그인하게 한다.
            toast.show('가입이 완료됐어요. 로그인해주세요', { tone: 'success' });
            router.replace('/login');
         }
         return;
      }

      // 서버가 거절한 이유에 따라 다음 행동을 정한다. (문구는 모두 서버 message다.)
      switch (result.code) {
         // 티켓을 더 쓸 수 없다. 구글 인증부터 다시 하도록 처음 화면으로 보낸다.
         case SIGNUP_ERROR.GOOGLE_TICKET_INVALID:
            clearGoogleSignupTicket();
            signupSubmit.clearError();
            router.replace(`/signup?google=${GOOGLE_AUTH_ERROR.EXPIRED}`);
            break;
         // 티켓을 받은 뒤 같은 이메일로 먼저 가입한 사람이 생겼다. 로그인하도록 안내한다.
         case SIGNUP_ERROR.EMAIL_ALREADY_REGISTERED:
            clearGoogleSignupTicket();
            signupSubmit.clearError();
            toast.show(result.message, { tone: 'error' });
            router.replace('/login');
            break;
         // 닉네임 중복, 사업자 인증 오류는 이메일 가입과 같은 방식으로 처리한다.
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

   // 구글에서 가져온 정보(가입 티켓)를 버리고 이동한다.
   // 티켓을 지우는 서버 API는 없고 시간이 지나면 서버가 정리하므로, 이쪽에서는 보관한 정보만 지운다.
   const leave = (path: string) => {
      clearGoogleSignupTicket();
      router.push(path);
   };

   return (
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-135">
         <h1 className="mt-2 text-2xl font-bold text-black">거의 다 됐어요</h1>
         <p className="mt-2 text-xs text-black/50">
            구글 계정 정보는 가져왔어요. 아래만 더 입력해주세요.
         </p>

         <div className="mt-8 space-y-6">
            {/* 다른 계정으로 바꾸려면 구글 로그인 화면에서 계정 선택부터 다시 해야 하므로 회원가입 처음 화면으로 보낸다. */}
            <GoogleAccountCard profile={ticket} onChangeAccount={() => leave('/signup')} />
            <StoreFields form={form} />
         </div>

         {signupSubmit.error && (
            <FieldMessage tone="error" className="mt-4">
               {signupSubmit.error}
            </FieldMessage>
         )}

         <Button type="submit" size="form" disabled={!canSubmit} className="mt-6 w-full">
            {signupSubmit.submitting ? '가입 중' : '가입 완료'}
         </Button>
         <button
            type="button"
            disabled={signupSubmit.submitting}
            onClick={() => leave('/')}
            className="mx-auto mt-4 mb-5 block cursor-pointer text-xs font-medium text-black/70 hover:underline underline-offset-4 not-disabled:hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
         >
            가입 취소
         </button>
      </form>
   );
}
