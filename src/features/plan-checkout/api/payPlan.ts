import { saveMockPlan, type CurrentPlan } from '@/entities/plan';
import { ApiError } from '@/shared/lib/apiClient';
import { toIsoDate } from '@/shared/lib/date';
import { mockDelay } from '@/shared/lib/mockDelay';
import { CHECKOUT_ERROR } from '../model/errorCodes';
import { getPeriod } from '../model/period';
import type { PayPlanPayload } from '../types';

// TODO: 백엔드 결제 API가 정해지면 교체한다. 지금은 UI 확인용 mock이다.
// 실제로는 토스·카카오페이 결제창/승인 과정을 거치고, 금액과 기간은 서버가 다시 계산해 새 플랜 정보를 돌려준다.
// 같은 플랜을 이미 이용 중일 때의 연장은 마이페이지 결제 내역에서 하고, 다른 플랜으로 바꿀 때 남은 기간을 어떻게 처리할지는 정책이 필요하다.
// mock 규칙: 13개월을 결제하면 결제 실패 오류가 나고, 그 외에는 약 1.5초 뒤 성공한다.
export async function payPlan({ tier, months }: PayPlanPayload): Promise<CurrentPlan> {
   await mockDelay(1500);

   if (months === 13) {
      throw new ApiError(
         CHECKOUT_ERROR.PAYMENT_FAILED,
         '결제에 실패했어요. 결제수단을 확인하고 다시 시도해주세요',
      );
   }

   const plan: CurrentPlan = { tier, expiresAt: toIsoDate(getPeriod(months).end) };
   saveMockPlan(plan);
   return plan;
}
