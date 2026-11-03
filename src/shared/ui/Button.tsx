import type { ButtonHTMLAttributes } from 'react';

type ButtonSize = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   size?: ButtonSize;
}

// 크기별 클래스를 한 곳에 모아 className 덮어쓰기로 인한 우선순위 충돌을 피한다.
const SIZE_CLASS: Record<ButtonSize, string> = {
   md: 'px-4 py-2 text-sm',
   lg: 'gap-2 px-7 py-3.5 text-base',
};

export function Button({ size = 'md', className = '', type = 'button', ...props }: ButtonProps) {
   return (
      <button
         type={type}
         className={`bg-brand-orange hover:bg-brand-orange-hover inline-flex cursor-pointer items-center justify-center rounded-lg font-bold text-white transition-colors ${SIZE_CLASS[size]} ${className}`}
         {...props}
      />
   );
}
