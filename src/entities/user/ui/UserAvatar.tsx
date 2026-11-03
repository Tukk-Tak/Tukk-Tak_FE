import type { User } from '../types';

export function UserAvatar({ nickname }: Pick<User, 'nickname'>) {
   return (
      <span className="bg-brand-orange flex size-7 items-center justify-center rounded-full text-xs font-bold text-white">
         {nickname.charAt(0)}
      </span>
   );
}
