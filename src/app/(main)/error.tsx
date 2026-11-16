'use client';

import { ServerErrorScreen } from '@/widgets/error-pages';

// 서비스 헤더가 있는 화면에서 예상하지 못한 오류가 났을 때 보이는 500 화면.
// (main) 레이아웃 안쪽에서 오류를 받으므로, 헤더는 그대로 남고 본문만 이 화면으로 바뀐다.
export default function MainError({
   error,
   reset,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
   return <ServerErrorScreen error={error} reset={reset} />;
}
