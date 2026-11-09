import type { User } from '@/entities/user/types';
import { Button } from '@/shared/ui/Button';
import { NotificationMenu } from './NotificationMenu';
import { ProfileMenu } from './ProfileMenu';

export function MemberActions({ user }: { user: User }) {
   return (
      <div className="flex items-center gap-4">
         {/* 모바일에서는 햄버거 메뉴(MobileMenu) 안으로 옮겨진다. */}
         <div className="hidden md:block">
            <Button>사이트 만들기</Button>
         </div>
         <NotificationMenu />
         <ProfileMenu user={user} />
      </div>
   );
}
