import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import { clearAccessToken, getAccessToken } from '@/shared/lib/authToken';
import type { User } from '../types';
import { clearMockSession, readMockSession, updateMockSession } from './mockSession';

// 내 정보 조회 응답(data) 중 화면이 쓰는 것만 적는다.
// business는 사업자 인증을 한 적이 없으면 null이다.
interface MyInfoData {
   name: string;
   nickname: string;
   business: unknown;
}

function toUser(data: MyInfoData | null | undefined): User {
   if (!data || typeof data.nickname !== 'string' || typeof data.name !== 'string') {
      throw new ApiError('UNKNOWN', '내 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요');
   }
   return {
      nickname: data.nickname,
      name: data.name,
      isBusinessVerified: Boolean(data.business),
   };
}

// 내 정보 조회 GET /members/me
// token을 넘기면 저장소 대신 그 토큰으로 조회한다. 로그인 직후처럼 토큰을 아직 저장하기 전에 쓴다.
// (직접 넘긴 토큰은 apiClient의 "401이면 로그아웃·만료 안내" 처리를 거치지 않는다.)
export async function fetchMe(token?: string): Promise<User> {
   const data = await apiFetch<MyInfoData | null>(
      '/members/me',
      token ? { auth: false, headers: { Authorization: `Bearer ${token}` } } : undefined,
   );
   return toUser(data);
}

// 새로고침이나 다른 탭의 변경 뒤에 로그인 상태를 확인한다. 로그인하지 않았으면 null이다.
// - 토큰이 없으면: 구글 mock 로그인처럼 토큰 없이 저장된 사용자 정보만 있는 경우를 위해 저장된 값을 읽는다.
// - 조회에 성공하면: 저장된 사용자 정보를 최신으로 바꾼다. (닉네임을 바꾼 뒤에도 마지막 값이 틀리지 않게)
// - 401(만료·무효)이면: apiClient가 이미 토큰을 지우고 만료 안내를 켰으므로 null만 돌려준다.
// - 404(토큰은 유효한데 회원이 없음)이면: 더 쓸 수 없는 로그인이므로 정리하고 null이다.
// - 그 밖의 오류(네트워크 끊김, 서버 오류)이면: 토큰은 그대로 두고, 마지막으로 저장해 둔 사용자 정보를 보여 준다.
//   잠깐 끊겼을 뿐인데 로그아웃된 것처럼 보이면 안 되기 때문이다. 저장된 값이 없으면 null이다.
export async function getMe(): Promise<User | null> {
   if (!getAccessToken()) return readMockSession();

   try {
      const user = await fetchMe();
      updateMockSession(user);
      return user;
   } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      if (error instanceof ApiError && error.status === 404) {
         clearAccessToken();
         clearMockSession();
         return null;
      }
      return readMockSession();
   }
}
