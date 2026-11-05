import { FREE_PLAN, type CurrentPlan } from '../types';
import { readMockPlan } from './mockPlan';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// 조회에 실패하면 실제 플랜을 알 수 없으므로, 유료 기능이 새지 않도록 가장 제한적인 FREE로 본다. (컨벤션 7번 Fail-safe)
// TODO: 실패해서 FREE로 본 경우 "플랜 정보를 불러오지 못해 일시적으로 기본 플랜 제한이 적용돼요" 안내를 함께 보여준다.
export async function getMyPlan(): Promise<CurrentPlan> {
   try {
      return readMockPlan();
   } catch {
      return FREE_PLAN;
   }
}
