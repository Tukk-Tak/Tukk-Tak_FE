// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { PricingPlans } from '@/widgets/pricing-plans';

export const metadata: Metadata = {
   title: '요금제 | 뚝딱',
};

export default function PricingPage() {
   return (
      // 헤더를 뺀 남은 높이를 모두 쓰고(h-full), 이 main만 스크롤한다. (다른 페이지와 같은 구조)
      <main className="bg-brand-cream relative h-full">
         <ScrollArea className="h-full">
            <PricingPlans />
         </ScrollArea>
      </main>
   );
}
