import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { HeaderSession } from './HeaderSession';

// 스크롤해도 화면 위에 고정된다. (sticky라 자리를 차지해서 본문에 별도 여백이 필요 없다)
// 오른쪽 영역은 로그인 상태에 따라 달라지므로 HeaderSession(클라이언트)이 맡는다.
// md 미만에서는 nav를 숨기고 MobileMenu(햄버거)로 대신한다. 로그인/회원가입 버튼은 모바일에서도 밖에 둔다.
export function Header() {
   return (
      <header className="sticky top-0 z-50 h-16 border-b border-brand-line bg-white">
         <div className="mx-auto flex h-full max-w-full items-center justify-between px-[4%]">
            <div className="flex items-center gap-10">
               <HeaderLogo />
               <div className="hidden md:block">
                  <HeaderNav />
               </div>
            </div>
            <HeaderSession />
         </div>
      </header>
   );
}
