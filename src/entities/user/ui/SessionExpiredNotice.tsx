'use client';

import { useEffect } from 'react';
import { useToast } from '@/shared/ui/toastContext';
import { consumeExpiredNotice } from '../model/sessionStore';
import { useSession } from '../model/useSession';

// 문장 중간에서 줄이 끊기지 않도록 문장마다 줄을 나눈다. (토스트는 \n을 줄바꿈으로 보여 준다.)
const EXPIRED_MESSAGE = '로그인 시간이 지나서 로그아웃됐어요.\n다시 로그인해주세요.';
// 글을 쓰다가 만료되면 놓치기 쉬워서 기본(4초)보다 길게 보여 준다.
const EXPIRED_DURATION_MS = 6000;

// 로그인 시간이 지나 자동으로 로그아웃되면 이유를 토스트로 알려 준다.
// 어느 화면에서 만료되든 보이도록 루트 레이아웃에 한 번만 둔다. (직접 로그아웃한 경우에는 띄우지 않는다.)
export function SessionExpiredNotice() {
   const { expired } = useSession();
   const toast = useToast();

   useEffect(() => {
      if (expired && consumeExpiredNotice()) {
         toast.show(EXPIRED_MESSAGE, { tone: 'info', duration: EXPIRED_DURATION_MS });
      }
   }, [expired, toast]);

   return null;
}
