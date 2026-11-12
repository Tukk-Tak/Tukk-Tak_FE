import type { ButtonHTMLAttributes } from 'react';

export type ButtonSize = 'md' | 'lg' | 'form' | 'field';
export type ButtonVariant = 'solid' | 'outline';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   size?: ButtonSize;
   variant?: ButtonVariant;
}

// 크기·모양별 클래스를 한 곳에 모아 className 덮어쓰기로 인한 우선순위 충돌을 피한다.
const SIZE_CLASS: Record<ButtonSize, string> = {
   md: 'rounded-lg px-4 py-2 text-sm',
   lg: 'gap-2 rounded-lg px-7 py-3.5 text-base',
   form: 'h-11 rounded-lg px-6 text-base', // 폼 아래쪽의 큰 버튼
   field: 'h-10 shrink-0 rounded-xl px-4 text-sm', // 입력 칸 옆에 놓는 버튼. 높이는 Input과 맞춘다.
};

// hover를 not-disabled로 한정해, 비활성 버튼과 링크(<a>) 모두에서 같은 스타일을 쓴다.
// (:enabled 는 폼 요소에만 걸려서 링크에는 hover가 적용되지 않는다.)
const VARIANT_CLASS: Record<ButtonVariant, string> = {
   solid: 'bg-brand-orange not-disabled:hover:bg-brand-orange-hover disabled:bg-brand-line font-bold text-white',
   outline:
      'border border-brand-line bg-white font-medium text-black not-disabled:hover:bg-brand-orange-light/40 hover:border-brand-orange disabled:bg-field-disabled disabled:text-black/30',
};

export function buttonClassName(
   size: ButtonSize = 'md',
   className = '',
   variant: ButtonVariant = 'solid',
) {
   return `inline-flex cursor-pointer items-center justify-center transition-colors disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`;
}

export function Button({
   size = 'md',
   variant = 'solid',
   className = '',
   type = 'button',
   ...props
}: ButtonProps) {
   return <button type={type} className={buttonClassName(size, className, variant)} {...props} />;
}
