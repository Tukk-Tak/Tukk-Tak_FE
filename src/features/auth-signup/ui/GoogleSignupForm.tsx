'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
   readGoogleSignupTicket,
   type GoogleSignupTicket,
} from '@/entities/user/model/googleSignupTicket';
import { useGuestOnly } from '@/entities/user/model/useGuestOnly';
import { GOOGLE_AUTH_ERROR } from '../model/googleAuthError';
import { GoogleSignupContent } from './GoogleSignupContent';

// /signup/google: 구글 로그인 때 서버가 준 가입 티켓과 구글 계정 정보를 읽어서 가입 화면을 보여준다.
// 티켓이 없으면(직접 주소로 들어왔거나, 가입을 마쳤거나, 탭을 닫았다가 다시 연 경우) 처음 화면(/signup)으로 돌려보낸다.
export function GoogleSignupForm() {
   const router = useRouter();
   useGuestOnly();
   // undefined: 아직 읽지 않음(서버 렌더링과 첫 렌더링은 저장소가 없어 항상 이 상태) / null: 티켓 없음
   const [ticket, setTicket] = useState<GoogleSignupTicket | null | undefined>(undefined);

   useEffect(() => {
      const stored = readGoogleSignupTicket();
      setTicket(stored);
      if (!stored) router.replace(`/signup?google=${GOOGLE_AUTH_ERROR.EXPIRED}`);
   }, [router]);

   if (!ticket) {
      return (
         <p role="status" className="w-full max-w-135 py-24 mb-8 text-center text-sm text-black/50">
            구글 계정 정보를 불러오는 중이에요
         </p>
      );
   }

   return <GoogleSignupContent ticket={ticket} />;
}
