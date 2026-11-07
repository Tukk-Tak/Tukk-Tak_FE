// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CommunityList, CommunityListFallback } from '@/widgets/community-list';

export const metadata: Metadata = {
   title: '커뮤니티 | 뚝딱',
};

export default function CommunityPage() {
   return (
      // 헤더를 뺀 남은 높이를 모두 쓰고(h-full), 이 main만 스크롤한다. (다른 페이지와 같은 구조)
      <main className="relative h-full overflow-y-auto bg-white">
         {/* 주소의 검색 조건(useSearchParams)을 읽는 컴포넌트는 Suspense로 감싸야 한다. */}
         <Suspense fallback={<CommunityListFallback />}>
            <CommunityList />
         </Suspense>
      </main>
   );
}
