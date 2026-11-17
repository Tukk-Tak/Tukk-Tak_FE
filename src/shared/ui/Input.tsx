import type { ComponentProps } from 'react';

// ComponentProps는 ref까지 포함한다. (React 19는 함수 컴포넌트도 ref를 prop으로 받는다.)
export interface InputProps extends ComponentProps<'input'> {
   invalid?: boolean;
   // 입력한 글자 색. 기본은 검정이고, brown은 브랜드 갈색을 쓰는 화면(AI 초안 등)용이다.
   tone?: 'default' | 'brown';
}

export function Input({ invalid = false, tone = 'default', className = '', ...props }: InputProps) {
   // 두 테두리 색 클래스를 함께 두면 우선순위가 불분명해서, 상태에 따라 하나만 고른다.
   const stateClass = invalid
      ? 'border-state-error focus:border-state-error'
      : 'border-brand-line focus:border-brand-orange';

   // 글자색과 placeholder 색을 한 쌍으로 고른다. (두 색을 따로 겹쳐 쓰면 우선순위가 불분명하다.)
   const textClass =
      tone === 'brown'
         ? 'text-brand-brown placeholder:text-brand-brown/50'
         : 'text-black placeholder:text-black/25';

   return (
      <input
         aria-invalid={invalid || undefined}
         className={`${stateClass} h-10 w-full rounded-xl border bg-white px-5 text-sm ${textClass} outline-none read-only:bg-field-readonly read-only:text-black/60 ${className}`}
         {...props}
      />
   );
}
