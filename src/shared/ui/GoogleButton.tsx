import type { ButtonHTMLAttributes } from 'react';
import { GoogleIcon } from './GoogleIcon';

// 모양만 담당한다. 구글 로그인을 시작하는 동작은 호출하는 쪽에서 onClick으로 넘긴다.
// className을 넘기면 기본 모양 뒤에 덧붙는다. (바깥 요소의 hover를 따라 색을 바꾸는 등)
export function GoogleButton({
   className = '',
   ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
   return (
      <button
         type="button"
         className={`border-brand-line flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg border bg-white py-2.5 text-base font-bold text-black not-disabled:hover:bg-brand-orange-light/40 disabled:cursor-not-allowed disabled:bg-field-disabled disabled:text-black/30 ${className}`}
         {...props}
      >
         <GoogleIcon />
         구글 계정으로 계속하기
      </button>
   );
}
