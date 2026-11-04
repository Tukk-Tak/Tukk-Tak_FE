import type { InputHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
   children: ReactNode;
}

export function Checkbox({ children, className = '', ...props }: CheckboxProps) {
   return (
      <label
         className={`flex cursor-pointer items-center gap-2 text-xs text-black/80 ${className}`}
      >
         <input type="checkbox" className="size-4 cursor-pointer accent-brand-orange" {...props} />
         {children}
      </label>
   );
}
