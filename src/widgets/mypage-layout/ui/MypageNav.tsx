'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { isActivePath } from '@/shared/lib/isActivePath';
import { MYPAGE_MENU, type MypageMenuItem } from '../model/menu';

interface MypageNavProps {
   // list: 큰 화면의 세로 목록(사이드바) / tabs: 작은 화면의 가로 탭
   variant: 'list' | 'tabs';
}

function itemClass(variant: MypageNavProps['variant'], { muted }: MypageMenuItem, active: boolean) {
   if (variant === 'tabs') {
      // block: 인라인이면 위아래 여백이 줄 높이에 반영되지 않아 탭이 줄 밖으로 삐져나와 스크롤바와 겹친다.
      return `block shrink-0 rounded-full px-4 py-2 text-sm whitespace-nowrap ${
         active
            ? 'bg-brand-orange-light font-bold text-brand-orange'
            : `font-medium hover:text-brand-orange ${muted ? 'text-black/40' : 'text-black/70'}`
      }`;
   }
   // 현재 메뉴는 왼쪽 주황 막대와 옅은 주황 배경으로 보여 준다. (막대 자리는 항상 잡아 두어 선택이 바뀌어도 글자가 움직이지 않는다.)
   return `block rounded-lg border-l-4 px-4 py-3.5 text-sm ${
      active
         ? 'border-brand-orange bg-brand-orange-light font-bold text-brand-brown'
         : `border-transparent font-medium hover:bg-brand-orange-light/50 ${
              muted ? 'text-black/40' : 'text-black/70'
           }`
   }`;
}

// 마이페이지 메뉴. 지금 보고 있는 화면(하위 경로 포함)을 aria-current로 알린다.
export function MypageNav({ variant }: MypageNavProps) {
   const pathname = usePathname();
   const activeRef = useRef<HTMLAnchorElement>(null);

   // 가로 탭은 화면보다 길어서, 현재 탭(예: 맨 끝의 회원 탈퇴)이 보이지 않을 수 있다. 화면이 바뀌면 현재 탭을 가운데로 옮겨 보여 준다.
   useEffect(() => {
      if (variant === 'tabs')
         activeRef.current?.scrollIntoView({ inline: 'center', block: 'nearest' });
   }, [variant, pathname]);

   return (
      <nav aria-label="마이페이지 메뉴">
         <ul className={variant === 'tabs' ? 'flex gap-1 px-[4%] pt-2 pb-4' : 'space-y-1.5'}>
            {MYPAGE_MENU.map((item) => {
               const active = isActivePath(pathname, item.href);
               return (
                  <li key={item.href} className={variant === 'tabs' ? 'shrink-0' : undefined}>
                     <Link
                        ref={active ? activeRef : undefined}
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`cursor-pointer ${itemClass(variant, item, active)}`}
                     >
                        {item.label}
                     </Link>
                  </li>
               );
            })}
         </ul>
      </nav>
   );
}
