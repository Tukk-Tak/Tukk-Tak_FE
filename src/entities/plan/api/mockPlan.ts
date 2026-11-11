import { getTodayKst, toIsoDate } from '@/shared/lib/date';
import { FREE_PLAN, type CurrentPlan } from '../types';

export const MOCK_PLAN_KEY = 'ttukttak:mock-plan';

// TODO: 백엔드가 플랜 조회·결제 API를 제공하면 이 파일은 삭제한다. 지금은 결제 결과를 브라우저 저장소에 흉내 내서 보관한다.
// (실제로는 사용자별로 서버가 보관한다. 이 mock은 브라우저 하나에 하나만 저장한다.)

function isCurrentPlan(value: unknown): value is CurrentPlan {
   if (typeof value !== 'object' || value === null) return false;
   const { tier, expiresAt } = value as Record<string, unknown>;
   return (
      (tier === 'FREE' || tier === 'BASIC' || tier === 'PREMIUM') &&
      (expiresAt === null || typeof expiresAt === 'string')
   );
}

export function readMockPlan(): CurrentPlan {
   try {
      const raw = window.localStorage.getItem(MOCK_PLAN_KEY);
      if (!raw) return FREE_PLAN;
      const parsed: unknown = JSON.parse(raw);
      if (!isCurrentPlan(parsed)) return FREE_PLAN;
      // 만료일이 지났으면 무료 플랜으로 돌아간다. (만료일 당일까지는 이용할 수 있다.)
      if (parsed.expiresAt && parsed.expiresAt < toIsoDate(getTodayKst())) return FREE_PLAN;
      return parsed;
   } catch {
      return FREE_PLAN;
   }
}

export function saveMockPlan(plan: CurrentPlan) {
   try {
      window.localStorage.setItem(MOCK_PLAN_KEY, JSON.stringify(plan));
   } catch {
      // 저장소를 쓸 수 없으면 이 탭의 메모리 상태로만 반영된다.
   }
}
