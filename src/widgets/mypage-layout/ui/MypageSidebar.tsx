'use client';

import type { User } from '@/entities/user/types';
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { MypageNav } from './MypageNav';

// 사이드바 위쪽의 내 정보. 닉네임, 가입 유형(사업자), 본명을 보여 준다.
// TODO: "사업자" 표시는 지금 고정이다. 가입 유형이 백엔드 응답에 생기면 그 값으로 바꾼다.
function ProfileSummary({ user }: { user: User }) {
   return (
      // 아바타는 왼쪽, 닉네임과 가입 유형은 오른쪽에 둔다.
      <div className="flex items-center gap-4">
         <UserAvatar nickname={user.nickname} size="md" />
         <div className="min-w-0">
            <p className="truncate text-lg font-bold text-black">{user.nickname}</p>
            <p className="mt-1.5 flex items-center gap-2">
               <span className="bg-brand-orange-light shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-brand-brown">
                  사업자
               </span>
               <span className="truncate text-xs text-black/40">{user.name} 사장님</span>
            </p>
         </div>
      </div>
   );
}

// 마이페이지 왼쪽 메뉴. 큰 화면에서는 고정된 세로 사이드바이고(내용만 스크롤된다),
// 작은 화면에서는 내 정보는 숨기고(회원 정보 화면에 같은 내용이 있다) 메뉴만 가로로 넘겨 보는 탭으로 바꿔, 내용이 들어갈 높이를 아낀다.
export function MypageSidebar({ user }: { user: User }) {
   return (
      <>
         <aside className="bg-brand-cream border-brand-line hidden w-72 shrink-0 border-r md:block">
            <ScrollArea className="h-full" contentClassName="px-6 py-10">
               <ProfileSummary user={user} />
               <div className="border-brand-line my-8 border-t" />
               <MypageNav variant="list" />
            </ScrollArea>
         </aside>

         <div className="bg-brand-cream border-brand-line border-b md:hidden">
            <ScrollArea orientation="horizontal" label="마이페이지 메뉴 목록">
               <MypageNav variant="tabs" />
            </ScrollArea>
         </div>
      </>
   );
}
