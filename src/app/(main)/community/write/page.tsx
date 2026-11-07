// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { WritePostForm } from '@/features/community-write';

export const metadata: Metadata = {
   title: '글쓰기 | 뚝딱',
};

export default function WritePostPage() {
   return (
      // 헤더를 뺀 남은 높이를 모두 쓰고(h-full), 이 main만 스크롤한다. (다른 페이지와 같은 구조)
      <main className="relative h-full overflow-y-auto bg-brand-cream">
         <div className="mx-auto w-full max-w-230 px-[4%] py-10 md:py-12">
            <WritePostForm />
         </div>
      </main>
   );
}
