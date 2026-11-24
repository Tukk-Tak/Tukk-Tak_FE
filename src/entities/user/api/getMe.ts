import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import { clearAccessToken, getAccessToken } from '@/shared/lib/authToken';
import type { User } from '../types';
import { clearMockSession, readMockSession, updateMockSession } from './mockSession';

// 내 정보 조회 응답(data) 중 화면이 쓰는 것만 적는다.
// business는 사업자 인증을 한 적이 없으면 null이다.
// loginType은 가입한 방식이다. 명세의 예시에는 LOCAL(이메일 가입)만 있고, 구글 계정은 GOOGLE로 보고 처리한다.
interface MyInfoData {
   name: string;
   nickname: string;
   business: unknown;
   loginType?: unknown;
}

function toUser(data: MyInfoData | null | undefined): User {
   if (!data || typeof data.nickname !== 'string' || typeof data.name !== 'string') {
      throw new ApiError('UNKNOWN', '내 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요');
   }
   return {
      nickname: data.nickname,
      name: data.name,
      isBusinessVerified: Boolean(data.business),
      // 구글이 아니면 이메일 가입으로 본다. (값이 없거나 알 수 없는 값이어도 비밀번호 변경이 막히지 않는 쪽이 안전하다.)
      authProvider:
         typeof data.loginType === 'string' && data.loginType.toUpperCase() === 'GOOGLE'
            ? 'GOOGLE'
            : 'LOCAL',
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
// 조회하는 동안 다른 탭에서 새로 로그인하거나 로그아웃할 수 있다. 그러면 이 조회는 옛 토큰의 것이라서,
// 결과를 저장소에 반영(캐시 갱신, 토큰·캐시 삭제)하기 직전에 지금도 같은 토큰인지 확인하고 다를 때는 건드리지 않는다.
// (옛 토큰의 결과가 새 로그인의 캐시를 덮어쓰거나, 옛 토큰의 404가 새 로그인을 지우는 것을 막는다.)
export async function getMe(): Promise<User | null> {
   const token = getAccessToken();
   if (!token) return readMockSession();

   const isStillCurrent = () => getAccessToken() === token;

   try {
      const user = await fetchMe();
      if (isStillCurrent()) updateMockSession(user);
      return user;
   } catch (error) {
      if (error instanceof ApiError && error.status === 401) return null;
      if (error instanceof ApiError && error.status === 404) {
         if (isStillCurrent()) {
            clearAccessToken();
            clearMockSession();
         }
         return null;
      }
      return readMockSession();
   }
}
