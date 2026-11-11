// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { MypagePageHeader, MypagePlaceholder } from '@/widgets/mypage-layout';

export const metadata: Metadata = {
   title: '북마크 | 뚝딱',
};

// TODO: 북마크한 게시물 목록을 만든다. 게시물 상세의 북마크 버튼도 이때 함께 동작하게 한다. (지금은 틀만 있다.)
export default function MypageBookmarksPage() {
   return (
      <>
         <MypagePageHeader
            eyebrow="BOOKMARKS"
            title="북마크"
            description="북마크한 게시물은 나만 볼 수 있어요."
         />
         <MypagePlaceholder />
      </>
   );
}
