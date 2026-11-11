'use client';

import type { ReactNode } from 'react';
import { useMemberOnly } from '@/entities/user/model/useMemberOnly';
import { useSession } from '@/entities/user/model/useSession';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { MypageSidebar } from './MypageSidebar';

// 마이페이지 공용 틀. 로그인한 사용자만 볼 수 있고, 헤더를 뺀 남은 높이를 사이드바와 내용이 나눠 쓴다.
// 큰 화면: 사이드바는 고정이고 오른쪽 내용만 스크롤 / 작은 화면: 위에 메뉴 탭, 아래에 내용이 이어진다.
// 세션을 확인하는 동안과 로그인 화면으로 이동하는 동안에는 아무것도 그리지 않아, 비로그인 사용자에게 내용이 보이지 않게 한다.
export function MypageLayout({ children }: { children: ReactNode }) {
   const { allowed } = useMemberOnly();
   const { user } = useSession();

   if (!allowed || !user) return null;

   return (
      <div className="flex h-full flex-col md:flex-row">
         <MypageSidebar user={user} />

         {/* 안쪽 div: 스크롤 영역 자신의 아래 여백은 끝까지 스크롤했을 때 사라지므로, 여백은 안쪽에 둔다. */}
         <main className="relative min-h-0 min-w-0 flex-1 bg-white">
            <ScrollArea className="h-full">
               <div className="w-full max-w-6xl px-[4%] py-8 md:px-14 md:py-12">{children}</div>
            </ScrollArea>
         </main>
      </div>
   );
}
