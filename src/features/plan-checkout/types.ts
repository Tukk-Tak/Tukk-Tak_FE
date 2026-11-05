import type { PaidPlanName } from '@/shared/config/plans';

export type PaymentMethod = 'TOSS' | 'KAKAOPAY';

export interface PayPlanPayload {
   tier: PaidPlanName;
   months: number;
   method: PaymentMethod;
}
