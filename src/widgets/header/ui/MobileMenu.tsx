'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@/entities/user/types';
import { Button } from '@/shared/ui/Button';
import { isActiveNav, NAV_ITEMS } from './HeaderNav';

// md 미만에서만 보이는 햄버거 메뉴. 데스크톱 헤더에서 숨겨진 nav와 "사이트 만들기"를 한 패널에 모은다.
export function MobileMenu({ user }: { user: User | null }) {
   const [open, setOpen] = useState(false);
   const pathname = usePathname();

   useEffect(() => {
      if (!open) return;

      const closeOnEscape = (event: KeyboardEvent) => {
         if (event.key === 'Escape') setOpen(false);
      };
      window.addEventListener('keydown', closeOnEscape);
      return () => window.removeEventListener('keydown', closeOnEscape);
   }, [open]);

   const close = () => setOpen(false);

   return (
      <div className="md:hidden">
         <button
            type="button"
            aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((prev) => !prev)}
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white"
         >
            {open ? (
               <X className="size-4.5 text-black/70" />
            ) : (
               <Menu className="size-4.5 text-black/70" />
            )}
         </button>

         {/* 패널은 가장 가까운 relative 조상인 header 기준으로 헤더 바로 아래에 붙는다. */}
         {open && (
            <nav
               id="mobile-menu"
               aria-label="모바일 메뉴"
               className="border-brand-line shadow-card absolute inset-x-0 top-full flex flex-col border-b bg-white px-[4%] py-4"
            >
               {NAV_ITEMS.map(({ label, href }) => {
                  const active = isActiveNav(pathname, href);
                  return (
                     <Link
                        key={href}
                        href={href}
                        onClick={close}
                        aria-current={active ? 'page' : undefined}
                        className={`cursor-pointer py-3 text-sm font-semibold hover:text-brand-orange ${
                           active ? 'text-brand-orange' : 'text-black/70'
                        }`}
                     >
                        {label}
                     </Link>
                  );
               })}

               {user && (
                  <div className="border-brand-line mt-2 border-t pt-4">
                     <Button onClick={close}>사이트 만들기</Button>
                  </div>
               )}
            </nav>
         )}
      </div>
   );
}
