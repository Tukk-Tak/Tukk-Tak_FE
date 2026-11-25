import { establishSession } from '@/entities/user/api/establishSession';
import type { User } from '@/entities/user/types';
import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import type { LoginPayload } from '../types';

interface LoginData {
   accessToken: string;
}

// 로그인 POST /auth/login 다음에 내 정보 조회 GET /members/me
// 로그인에 성공하면 data에 accessToken이 오고, 리프레시 토큰은 서버가 쿠키로 내려준다.
// 쿠키를 받고 보내야 하므로 withCredentials를 켠다. (서버 CORS가 프론트 주소와 credentials를 허용해야 한다.)
// 로그인 요청에는 이전 토큰을 붙이지 않는다. (auth: false)
// 토큰 저장과 내 정보 조회(조회에 실패하면 로그인도 실패)는 구글 로그인과 함께 쓰는 establishSession이 한다.
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

   return establishSession(data.accessToken, rememberMe);
}
