'use client';

import { CircleCheck, LogOut, TriangleAlert, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { signOut } from '@/entities/user/model/sessionStore';
import type { User } from '@/entities/user/types';
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
import { useDismissibleMenu } from '@/shared/lib/useDismissibleMenu';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';

// TODO: 마이페이지 화면은 아직 없다. 마이페이지를 만들 때 이 주소를 맞춘다.
const MY_PAGE_PATH = '/mypage';

const ITEM_CLASS =
   'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-black/80 hover:bg-brand-orange-light/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent';

// 프로필을 누르면 열리는 메뉴. 이름과 사업자 인증 상태, 마이페이지, 로그아웃이 있다.
export function ProfileMenu({ user }: { user: User }) {
   const [open, setOpen] = useState(false);
   const rootRef = useRef<HTMLDivElement>(null);
   const { run, pending } = useSingleFlight();

   const close = useCallback(() => setOpen(false), []);
   useDismissibleMenu(open, rootRef, close);

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
            {/* 아주 좁은 화면에서는 헤더가 넘치지 않도록 닉네임을 숨기고 아바타만 보인다. (메뉴 안에는 보인다.) */}
            <span className="hidden text-sm font-medium text-black sm:inline">{user.nickname}</span>
         </button>

         {open && (
            <div
               role="menu"
               className="border-brand-line shadow-card absolute top-full right-0 z-10 mt-2 w-44 rounded-2xl border bg-white p-2"
            >
               <div className="border-brand-line border-b px-3 pt-2 pb-3">
                  <p className="text-sm font-bold wrap-break-word text-black">{user.nickname}</p>
                  <p
                     className={`mt-0.5 flex items-center gap-1 text-xs ${user.isBusinessVerified ? 'text-state-success' : 'text-brand-orange'}`}
                  >
                     {user.isBusinessVerified ? '사업자 인증 완료' : '사업자 미인증'}
                     {/* 아이콘은 장식이다. 상태는 옆의 글자가 알려 준다. */}
                     {user.isBusinessVerified ? (
                        <CircleCheck aria-hidden className="size-3.5 shrink-0" />
                     ) : (
                        <TriangleAlert aria-hidden className="size-3.5 shrink-0" />
                     )}
                  </p>
               </div>

               <div className="mt-2 flex flex-col">
                  <Link href={MY_PAGE_PATH} role="menuitem" onClick={close} className={ITEM_CLASS}>
                     <UserIcon aria-hidden className="size-4" />
                     마이페이지
                  </Link>
                  <button
                     type="button"
                     role="menuitem"
                     disabled={pending}
                     onClick={handleLogout}
                     className={ITEM_CLASS}
                  >
                     <LogOut aria-hidden className="size-4" />
                     로그아웃
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
