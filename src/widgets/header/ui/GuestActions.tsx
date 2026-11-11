import Link from 'next/link';
import { ButtonLink } from '@/shared/ui/ButtonLink';

export function GuestActions() {
   return (
      <div className="flex items-center gap-7">
         <Link
            href="/login"
            className="cursor-pointer text-sm font-medium text-black hover:text-brand-orange"
         >
            로그인
         </Link>
         <ButtonLink href="/signup">회원가입</ButtonLink>
      </div>
   );
}
