'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GOOGLE_AUTH_ERROR } from '../model/googleAuthError';
import { useGoogleProfile } from '../model/useGoogleProfile';
import { GoogleSignupContent } from './GoogleSignupContent';

// /signup/google: 구글에서 가져온 정보를 불러온 뒤 가입 화면을 보여준다.
// 가입 대기 정보가 없거나 만료되어 불러오지 못하면 처음 화면(/signup)으로 돌려보낸다.
export function GoogleSignupForm() {
   const router = useRouter();
   const state = useGoogleProfile();

   useEffect(() => {
      if (state.status === 'failed') router.replace(`/signup?google=${GOOGLE_AUTH_ERROR.EXPIRED}`);
   }, [state.status, router]);

   if (state.status !== 'ready') {
      return (
         <p role="status" className="w-full max-w-135 py-24 text-center text-sm text-black/50">
            구글 계정 정보를 불러오는 중이에요
         </p>
      );
   }

   return <GoogleSignupContent profile={state.profile} />;
}
