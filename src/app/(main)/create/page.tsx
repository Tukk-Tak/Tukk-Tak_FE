// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { CreateHub, parseStartMethod } from '@/widgets/create-hub';

export const metadata: Metadata = {
   title: '사이트 만들기 | 뚝딱',
};

// ?start=ai 로 들어오면 "AI로 초안 만들기" 카드를 선택한 채로 보여 준다. (없으면 선택 없음)
export default async function CreatePage({
   searchParams,
}: {
   searchParams: Promise<{ start?: string | string[] }>;
}) {
   const initialMethod = parseStartMethod((await searchParams).start);

   return (
      // 헤더를 뺀 남은 높이를 모두 쓰고(h-full), 이 main만 스크롤한다. (다른 페이지와 같은 구조)
      <main className="relative h-full bg-brand-cream">
         {/* key: 허브 안에서 ?start= 만 바뀌어도(헤더 버튼 등) 선택 상태를 새로 맞춘다. */}
         <CreateHub key={initialMethod ?? 'none'} initialMethod={initialMethod} />
      </main>
   );
}
