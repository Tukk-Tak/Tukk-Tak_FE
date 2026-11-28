import type { User } from '@/entities/user/types';
import { CREATE_PATH } from '@/shared/config/routes';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { NotificationMenu } from './NotificationMenu';
import { ProfileMenu } from './ProfileMenu';

export function MemberActions({ user }: { user: User }) {
   return (
      <div className="flex items-center gap-4">
         {/* 모바일에서는 햄버거 메뉴(MobileMenu) 안으로 옮겨진다. */}
         <div className="hidden md:block">
            <ButtonLink href={CREATE_PATH}>사이트 만들기</ButtonLink>
         </div>
         {/* 다른 탭에서 다른 계정으로 로그인하면 이 컴포넌트는 내려가지 않고 user만 바뀐다.
             계정별 key로 알림 메뉴를 새로 만들어서, 받아 둔 알림 목록·빨간 점·읽음 기록이 이전 계정의 것으로 남지 않게 한다.
             (닉네임은 가입할 때 중복이 막히는 값이라 계정을 구분하는 데 쓸 수 있다.) */}
         <NotificationMenu key={user.nickname} />
         <ProfileMenu user={user} />
      </div>
   );
}
