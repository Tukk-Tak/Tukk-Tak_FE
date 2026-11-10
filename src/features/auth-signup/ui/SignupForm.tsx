'use client';

import { useRef, useState } from 'react';
import { useGuestOnly } from '@/entities/user/model/useGuestOnly';
import { scrollAreaToTop } from '@/shared/ui/ScrollArea';
import type { GoogleAuthError } from '../model/googleAuthError';
import { useEmailVerification } from '../model/useEmailVerification';
import type { AccountValues } from '../types';
import { AccountStep } from './AccountStep';
import { SignupStepper } from './SignupStepper';
import { StoreStep } from './StoreStep';

type Step = 1 | 2;

// 가입 흐름 전체의 상태를 가진다. 단계를 오가도 입력한 값이 유지되도록 두 단계를 모두 그려 두고,
// 현재 단계가 아닌 쪽은 숨기기만 한다. (새로고침하면 처음부터 다시 시작한다.)
export function SignupForm({ googleError }: { googleError?: GoogleAuthError }) {
   // 이미 로그인한 사용자가 들어오면 메인으로 돌려보낸다.
   useGuestOnly();
   const [step, setStep] = useState<Step>(1);
   const [account, setAccount] = useState<AccountValues>({
      email: '',
      password: '',
      passwordConfirm: '',
   });
   const emailVerification = useEmailVerification();

   const rootRef = useRef<HTMLDivElement>(null);

   const goTo = (next: Step) => {
      setStep(next);
      // 인증 화면은 페이지 전체가 아니라 main 안의 스크롤 영역이 스크롤되므로 그 영역도 함께 맨 위로 올린다.
      // (아래에서 "다음"을 눌러도 다음 단계의 첫 입력란부터 보이게 한다.)
      scrollAreaToTop(rootRef.current);
      window.scrollTo({ top: 0 });
   };

   // 이메일을 고치려면 인증을 처음부터 다시 해야 한다.
   const editEmail = () => {
      emailVerification.reset();
      goTo(1);
   };

   return (
      <div ref={rootRef} className="w-full max-w-135">
         <SignupStepper currentStep={step} />

         <div hidden={step !== 1}>
            <AccountStep
               account={account}
               emailVerification={emailVerification}
               googleError={googleError}
               onChange={(patch) => setAccount((prev) => ({ ...prev, ...patch }))}
               onNext={() => goTo(2)}
            />
         </div>

         <div hidden={step !== 2}>
            <StoreStep
               account={{ email: account.email, password: account.password }}
               onBack={() => goTo(1)}
               onEditEmail={editEmail}
            />
         </div>
      </div>
   );
}
