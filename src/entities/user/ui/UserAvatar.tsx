import type { User } from '../types';

const SIZE_CLASS = {
   // 헤더의 프로필 버튼
   sm: 'size-7 text-xs',
   // 마이페이지 사이드바
   md: 'size-14 text-xl',
   lg: 'size-16 text-2xl',
} as const;

interface UserAvatarProps extends Pick<User, 'nickname'> {
   size?: keyof typeof SIZE_CLASS;
}

// 닉네임 첫 글자를 담은 동그란 아바타.
export function UserAvatar({ nickname, size = 'sm' }: UserAvatarProps) {
   return (
      <span
         className={`bg-brand-orange flex items-center justify-center rounded-full font-bold text-white ${SIZE_CLASS[size]}`}
      >
         {nickname.charAt(0)}
      </span>
   );
}
