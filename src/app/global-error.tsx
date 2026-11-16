'use client';

import './globals.css';
import { TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';
import { buttonClassName } from '@/shared/ui/Button';
import { ErrorScreen } from '@/shared/ui/ErrorScreen';

// 루트 레이아웃 자체가 깨졌을 때만 보이는 마지막 500 화면. 이때는 루트 레이아웃이 통째로 바뀌므로
// <html>과 <body>를 직접 그리고, 헤더·토스트 같은 공용 요소와 라우터를 쓸 수 없어서 일반 링크와 새로고침을 쓴다.
export default function GlobalError({
   error,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
   useEffect(() => {
      console.error('[ERR-500]', error.digest ? `digest: ${error.digest}` : '', error);
   }, [error]);

   return (
      <html lang="ko">
         <body>
            <ErrorScreen
               standalone
               code="500"
               icon={TriangleAlert}
               title="잠시 문제가 생겼어요"
               description={'일시적인 오류예요. 잠시 후 다시 시도해주세요.\n계속되면 알려주세요.'}
               note="오류 코드 ERR-500"
               actions={
                  <>
                     <button
                        type="button"
                        className={buttonClassName('form')}
                        onClick={() => window.location.reload()}
                     >
                        다시 시도
                     </button>
                     {/* 루트 레이아웃이 깨진 상태라 라우터를 쓸 수 없다. 일반 링크로 처음부터 다시 불러오는 편이 안전하다. */}
                     {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                     <a href="/" className={buttonClassName('form', '', 'outline')}>
                        홈으로 가기
                     </a>
                  </>
               }
            />
         </body>
      </html>
   );
}
