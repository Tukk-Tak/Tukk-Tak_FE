import { Bell } from 'lucide-react';
import { UserAvatar } from '@/entities/user/ui/UserAvatar';
import type { User } from '@/entities/user/types';
import { Button } from '@/shared/ui/Button';

export function MemberActions({ user }: { user: User }) {
   return (
      <div className="flex items-center gap-4">
         <Button>사이트 만들기</Button>
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
            className="flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white py-1 pr-4 pl-1"
         >
            <UserAvatar nickname={user.nickname} />
            <span className="text-sm font-medium text-black">{user.nickname}</span>
         </button>
      </div>
   );
}
