// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { MypagePageHeader, MypagePlaceholder } from '@/widgets/mypage-layout';

export const metadata: Metadata = {
   title: '회원 정보 | 뚝딱',
};

// TODO: 회원 정보 보기·수정 화면을 만든다. (지금은 틀만 있다.)
export default function MypageProfilePage() {
   return (
      <>
         <MypagePageHeader
            eyebrow="MY ACCOUNT"
            title="회원 정보"
            description="가입할 때 등록한 정보와 인증 상태를 확인할 수 있어요."
         />
         <MypagePlaceholder />
      </>
   );
}
