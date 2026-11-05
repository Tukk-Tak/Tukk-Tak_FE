import type { PlanName } from '@/shared/config/plans';

export interface CurrentPlan {
   tier: PlanName;
   // 이용 만료일(YYYY-MM-DD). 이 날까지 이용할 수 있다. FREE는 만료가 없어 null이다.
   expiresAt: string | null;
}

export const FREE_PLAN: CurrentPlan = { tier: 'FREE', expiresAt: null };
