'use client';

import type { ReactNode } from 'react';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { isDefaultText } from './isDefaultText';

interface FieldLabelProps {
   htmlFor: string;
   label: string;
   required?: boolean;
   // 선택 입력이면 라벨 옆에 "(선택)"을 붙인다.
   optional?: boolean;
   // 값이 기본 문구 그대로이면 "기본 문구" 표시를 붙인다.
   isDefault?: boolean;
}

export function FieldLabel({ htmlFor, label, required, optional, isDefault }: FieldLabelProps) {
   return (
      <label
         htmlFor={htmlFor}
         className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-brown"
      >
         {label}
         {required && (
            <span aria-hidden className="text-brand-orange">
               *
            </span>
         )}
         {optional && <span className="font-normal text-[#A6A09B]">(선택)</span>}
         {isDefault && (
            <span className="rounded bg-brand-orange-light px-1.5 py-0.5 text-[10px] leading-none font-bold text-brand-orange">
               기본 문구
            </span>
         )}
      </label>
   );
}

interface TextFieldProps {
   id: string;
   label: string;
   value: string | undefined;
   onChange: (value: string) => void;
   maxLength: number;
   // 필수 입력. 배포할 때 비어 있으면 안 되는 항목이고, 비어 있으면 안내가 나온다. (편집 중에는 막지 않는다)
   required?: boolean;
   optional?: boolean;
   placeholder?: string;
   // 여러 줄 입력. 글자 수 카운터를 함께 보여 준다.
   multiline?: boolean;
   rows?: number;
   type?: 'text' | 'email' | 'tel';
   // 입력값을 걸러서 저장할 때(예: 전화번호)
   transform?: (value: string) => string;
   error?: string;
   hint?: ReactNode;
}

// 블록 내용을 입력하는 한 칸. 필수 표시, 기본 문구 표시, 글자 수 제한을 한곳에서 처리한다.
export function TextField({
   id,
   label,
   value,
   onChange,
   maxLength,
   required,
   optional,
   placeholder,
   multiline,
   rows = 4,
   type = 'text',
   transform,
   error,
   hint,
}: TextFieldProps) {
   const text = value ?? '';
   const isEmptyRequired = Boolean(required) && text.trim() === '';
   const message = error ?? (isEmptyRequired ? '입력해 주세요' : undefined);
   const describedBy = message || hint ? `${id}-message` : undefined;
   const handleChange = (next: string) => onChange(transform ? transform(next) : next);

   return (
      <div>
         <FieldLabel
            htmlFor={id}
            label={label}
            required={required}
            optional={optional}
            isDefault={isDefaultText(text)}
         />
         {multiline ? (
            <div className="relative">
               <Textarea
                  tone="brown"
                  id={id}
                  rows={rows}
                  value={text}
                  maxLength={maxLength}
                  placeholder={placeholder}
                  invalid={Boolean(message)}
                  aria-required={required || undefined}
                  aria-describedby={describedBy}
                  className="px-4 py-3 pb-8"
                  onChange={(event) => handleChange(event.target.value)}
               />
               <span className="pointer-events-none absolute right-3 bottom-2 text-[11px] text-[#A6A09B]">
                  {text.length}/{maxLength}
               </span>
            </div>
         ) : (
            <Input
               tone="brown"
               id={id}
               type={type}
               value={text}
               maxLength={maxLength}
               placeholder={placeholder}
               invalid={Boolean(message)}
               aria-required={required || undefined}
               aria-describedby={describedBy}
               className="px-4"
               onChange={(event) => handleChange(event.target.value)}
            />
         )}
         {message ? (
            <FieldMessage id={`${id}-message`} tone="error">
               {message}
            </FieldMessage>
         ) : (
            hint && <FieldMessage id={`${id}-message`}>{hint}</FieldMessage>
         )}
      </div>
   );
}
