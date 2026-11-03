import type { User } from '@/entities/user/types';
import { GuestActions } from './GuestActions';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { MemberActions } from './MemberActions';

// user가 null이면 로그인 전. 세션 연동 전까지는 호출하는 쪽에서 값을 넘긴다.
export function Header({ user }: { user: User | null }) {
   return (
      <header className="h-16 border-b border-[#EAD8C2] bg-white">
         <div className="mx-auto flex h-full max-w-full items-center justify-between px-[4%]">
            <div className="flex items-center gap-10">
               <HeaderLogo />
               <HeaderNav />
            </div>
            {user ? <MemberActions user={user} /> : <GuestActions />}
         </div>
      </header>
   );
}
