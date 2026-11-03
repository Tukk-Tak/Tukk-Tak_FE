import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className = '', type = 'button', ...props }: ButtonProps) {
   return (
      <button
         type={type}
         className={`bg-brand-orange hover:bg-brand-orange-hover inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors ${className}`}
         {...props}
      />
   );
}
