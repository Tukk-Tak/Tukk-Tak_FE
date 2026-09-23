/**
 * 구독 플랜 정책 (FREE / BASIC / PREMIUM)
 * 실제 정책 체크 로직(PlanPolicyGuard 등)은 entities/plan 레이어에 둡니다.
 * 여기서는 정적인 정책 값만 정의합니다.
 */
export type PlanName = "FREE" | "BASIC" | "PREMIUM";

export interface PlanLimits {
  aiUsagePerMonth: number;
  siteDeployLimit: number;
  siteSaveLimit: number;
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  FREE: { aiUsagePerMonth: 1, siteDeployLimit: 0, siteSaveLimit: 3 },
  BASIC: { aiUsagePerMonth: 3, siteDeployLimit: 1, siteSaveLimit: 5 },
  PREMIUM: { aiUsagePerMonth: 7, siteDeployLimit: 3, siteSaveLimit: 10 },
};
