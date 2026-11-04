import { clearMockSession } from './mockSession';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
export async function logout(): Promise<void> {
   clearMockSession();
}
