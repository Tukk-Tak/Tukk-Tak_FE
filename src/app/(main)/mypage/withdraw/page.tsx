// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { MypagePageHeader, MypagePlaceholder } from '@/widgets/mypage-layout';

export const metadata: Metadata = {
   title: '회원 탈퇴 | 뚝딱',
};

// TODO: 탈퇴 안내와 비밀번호·동의 확인 화면을 만든다. (지금은 틀만 있다.)
export default function MypageWithdrawPage() {
   return (
      <>
         <MypagePageHeader
            eyebrow="LEAVE ACCOUNT"
            title="회원 탈퇴"
            description="탈퇴 전에 아래 내용을 꼭 확인해주세요."
         />
         <MypagePlaceholder />
      </>
   );
}
