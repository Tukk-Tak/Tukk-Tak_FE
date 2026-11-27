// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { PostDetail } from '@/widgets/post-detail';

// TODO: 글 제목을 탭 이름에 쓰려면 서버에서 글을 불러와야 한다. 백엔드 API가 정해지면 generateMetadata로 바꾼다.
export const metadata: Metadata = {
   title: '게시물 | 뚝딱',
};

export default async function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
   const { postId } = await params;

   return (
      // 헤더를 뺀 남은 높이를 모두 쓰고(h-full), 이 main만 스크롤한다. (다른 페이지와 같은 구조)
      <main className="relative h-full bg-white">
         <ScrollArea className="h-full">
            <PostDetail postId={postId} />
         </ScrollArea>
      </main>
   );
}
