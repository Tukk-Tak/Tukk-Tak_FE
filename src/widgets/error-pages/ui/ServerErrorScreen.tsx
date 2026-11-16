'use client';

import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';
import { HOME_PATH } from '@/shared/config/routes';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { ErrorScreen } from '@/shared/ui/ErrorScreen';

interface ServerErrorScreenProps {
   // Next가 error.tsx에 넘겨 주는 오류. digest는 서버 로그와 짝을 맞출 때 쓰는 식별값이다.
   error: Error & { digest?: string };
   // 오류가 난 부분을 다시 그려 본다.
   reset: () => void;
   standalone?: boolean;
}

// 500. 예상하지 못한 오류가 났을 때 보여 준다.
// 오류 번호(ERR-500)는 시안대로 고정 문구이고, 원인 파악에 쓸 오류 내용과 digest는 화면에 보이지 않고 콘솔에만 남긴다.
export function ServerErrorScreen({ error, reset, standalone = false }: ServerErrorScreenProps) {
   const router = useRouter();

   useEffect(() => {
      console.error('[ERR-500]', error.digest ? `digest: ${error.digest}` : '', error);
   }, [error]);

   // reset()만으로는 서버에서 가져온 데이터를 다시 받지 못한다. 새로고침(refresh)과 함께 부른다.
   const retry = () => {
      startTransition(() => {
         router.refresh();
         reset();
      });
   };

   return (
      <ErrorScreen
         standalone={standalone}
         code="500"
         icon={TriangleAlert}
         title="잠시 문제가 생겼어요"
         description={'일시적인 오류예요. 잠시 후 다시 시도해주세요.\n계속되면 알려주세요.'}
         note="오류 코드 ERR-500"
         actions={
            <>
               <Button size="form" onClick={retry}>
                  다시 시도
               </Button>
               <ButtonLink href={HOME_PATH} variant="outline" size="form">
                  홈으로 가기
               </ButtonLink>
            </>
         }
      />
   );
}
