import type { User } from '../types';
import { readMockSession } from './mockSession';

// TODO: 마이페이지에서 내 정보 조회 API(GET /members/me)를 연동할 때 apiFetch 호출로 교체한다.
//       그때는 저장된 토큰으로 호출해서 성공하면 로그인 상태, 401이면 로그아웃으로 처리한다.
// 지금은 로그인할 때 저장해 둔 사용자 정보를 그대로 읽는다. 로그인하지 않았으면 null이다.
export async function getMe(): Promise<User | null> {
   return readMockSession();
}
