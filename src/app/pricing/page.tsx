// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { PricingPlans } from '@/widgets/pricing-plans';

export const metadata: Metadata = {
   title: '요금제 | 뚝딱',
};

export default function PricingPage() {
   return (
      // 헤더 높이(h-16)를 뺀 높이로 고정하고 이 main만 스크롤한다. (다른 페이지와 같은 구조)
      <main className="bg-brand-cream relative h-[calc(100dvh-4rem)] overflow-y-auto">
         <PricingPlans />
      </main>
   );
}
