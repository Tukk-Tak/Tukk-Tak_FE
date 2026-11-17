'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import { checkPasswordRules } from '../lib/passwordRules';
import { FieldMessage } from './FieldMessage';
import { FormField } from './FormField';
import { PasswordInput } from './PasswordInput';
import { PasswordRules } from './PasswordRules';

interface PasswordFieldsProps {
   password: string;
   passwordConfirm: string;
   onPasswordChange: (value: string) => void;
   onPasswordConfirmChange: (value: string) => void;
   // 비밀번호 칸의 이름. 회원가입은 "비밀번호", 재설정은 "새 비밀번호"를 쓴다.
   label?: string;
   placeholder?: string;
   // 이 입력이 화면에 나타날 때 비밀번호 칸으로 바로 포커스를 옮긴다. (이메일 인증 뒤에 나타나는 재설정이 쓴다.)
   autoFocus?: boolean;
}

// 비밀번호와 비밀번호 확인 입력. 규칙 충족 여부와 두 값의 일치 여부를 입력 칸 아래에 알려 준다.
// 회원가입과 비밀번호 재설정이 함께 쓴다.
export function PasswordFields({
   password,
   passwordConfirm,
   onPasswordChange,
   onPasswordConfirmChange,
   label = '비밀번호',
   placeholder,
   autoFocus = false,
}: PasswordFieldsProps) {
   const [passwordTouched, setPasswordTouched] = useState(false);
   const [confirmTouched, setConfirmTouched] = useState(false);

   const results = checkPasswordRules(password);
   const allPassed = results.every((rule) => rule.passed);
   // 입력 칸을 벗어난 뒤에야 미충족을 오류로 알린다. (입력 도중에는 아직 쓰는 중이므로)
   const showFailures = passwordTouched && password !== '' && !allPassed;

   const confirmMatches = passwordConfirm !== '' && passwordConfirm === password;
   const confirmMismatch = confirmTouched && passwordConfirm !== '' && passwordConfirm !== password;

   return (
      <div className="space-y-6">
         <div>
            <FormField label={label} htmlFor="password" required>
               <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  autoFocus={autoFocus}
                  placeholder={placeholder}
                  value={password}
                  invalid={showFailures}
                  aria-describedby="password-rules"
                  onChange={(event) => onPasswordChange(event.target.value)}
                  onBlur={() => setPasswordTouched(true)}
               />
            </FormField>
            {allPassed ? (
               <FieldMessage
                  id="password-rules"
                  tone="success"
                  className="mt-3 flex items-center gap-2 text-[13px]"
               >
                  <span
                     aria-hidden
                     className="bg-state-success flex size-4 items-center justify-center rounded-full text-white"
                  >
                     <Check className="size-2.5" strokeWidth={4} />
                  </span>
                  사용할 수 있는 비밀번호예요
               </FieldMessage>
            ) : (
               <PasswordRules
                  listId="password-rules"
                  results={results}
                  showFailures={showFailures}
               />
            )}
         </div>

         <div>
            <FormField label="비밀번호 확인" htmlFor="passwordConfirm" required>
               <PasswordInput
                  id="passwordConfirm"
                  name="passwordConfirm"
                  autoComplete="new-password"
                  placeholder={placeholder}
                  value={passwordConfirm}
                  invalid={confirmMismatch}
                  aria-describedby="password-confirm-message"
                  onChange={(event) => onPasswordConfirmChange(event.target.value)}
                  onBlur={() => setConfirmTouched(true)}
               />
            </FormField>
            {confirmMismatch && (
               <FieldMessage id="password-confirm-message" tone="error">
                  비밀번호가 서로 달라요
               </FieldMessage>
            )}
            {confirmMatches && (
               <FieldMessage id="password-confirm-message" tone="success">
                  비밀번호가 일치해요
               </FieldMessage>
            )}
         </div>
      </div>
   );
}
