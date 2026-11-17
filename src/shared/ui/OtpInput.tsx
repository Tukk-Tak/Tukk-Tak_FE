'use client';

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react';

interface OtpInputProps {
   idPrefix: string;
   label: string;
   value: string;
   onChange: (value: string) => void;
   length?: number;
   invalid?: boolean;
   disabled?: boolean;
   // 오류 설명 요소의 id(여러 개면 공백으로 이어 쓴다). 각 칸에 연결해서, 스크린 리더가 칸으로 돌아왔을 때 오류 이유를 알려 준다.
   describedBy?: string;
}

// 숫자 한 칸씩 입력하는 인증번호 칸. value는 앞에서부터 빈틈없이 채워진 숫자 문자열이다.
export function OtpInput({
   idPrefix,
   label,
   value,
   onChange,
   length = 6,
   invalid = false,
   disabled = false,
   describedBy,
}: OtpInputProps) {
   const inputs = useRef<Array<HTMLInputElement | null>>([]);
   const pendingFocus = useRef<number | null>(null);
   const digits = Array.from({ length }, (_, index) => value[index] ?? '');

   const focusAt = (index: number) => {
      inputs.current[Math.min(Math.max(index, 0), length - 1)]?.focus();
   };

   // 값이 바뀐 뒤의 포커스 이동은 화면이 새 값으로 다시 그려진 다음에 해야 한다.
   // 바로 옮기면 handleFocus가 갱신 전의 value를 보고 포커스를 첫 빈칸으로 되돌려 버린다.
   useEffect(() => {
      if (pendingFocus.current === null) return;
      focusAt(pendingFocus.current);
      pendingFocus.current = null;
   });

   const commit = (nextValue: string, focusIndex: number) => {
      if (nextValue === value) {
         // 값이 같으면 다시 그려지지 않으므로, 기다리지 않고 바로 옮긴다.
         focusAt(focusIndex);
         return;
      }
      pendingFocus.current = focusIndex;
      onChange(nextValue);
   };

   const handleChange = (index: number, raw: string) => {
      const typed = raw.replace(/\D/g, '');
      if (!typed) return;

      // 문자 인증번호 자동완성처럼 여러 자리가 한 번에 들어오면, 현재 칸부터 차례로 채운다.
      if (typed.length > 1 && !digits[index]) {
         const filled = (value.slice(0, index) + typed).slice(0, length);
         commit(filled, filled.length);
         return;
      }

      // 이미 숫자가 있는 칸에 덧입력하면 두 글자가 되므로, 방금 입력한 마지막 글자만 쓴다.
      const next = digits.slice();
      next[index] = typed.slice(-1);
      commit(next.join(''), index + 1);
   };

   const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace') {
         event.preventDefault();
         if (digits[index]) {
            commit(digits.slice(0, index).join('') + digits.slice(index + 1).join(''), index);
         } else if (index > 0) {
            commit(digits.slice(0, index - 1).join('') + digits.slice(index).join(''), index - 1);
         }
      } else if (event.key === 'ArrowLeft') {
         event.preventDefault();
         focusAt(index - 1);
      } else if (event.key === 'ArrowRight') {
         event.preventDefault();
         focusAt(index + 1);
      }
   };

   const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
      if (!pasted) return;

      commit(pasted, pasted.length);
   };

   const handleFocus = (index: number, input: HTMLInputElement) => {
      // 빈칸을 건너뛰어 입력하면 값 사이에 구멍이 생기므로, 항상 첫 빈칸에서부터 입력하게 한다.
      if (index > value.length) {
         focusAt(value.length);
         return;
      }
      input.select();
   };

   const stateClass = invalid
      ? 'border-state-error focus:border-state-error'
      : 'border-brand-line focus:border-brand-orange';

   return (
      <div role="group" aria-label={label} className="flex gap-2">
         {digits.map((digit, index) => (
            <input
               key={index}
               ref={(element) => {
                  inputs.current[index] = element;
               }}
               id={`${idPrefix}-${index}`}
               inputMode="numeric"
               autoComplete={index === 0 ? 'one-time-code' : 'off'}
               value={digit}
               disabled={disabled}
               aria-label={`${label} ${index + 1}번째 자리`}
               aria-invalid={invalid || undefined}
               aria-describedby={describedBy}
               onChange={(event) => handleChange(index, event.target.value)}
               onKeyDown={(event) => handleKeyDown(index, event)}
               onPaste={handlePaste}
               onFocus={(event) => handleFocus(index, event.target)}
               className={`${stateClass} disabled:bg-field-readonly h-11 w-8 rounded-xl border bg-white text-center text-base text-black outline-none sm:w-10`}
            />
         ))}
      </div>
   );
}
