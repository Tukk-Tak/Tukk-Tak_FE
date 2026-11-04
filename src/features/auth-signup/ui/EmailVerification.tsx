'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { isValidEmail } from '@/shared/lib/isValidEmail';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { OtpInput } from '@/shared/ui/OtpInput';
import { SIGNUP_ERROR } from '../model/errorCodes';
import type { EmailVerificationState } from '../model/useEmailVerification';

const CODE_LENGTH = 6;

const formatTime = (totalSeconds: number) => {
   const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
   const seconds = String(totalSeconds % 60).padStart(2, '0');
   return `${minutes}:${seconds}`;
};

interface EmailVerificationProps {
   email: string;
   onEmailChange: (email: string) => void;
   verification: EmailVerificationState;
}

export function EmailVerification({ email, onEmailChange, verification }: EmailVerificationProps) {
   const [touched, setTouched] = useState(false);
   const { status, sendError, codeError } = verification;
   const sent = status === 'sent';
   const verified = status === 'verified';
   const expired = sent && !verification.timerRunning;

   const formatError = touched && email !== '' && !isValidEmail(email);
   const emailInvalid = Boolean(sendError) || formatError;

   return (
      <div className="space-y-6">
         <div>
            <FormField label="이메일" htmlFor="email" required>
               <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                     <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="이메일 주소를 입력해주세요"
                        value={email}
                        // 전송 중에 이메일을 바꾸면 이전 이메일의 응답이 새 이메일에 적용될 수 있어 잠근다.
                        readOnly={verification.sending || sent || verified}
                        invalid={emailInvalid}
                        aria-describedby="email-message"
                        className={verified ? 'pr-28' : ''}
                        onChange={(event) => {
                           onEmailChange(event.target.value);
                           verification.clearSendError();
                        }}
                        onBlur={() => setTouched(true)}
                     />
                     {verified && (
                        <span className="absolute inset-y-0 right-4 flex items-center gap-1 text-xs font-bold text-state-success">
                           <Check aria-hidden className="size-3.5" strokeWidth={3} />
                           인증 완료
                        </span>
                     )}
                  </div>
                  {status === 'idle' && (
                     <Button
                        variant="outline"
                        size="field"
                        // 라벨이 "보내는 중"으로 바뀌어도 버튼 폭이 변하지 않도록 가장 긴 라벨 폭(약 115px)으로 고정한다.
                        className="w-29"
                        disabled={!isValidEmail(email) || verification.sending}
                        onClick={() => verification.requestCode(email)}
                     >
                        {verification.sending ? '보내는 중' : '인증번호 받기'}
                     </Button>
                  )}
               </div>
            </FormField>

            {sendError ? (
               <FieldMessage id="email-message" tone="error">
                  {sendError.message}
                  {sendError.code === SIGNUP_ERROR.EMAIL_ALREADY_REGISTERED && (
                     <>
                        {' · '}
                        <Link href="/login" className="cursor-pointer underline underline-offset-4">
                           로그인하기
                        </Link>
                     </>
                  )}
               </FieldMessage>
            ) : formatError ? (
               <FieldMessage id="email-message" tone="error">
                  이메일 형식이 맞지 않아요
               </FieldMessage>
            ) : sent ? (
               <FieldMessage id="email-message">
                  {email}으로 인증번호를 보냈어요{' · '}
                  <button
                     type="button"
                     onClick={verification.reset}
                     className="cursor-pointer text-brand-orange underline underline-offset-4"
                  >
                     이메일 변경
                  </button>
               </FieldMessage>
            ) : null}
         </div>

         {sent && (
            <FormField label="인증번호" htmlFor="email-code-0" required>
               {/* 좁은 화면(320~360px)에서는 확인 버튼이 다음 줄로 내려가도록 줄바꿈을 허용한다. */}
               <div className="flex flex-wrap items-center justify-between gap-3">
                  <OtpInput
                     idPrefix="email-code"
                     label="인증번호"
                     length={CODE_LENGTH}
                     value={verification.code}
                     invalid={Boolean(codeError) || expired}
                     disabled={expired || verification.verifying}
                     onChange={verification.changeCode}
                  />
                  <Button
                     variant="outline"
                     size="field"
                     className="ml-auto w-20"
                     // 인증번호 재발송이 진행 중일 때는 이전 번호로 확인하지 못하게 막는다.
                     disabled={
                        verification.code.length !== CODE_LENGTH ||
                        expired ||
                        verification.verifying ||
                        verification.sending
                     }
                     onClick={() => verification.confirmCode(email)}
                  >
                     {verification.verifying ? '확인 중' : '확인'}
                  </Button>
               </div>
               {codeError && <FieldMessage tone="error">{codeError.message}</FieldMessage>}
               {expired && (
                  <FieldMessage tone="error">
                     인증 시간이 지났어요. 인증번호를 다시 받아주세요
                  </FieldMessage>
               )}
               <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="text-black/50">
                     남은 시간 {formatTime(verification.remaining)}
                  </span>
                  <button
                     type="button"
                     // 확인이 진행 중일 때 재발송하면 인증을 마친 상태가 되돌려질 수 있어 막는다.
                     disabled={verification.sending || verification.verifying}
                     onClick={() => verification.requestCode(email)}
                     className="cursor-pointer text-brand-orange disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     인증번호 다시 받기
                  </button>
               </div>
            </FormField>
         )}
      </div>
   );
}
