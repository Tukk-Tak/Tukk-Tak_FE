import { saveMockPlan, type CurrentPlan } from '@/entities/plan';
import { ApiError } from '@/shared/lib/apiClient';
import { toIsoDate } from '@/shared/lib/date';
import { mockDelay } from '@/shared/lib/mockDelay';
import { CHECKOUT_ERROR } from '../model/errorCodes';
import { getPeriod } from '../model/period';
import type { PayPlanPayload } from '../types';

// TODO: 백엔드 결제 API가 정해지면 교체한다. 지금은 UI 확인용 mock이다.
// 실제로는 토스·카카오페이 결제창/승인 과정을 거치고, 금액과 기간은 서버가 다시 계산해 새 플랜 정보를 돌려준다.
// 오류 메시지도 실제로는 백엔드가 내려주는 메시지를 쓴다. (화면은 \n을 줄바꿈으로 보여 준다.)
// 같은 플랜의 연장은 마이페이지 결제 내역에서 하고(startDate로 이어서 시작), 다른 플랜으로 바꿀 때 남은 기간을 어떻게 처리할지는 정책이 필요하다.
// mock 규칙: 11개월은 결제 취소, 12개월은 승인 거절, 13개월은 일시 오류이고, 그 외에는 약 1.5초 뒤 성공한다.
export async function payPlan({ tier, months, startDate }: PayPlanPayload): Promise<CurrentPlan> {
   await mockDelay(1500);

   if (months === 11) {
      throw new ApiError(CHECKOUT_ERROR.CANCELED, '결제를 취소했어요.\n필요하면 다시 시도해주세요');
   }
   if (months === 12) {
      throw new ApiError(
         CHECKOUT_ERROR.DECLINED,
         '결제가 승인되지 않았어요.\n다른 결제수단으로 시도하거나 카드사에 문의해주세요',
      );
   }
   if (months === 13) {
      throw new ApiError(
         CHECKOUT_ERROR.TEMPORARY,
         '일시적인 오류로 결제하지 못했어요.\n잠시 후 다시 시도해주세요',
      );
   }

   const plan: CurrentPlan = { tier, expiresAt: toIsoDate(getPeriod(months, startDate).end) };
   saveMockPlan(plan);
   return plan;
}
