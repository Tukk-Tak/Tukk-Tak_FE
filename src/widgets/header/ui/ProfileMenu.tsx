'use client';

import { LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { signOut } from '@/entities/user/model/sessionStore';
import type { User } from '@/entities/user/types';
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';

// 프로필을 누르면 열리는 작은 메뉴. 지금은 로그아웃만 있다. (시안이 정해지면 바꾼다.)
export function ProfileMenu({ user }: { user: User }) {
   const [open, setOpen] = useState(false);
   const rootRef = useRef<HTMLDivElement>(null);
   const { run, pending } = useSingleFlight();

   useEffect(() => {
      if (!open) return;

      const closeOnEscape = (event: KeyboardEvent) => {
         if (event.key === 'Escape') setOpen(false);
      };
      const closeOnOutsideClick = (event: PointerEvent) => {
         if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
      };
      window.addEventListener('keydown', closeOnEscape);
      window.addEventListener('pointerdown', closeOnOutsideClick);
      return () => {
         window.removeEventListener('keydown', closeOnEscape);
         window.removeEventListener('pointerdown', closeOnOutsideClick);
      };
   }, [open]);

   const handleLogout = () =>
      run(async () => {
         await signOut();
         setOpen(false);
      });

   return (
      <div ref={rootRef} className="relative">
         <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white py-1 pr-1 pl-1 sm:pr-4"
         >
            <UserAvatar nickname={user.nickname} />
            {/* 아주 좁은 화면에서는 헤더가 넘치지 않도록 닉네임을 숨기고 아바타만 보인다. */}
            <span className="hidden text-sm font-medium text-black sm:inline">{user.nickname}</span>
         </button>

         {open && (
            <div
               role="menu"
               className="border-brand-line shadow-card absolute top-full right-0 mt-2 min-w-36 rounded-xl border bg-white p-1.5"
            >
               <button
                  type="button"
                  role="menuitem"
                  disabled={pending}
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-black/80 not-disabled:hover:bg-brand-orange-light/60 disabled:cursor-not-allowed disabled:opacity-50"
               >
                  <LogOut aria-hidden className="size-4" />
                  로그아웃
               </button>
            </div>
         )}
      </div>
   );
}
