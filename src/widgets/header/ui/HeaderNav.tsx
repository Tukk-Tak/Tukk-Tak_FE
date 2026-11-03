import Link from 'next/link';

// 모바일 메뉴(MobileMenu)에서도 같은 목록을 쓴다.
export const NAV_ITEMS = [
   { label: '커뮤니티', href: '/community' },
   { label: '요금제', href: '/pricing' },
];

export function HeaderNav() {
   return (
      <nav className="flex items-center gap-8">
         {NAV_ITEMS.map(({ label, href }) => (
            <Link
               key={href}
               href={href}
               className="cursor-pointer text-sm font-semibold text-black/70 hover:text-brand-orange"
            >
               {label}
            </Link>
         ))}
      </nav>
   );
}
