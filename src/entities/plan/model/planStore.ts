import { getMyPlan } from '../api/getMyPlan';
import { MOCK_PLAN_KEY } from '../api/mockPlan';
import { FREE_PLAN, type CurrentPlan } from '../types';

// 현재 플랜. loading은 아직 확인하기 전이다. (서버 렌더링과 첫 렌더링은 항상 loading)
export type PlanState = { status: 'loading'; plan: null } | { status: 'ready'; plan: CurrentPlan };

const LOADING: PlanState = { status: 'loading', plan: null };

let state: PlanState = LOADING;
let started = false;
const listeners = new Set<() => void>();

function setState(next: PlanState) {
   state = next;
   listeners.forEach((listener) => listener());
}

async function refresh() {
   try {
      setState({ status: 'ready', plan: await getMyPlan() });
   } catch {
      setState({ status: 'ready', plan: FREE_PLAN });
   }
}

// 다른 탭에서 결제하면 저장소가 바뀌므로 플랜을 다시 확인한다.
function handleStorage(event: StorageEvent) {
   if (event.key === MOCK_PLAN_KEY || event.key === null) void refresh();
}

// useSyncExternalStore에 넘기는 구독 함수. 처음 구독할 때 플랜을 한 번 확인한다.
export function subscribe(listener: () => void) {
   listeners.add(listener);
   if (!started) {
      started = true;
      window.addEventListener('storage', handleStorage);
      void refresh();
   }
   return () => {
      listeners.delete(listener);
   };
}

export const getSnapshot = () => state;
export const getServerSnapshot = () => LOADING;

// 결제가 끝나 새 플랜이 정해졌을 때 호출한다. 플랜을 보는 모든 곳이 바로 바뀐다.
export function setMyPlan(plan: CurrentPlan) {
   setState({ status: 'ready', plan });
}
