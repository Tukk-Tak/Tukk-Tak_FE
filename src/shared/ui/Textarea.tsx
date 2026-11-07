import type { ComponentProps } from 'react';

export interface TextareaProps extends ComponentProps<'textarea'> {
   invalid?: boolean;
}

// 여러 줄 입력. Input과 같은 테두리·포커스 모양이다. 크기는 rows나 className으로 정하고, 직접 늘리는 것은 막는다.
export function Textarea({ invalid = false, className = '', ...props }: TextareaProps) {
   const stateClass = invalid
      ? 'border-state-error focus:border-state-error'
      : 'border-brand-line focus:border-brand-orange';

   return (
      <textarea
         aria-invalid={invalid || undefined}
         className={`${stateClass} w-full resize-none rounded-xl border bg-white px-5 py-4 text-sm text-black outline-none placeholder:text-black/25 disabled:bg-field-disabled disabled:text-black/40 ${className}`}
         {...props}
      />
   );
}
