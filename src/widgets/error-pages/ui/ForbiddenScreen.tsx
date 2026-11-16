'use client';

import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/entities/user/model/sessionStore';
import { HOME_PATH, LOGIN_PATH } from '@/shared/config/routes';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { ErrorScreen } from '@/shared/ui/ErrorScreen';

// 403. 로그인은 했지만 볼 권한이 없을 때(관리자 전용 페이지 등) 보여 준다.
// TODO: 관리자 전용 페이지를 만들 때, 서버가 "권한 없음"을 알려 주면 이 화면을 보여 주도록 연결한다. (지금은 연결된 곳이 없다.)
export function ForbiddenScreen({ standalone = false }: { standalone?: boolean }) {
   const router = useRouter();
   const { run, pending } = useSingleFlight();

   // 이미 로그인한 사용자는 로그인 화면에서 메인으로 돌려보내지므로, 먼저 로그아웃한 뒤 로그인 화면으로 보낸다.
   const switchAccount = () =>
      run(async () => {
         await signOut();
         router.replace(LOGIN_PATH);
      });

   return (
      <ErrorScreen
         standalone={standalone}
         code="403"
         icon={ShieldCheck}
         title="접근 권한이 없어요"
         description={'관리자 계정으로 로그인한 경우에만\n볼 수 있는 페이지예요.'}
         actions={
            <>
               <ButtonLink href={HOME_PATH} size="form">
                  홈으로 가기
               </ButtonLink>
               <Button variant="outline" size="form" disabled={pending} onClick={switchAccount}>
                  다른 계정으로 로그인
               </Button>
            </>
         }
      />
   );
}
