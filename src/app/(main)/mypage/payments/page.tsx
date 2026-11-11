// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { MypagePageHeader, MypagePlaceholder } from '@/widgets/mypage-layout';

export const metadata: Metadata = {
   title: '결제 내역 | 뚝딱',
};

// TODO: 현재 플랜, 결제 내역 표, 플랜 연장 모달을 만든다. (지금은 틀만 있다.)
export default function MypagePaymentsPage() {
   return (
      <>
         <MypagePageHeader
            eyebrow="PAYMENTS"
            title="결제 내역"
            description="현재 플랜과 이전 결제 기록을 확인하세요."
         />
         <MypagePlaceholder />
      </>
   );
}
