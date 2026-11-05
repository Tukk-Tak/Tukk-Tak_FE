'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 모바일 메뉴(MobileMenu)에서도 같은 목록을 쓴다.
export const NAV_ITEMS = [
   { label: '커뮤니티', href: '/community' },
   { label: '요금제', href: '/pricing' },
];

// 지금 보고 있는 페이지(하위 경로 포함)의 메뉴인지. 헤더 메뉴를 주황색으로 표시하는 데 쓴다.
export function isActiveNav(pathname: string, href: string) {
   return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav() {
   const pathname = usePathname();

   return (
      <nav className="flex items-center gap-8">
         {NAV_ITEMS.map(({ label, href }) => {
            const active = isActiveNav(pathname, href);
            return (
               <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`cursor-pointer text-sm font-semibold hover:text-brand-orange ${
                     active ? 'text-brand-orange' : 'text-black/70'
                  }`}
               >
                  {label}
               </Link>
            );
         })}
      </nav>
   );
}
