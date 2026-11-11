import Link from 'next/link';
import type { ComponentProps } from 'react';
import { buttonClassName, type ButtonSize, type ButtonVariant } from './Button';

// 이동이 목적인 버튼은 <button>이 아니라 링크로 렌더링한다. (버튼 안에 링크를 넣으면 잘못된 HTML)
interface ButtonLinkProps extends ComponentProps<typeof Link> {
   size?: ButtonSize;
   variant?: ButtonVariant;
}

export function ButtonLink({
   size = 'md',
   variant = 'solid',
   className = '',
   ...props
}: ButtonLinkProps) {
   return <Link className={buttonClassName(size, className, variant)} {...props} />;
}
