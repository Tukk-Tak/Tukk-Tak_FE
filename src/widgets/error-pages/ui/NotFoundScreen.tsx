'use client';

import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { HOME_PATH } from '@/shared/config/routes';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { ErrorScreen } from '@/shared/ui/ErrorScreen';

// 404. 주소가 바뀌었거나 없는 페이지일 때 보여 준다.
export function NotFoundScreen({ standalone = false }: { standalone?: boolean }) {
   const router = useRouter();

   // 주소를 직접 열어서 들어온 경우에는 돌아갈 기록이 없다. 그때는 홈으로 보낸다.
   const goBack = () => {
      if (window.history.length > 1) router.back();
      else router.push(HOME_PATH);
   };

   return (
      <ErrorScreen
         standalone={standalone}
         code="404"
         icon={Sparkles}
         title="페이지를 찾을 수 없어요"
         description={'주소가 바뀌었거나 삭제된 페이지일 수 있어요.\n주소를 다시 확인해주세요.'}
         actions={
            <>
               <ButtonLink href={HOME_PATH} size="form">
                  홈으로 가기
               </ButtonLink>
               <Button variant="outline" size="form" onClick={goBack}>
                  이전 페이지로
               </Button>
            </>
         }
      />
   );
}
