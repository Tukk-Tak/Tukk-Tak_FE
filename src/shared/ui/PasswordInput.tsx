'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Input, type InputProps } from './Input';

type PasswordInputProps = Omit<InputProps, 'type'>;

export function PasswordInput({ className = '', ...props }: PasswordInputProps) {
   const [visible, setVisible] = useState(false);
   const Icon = visible ? Eye : EyeOff;

   return (
      <div className="relative">
         <Input type={visible ? 'text' : 'password'} className={`pr-14 ${className}`} {...props} />
         <button
            type="button"
            aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
            aria-pressed={visible}
            onClick={() => setVisible((prev) => !prev)}
            className="absolute inset-y-0 right-5 flex cursor-pointer items-center text-black/40 hover:text-black/60"
         >
            <Icon className="size-5" />
         </button>
      </div>
   );
}
