import type { PaidPlanName } from '@/shared/config/plans';
import type { YmdDate } from '@/shared/lib/date';

export type PaymentMethod = 'TOSS' | 'KAKAOPAY';

export interface PayPlanPayload {
   tier: PaidPlanName;
   months: number;
   method: PaymentMethod;
   // 이용 시작일. 없으면 오늘이다. (마이페이지에서 연장할 때는 현재 만료일 다음 날부터 시작한다.)
   startDate?: YmdDate;
}
