import { HeaderLogo } from './HeaderLogo';
import { HeaderNav } from './HeaderNav';
import { HeaderSession } from './HeaderSession';

// (main) 레이아웃이 화면 높이를 헤더와 본문으로 나누므로, 스크롤해도 헤더는 항상 화면 위에 있다.
// shrink-0: 본문이 길어도 헤더 높이(--header-height)가 줄어들지 않게 한다. relative는 모바일 메뉴 패널의 기준 위치이다.
// 오른쪽 영역은 로그인 상태에 따라 달라지므로 HeaderSession(클라이언트)이 맡는다.
// md 미만에서는 nav를 숨기고 MobileMenu(햄버거)로 대신한다. 로그인/회원가입 버튼은 모바일에서도 밖에 둔다.
export function Header() {
   return (
      <header className="relative z-50 h-(--header-height) shrink-0 border-b border-brand-line bg-white">
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
