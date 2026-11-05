/**
 * 구독 플랜 정책 (FREE / BASIC / PREMIUM)
 * 실제 정책 체크 로직(PlanPolicyGuard 등)은 entities/plan 레이어에 둡니다.
 * 여기서는 정적인 정책 값만 정의합니다.
 */
export type PlanName = 'FREE' | 'BASIC' | 'PREMIUM';

export interface PlanLimits {
   aiUsagePerMonth: number;
   siteDeployLimit: number;
   siteSaveLimit: number;
}

// 유료 플랜의 월 가격(원). 결제 금액은 화면에서 계산해 보여 주지만, 실제 연동 때는 서버가 다시 계산한다.
export type PaidPlanName = Exclude<PlanName, 'FREE'>;

export const PLAN_MONTHLY_PRICE: Record<PaidPlanName, number> = {
   BASIC: 9900,
   PREMIUM: 19900,
};

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
   FREE: { aiUsagePerMonth: 1, siteDeployLimit: 0, siteSaveLimit: 3 },
   BASIC: { aiUsagePerMonth: 3, siteDeployLimit: 1, siteSaveLimit: 5 },
   PREMIUM: { aiUsagePerMonth: 7, siteDeployLimit: 3, siteSaveLimit: 10 },
};
