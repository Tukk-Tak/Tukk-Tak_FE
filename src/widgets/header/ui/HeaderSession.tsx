'use client';

import { useSession } from '@/entities/user/model/useSession';
import { GuestActions } from './GuestActions';
import { MemberActions } from './MemberActions';
import { MobileMenu } from './MobileMenu';

// 로그인 상태에 따라 헤더 오른쪽을 바꾼다. 세션을 확인하는 동안(loading)에는 게스트 버튼이
// 잠깐 보였다가 회원 버튼으로 바뀌는 깜빡임을 막으려고 버튼 영역을 비워 둔다.
export function HeaderSession() {
   const { status, user } = useSession();

   return (
      <div className="flex items-center gap-3">
         {status === 'ready' && (user ? <MemberActions user={user} /> : <GuestActions />)}
         <MobileMenu user={user} />
      </div>
   );
}
