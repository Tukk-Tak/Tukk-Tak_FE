'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signIn } from '@/entities/user/model/sessionStore';
import { toApiError } from '@/shared/lib/apiClient';
import { completeGoogleLogin } from '../api/completeGoogleLogin';
import { LOGIN_ERROR } from '../model/errorCodes';
import { GOOGLE_AUTH_ERROR } from '../model/googleAuthError';

// /login/google: 구글 인증을 마치고 돌아오는 자리. 로그인을 마무리하고 메인으로 보낸다.
// 가입되지 않은 계정이거나 실패하면 오류를 담아 로그인 화면(/login)으로 돌려보낸다.
// TODO: 실제 연동에서는 백엔드가 인증 후 바로 메인(/)으로 보내므로 이 화면은 필요 없다.
export function GoogleLoginCallback() {
   const router = useRouter();

   useEffect(() => {
      let cancelled = false;

      completeGoogleLogin()
         .then((user) => {
            if (cancelled) return;
            signIn(user);
            router.replace('/');
         })
         .catch((error) => {
            if (cancelled) return;
            const reason =
               toApiError(error).code === LOGIN_ERROR.GOOGLE_UNREGISTERED
                  ? GOOGLE_AUTH_ERROR.UNREGISTERED
                  : GOOGLE_AUTH_ERROR.FAILED;
            router.replace(`/login?google=${reason}`);
         });

      return () => {
         cancelled = true;
      };
   }, [router]);

   return (
      <p role="status" className="w-full max-w-135 py-24 text-center text-sm text-black/50">
         구글 계정으로 로그인하는 중이에요
      </p>
   );
}
