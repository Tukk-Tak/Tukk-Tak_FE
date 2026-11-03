import { Bell } from 'lucide-react';
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
import type { User } from '@/entities/user/types';
import { Button } from '@/shared/ui/Button';

export function MemberActions({ user }: { user: User }) {
   return (
      <div className="flex items-center gap-4">
         {/* 모바일에서는 햄버거 메뉴(MobileMenu) 안으로 옮겨진다. */}
         <div className="hidden md:block">
            <Button>사이트 만들기</Button>
         </div>
         <button
            type="button"
            aria-label="알림"
            className="relative flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white"
         >
            <Bell className="size-4.5 text-black/70" />
            <span className="absolute top-1.5 right-2.5 size-1.5 rounded-full bg-red-500" />
         </button>
         <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white py-1 pr-1 pl-1 sm:pr-4"
         >
            <UserAvatar nickname={user.nickname} />
            {/* 아주 좁은 화면에서는 헤더가 넘치지 않도록 닉네임을 숨기고 아바타만 보인다. */}
            <span className="hidden text-sm font-medium text-black sm:inline">{user.nickname}</span>
         </button>
      </div>
   );
}
