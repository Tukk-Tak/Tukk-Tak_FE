import type { ReactNode } from 'react';

interface FormFieldProps {
   label: string;
   htmlFor: string;
   required?: boolean;
   // 라벨 글자 크기. 로그인·가입 폼은 기본값(xs)을 쓰고, 입력 항목이 많은 화면은 sm을 쓴다.
   labelSize?: 'xs' | 'sm';
   // 라벨 글자 색. 기본은 검정이고, brown은 AI 초안 화면처럼 브랜드 갈색을 쓰는 화면용이다.
   labelTone?: 'default' | 'brown';
   children: ReactNode;
}

export function FormField({
   label,
   htmlFor,
   required = false,
   labelSize = 'xs',
   labelTone = 'default',
   children,
}: FormFieldProps) {
   return (
      <div>
         <label
            htmlFor={htmlFor}
            className={`mb-2.5 block font-bold ${labelTone === 'brown' ? 'text-brand-brown' : 'text-black'} ${labelSize === 'sm' ? 'text-sm' : 'text-xs'}`}
         >
            {label}
            {required && (
               <span aria-hidden className="ml-1 text-brand-orange">
                  *
               </span>
            )}
         </label>
         {children}
      </div>
   );
}
