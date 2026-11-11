// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { MypagePageHeader, MypagePlaceholder } from '@/widgets/mypage-layout';

export const metadata: Metadata = {
   title: '사업자 인증 | 뚝딱',
};

// TODO: 사업자 인증 화면(인증 전, 인증 중, 인증 완료)을 만든다. (지금은 틀만 있다.)
// 시안에는 이 화면만 영문 소제목이 없지만, 다른 화면과 통일하려고 BUSINESS를 넣었다.
export default function MypageBusinessPage() {
   return (
      <>
         <MypagePageHeader
            eyebrow="BUSINESS"
            title="사업자 인증"
            description="사업자 인증을 마쳐야 사이트를 배포할 수 있어요."
         />
         <MypagePlaceholder />
      </>
   );
}
