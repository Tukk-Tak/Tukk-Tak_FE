import type { User } from '../types';
import { readMockSession } from './mockSession';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// 로그인하지 않았거나 세션이 만료됐으면 null이다.
export async function getMe(): Promise<User | null> {
   return readMockSession();
}
