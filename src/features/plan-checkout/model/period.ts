import { PLAN_MONTHLY_PRICE, type PaidPlanName } from '@/shared/config/plans';
import { addMonths, getTodayKst, type YmdDate } from '@/shared/lib/date';

export const MIN_MONTHS = 1;
export const MAX_MONTHS = 24;

export function isValidMonths(months: number): boolean {
   return Number.isInteger(months) && months >= MIN_MONTHS && months <= MAX_MONTHS;
}

// 범위를 벗어난 값을 1~24로 맞춘다. 숫자가 아니면 최소값이다.
export function clampMonths(months: number): number {
   if (!Number.isFinite(months)) return MIN_MONTHS;
   return Math.min(MAX_MONTHS, Math.max(MIN_MONTHS, Math.trunc(months)));
}

// 이용 시작일은 따로 정하지 않으면 결제하는 오늘(한국 시간)이고, 종료일은 N개월 뒤 같은 날이다.
export function getPeriod(months: number, startDate?: YmdDate): { start: YmdDate; end: YmdDate } {
   const start = startDate ?? getTodayKst();
   return { start, end: addMonths(start, months) };
}

// 화면 표시용 금액이다. 실제 결제 금액은 서버가 다시 계산한다.
export function getTotalPrice(tier: PaidPlanName, months: number): number {
   return PLAN_MONTHLY_PRICE[tier] * months;
}
