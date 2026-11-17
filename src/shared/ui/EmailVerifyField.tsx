'use client';

import { Check } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { isValidEmail } from '../lib/isValidEmail';
import type { EmailVerificationState } from '../lib/useEmailVerification';
import { Button } from './Button';
import { FieldMessage } from './FieldMessage';
import { FormField } from './FormField';
import { Input } from './Input';
import { OtpInput } from './OtpInput';

const CODE_LENGTH = 6;
// 인증번호 오류 문구의 id. 인증번호 칸이 aria-describedby로 가리킨다.
const CODE_ERROR_ID = 'email-code-error';
const CODE_EXPIRED_ID = 'email-code-expired';

const formatTime = (totalSeconds: number) => {
   const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
   const seconds = String(totalSeconds % 60).padStart(2, '0');
   return `${minutes}:${seconds}`;
};

interface EmailInputFieldProps {
   email: string;
   onEmailChange: (email: string) => void;
   verification: EmailVerificationState;
   // 인증번호 발송 오류 문구 뒤에 붙일 안내. (가입: "로그인하기" 링크처럼 오류 코드에 따라 다음 행동을 알려 줄 때 쓴다.)
   renderSendErrorExtra?: (error: { code: string; message: string }) => ReactNode;
   // true면 안내·오류 문구가 없을 때도 그 한 줄의 높이를 비워 둔다. 문구가 나타나도 입력 칸 위치가 움직이지 않게 할 때 쓴다.
   reserveMessageSpace?: boolean;
}

// 이메일 입력 칸과 "인증번호 받기" 버튼, 그 아래의 안내·오류 문구.
// 인증번호 입력(EmailCodeField)과 따로 쓸 수 있게 나눠 두었다. (화면 배치를 입력 칸 기준으로 잡을 때)
export function EmailInputField({
   email,
   onEmailChange,
   verification,
   renderSendErrorExtra,
   reserveMessageSpace = false,
}: EmailInputFieldProps) {
   const [touched, setTouched] = useState(false);
   const { status, sendError } = verification;
   const sent = status === 'sent';
   const verified = status === 'verified';

   const formatError = touched && email !== '' && !isValidEmail(email);
   const emailInvalid = Boolean(sendError) || formatError;

   return (
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

         {/* min-h-[1.375rem]: 문구 한 줄(위 여백 6px + 글자 16px = 22px)과 같은 높이. 문구가 없어도 칸 아래가 이 높이만큼 비어 있다. */}
         <div className={reserveMessageSpace ? 'min-h-[1.375rem]' : undefined}>
            {sendError ? (
               <FieldMessage id="email-message" tone="error">
                  {sendError.message}
                  {renderSendErrorExtra?.(sendError)}
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
      </div>
   );
}

interface EmailCodeFieldProps {
   email: string;
   verification: EmailVerificationState;
}

// 인증번호 입력 칸, 확인 버튼, 남은 시간과 다시 받기. 인증번호를 보낸 상태(sent)일 때만 보이고, 인증이 끝나면 사라진다.
export function EmailCodeField({ email, verification }: EmailCodeFieldProps) {
   const { status, codeError } = verification;
   const sent = status === 'sent';
   const expired = sent && !verification.timerRunning;

   if (!sent) return null;

   // 오류 문구가 있을 때만 그 id를 인증번호 칸에 연결한다. (둘 다 있으면 둘 다 읽어 준다.)
   const describedBy =
      [codeError && CODE_ERROR_ID, expired && CODE_EXPIRED_ID].filter(Boolean).join(' ') ||
      undefined;

   return (
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
               describedBy={describedBy}
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
         {codeError && (
            <FieldMessage id={CODE_ERROR_ID} tone="error">
               {codeError.message}
            </FieldMessage>
         )}
         {expired && (
            <FieldMessage id={CODE_EXPIRED_ID} tone="error">
               인증 시간이 지났어요. 인증번호를 다시 받아주세요
            </FieldMessage>
         )}
         <div className="mt-1.5 flex items-center justify-between text-xs">
            <span className="text-black/50">남은 시간 {formatTime(verification.remaining)}</span>
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
   );
}

// 이메일 입력과 인증번호 확인을 위아래로 이어 붙인 것. 회원가입이 쓴다.
// 인증번호를 받고(idle) → 번호를 입력해 확인하면(sent) 이메일이 인증 완료(verified)로 바뀐다.
export function EmailVerifyField(props: EmailInputFieldProps) {
   return (
      <div className="space-y-6">
         <EmailInputField {...props} />
         <EmailCodeField email={props.email} verification={props.verification} />
      </div>
   );
}
