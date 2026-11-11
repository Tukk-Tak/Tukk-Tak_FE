// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { MypagePageHeader, MypagePlaceholder } from '@/widgets/mypage-layout';

export const metadata: Metadata = {
   title: '내 사이트 | 뚝딱',
};

// TODO: 내 사이트 카드 목록과 상태 필터를 만든다. 시안에서 설명 자리는 "저장 5 / 5개 · 배포 1 / 1개"이므로,
//       그때 description 대신 개수 표시로 바꾼다. (지금은 틀만 있다.)
export default function MypageSitesPage() {
   return (
      <>
         <MypagePageHeader eyebrow="MY SITES" title="내 사이트" />
         <MypagePlaceholder />
      </>
   );
}
