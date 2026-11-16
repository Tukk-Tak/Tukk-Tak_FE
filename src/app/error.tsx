'use client';

import { ServerErrorScreen } from '@/widgets/error-pages';

// 서비스 헤더가 없는 영역(에디터 등)에서 예상하지 못한 오류가 났을 때 보이는 500 화면.
// 헤더가 있는 영역은 (main)/error.tsx 가 맡아서 헤더를 유지한 채 보여 준다.
export default function RootError({
   error,
   reset,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
   return <ServerErrorScreen error={error} reset={reset} standalone />;
}
