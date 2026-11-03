import type { User } from '@/entities/user/types';
import { GuestActions } from './GuestActions';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { MemberActions } from './MemberActions';
import { MobileMenu } from './MobileMenu';

// user가 null이면 로그인 전. 세션 연동 전까지는 호출하는 쪽에서 값을 넘긴다.
// md 미만에서는 nav를 숨기고 MobileMenu(햄버거)로 대신한다. 로그인/회원가입 버튼은 모바일에서도 밖에 둔다.
export function Header({ user }: { user: User | null }) {
   return (
      <header className="relative z-50 h-16 border-b border-brand-line bg-white">
         <div className="mx-auto flex h-full max-w-full items-center justify-between px-[4%]">
            <div className="flex items-center gap-10">
               <HeaderLogo />
               <div className="hidden md:block">
                  <HeaderNav />
               </div>
            </div>
            <div className="flex items-center gap-3">
               {user ? <MemberActions user={user} /> : <GuestActions />}
               <MobileMenu user={user} />
            </div>
         </div>
      </header>
   );
}
