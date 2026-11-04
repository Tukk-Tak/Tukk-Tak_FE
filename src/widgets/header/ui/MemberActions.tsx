import { Bell } from 'lucide-react';
import type { User } from '@/entities/user/types';
import { Button } from '@/shared/ui/Button';
import { ProfileMenu } from './ProfileMenu';

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
         <ProfileMenu user={user} />
      </div>
   );
}
