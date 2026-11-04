import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
   invalid?: boolean;
}

export function Input({ invalid = false, className = '', ...props }: InputProps) {
   // 두 테두리 색 클래스를 함께 두면 우선순위가 불분명해서, 상태에 따라 하나만 고른다.
   const stateClass = invalid
      ? 'border-state-error focus:border-state-error'
      : 'border-brand-line focus:border-brand-orange';

   return (
      <input
         aria-invalid={invalid || undefined}
         className={`${stateClass} h-10 w-full rounded-xl border bg-white px-5 text-sm text-black outline-none placeholder:text-black/25 read-only:bg-field-readonly read-only:text-black/60 ${className}`}
         {...props}
      />
   );
}
