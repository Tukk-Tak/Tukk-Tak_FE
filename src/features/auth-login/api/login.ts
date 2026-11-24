import { saveMockSession } from '@/entities/user/api/mockSession';
import type { User } from '@/entities/user/types';
import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import { saveAccessToken } from '@/shared/lib/authToken';
import type { LoginPayload } from '../types';

interface LoginData {
   accessToken: string;
   role: string;
   nickname: string;
}

// 로그인 POST /auth/login
// 성공하면 data에 accessToken, role, nickname이 오고, 리프레시 토큰은 서버가 쿠키로 내려준다.
// 쿠키를 받고 보내야 하므로 withCredentials를 켠다. (서버 CORS가 프론트 주소와 credentials를 허용해야 한다.)
// 로그인 요청에는 이전 토큰을 붙이지 않는다. (auth: false)
export async function login({ email, password, rememberMe }: LoginPayload): Promise<User> {
   const data = await apiFetch<LoginData | null>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
      auth: false,
      withCredentials: true,
   });
   if (!data?.accessToken) {
      throw new ApiError('UNKNOWN', '로그인 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요');
   }

   saveAccessToken(data.accessToken, rememberMe);

   // TODO: 내 정보 조회 API(GET /members/me)를 마이페이지에서 연동하면 name과 isBusinessVerified를 거기서 채운다.
   //       그 전까지는 로그인 응답에 있는 nickname으로 채우고, 사업자 인증은 "미인증"으로 둔다.
   const user: User = { nickname: data.nickname, name: data.nickname, isBusinessVerified: false };
   // 새로고침해도 헤더가 로그인 상태를 알 수 있게 사용자 정보를 토큰과 같은 저장소에 함께 둔다. (내 정보 조회 연동 전 임시)
   saveMockSession(user, rememberMe);
   return user;
}
