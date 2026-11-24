import { fetchMe } from '@/entities/user/api/getMe';
import { saveMockSession } from '@/entities/user/api/mockSession';
import type { User } from '@/entities/user/types';
import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import { saveAccessToken } from '@/shared/lib/authToken';
import type { LoginPayload } from '../types';

interface LoginData {
   accessToken: string;
}

// 로그인 POST /auth/login 다음에 내 정보 조회 GET /members/me
// 로그인에 성공하면 data에 accessToken이 오고, 리프레시 토큰은 서버가 쿠키로 내려준다.
// 쿠키를 받고 보내야 하므로 withCredentials를 켠다. (서버 CORS가 프론트 주소와 credentials를 허용해야 한다.)
// 로그인 요청에는 이전 토큰을 붙이지 않는다. (auth: false)
// 화면이 쓰는 이름과 사업자 인증 여부는 로그인 응답에 없어서 내 정보 조회로 채운다.
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

   // 내 정보 조회에 실패하면 로그인도 실패로 본다. (사업자 인증 여부 등이 틀린 채로 들어가지 않게 하려는 것이다.)
   // 아직 토큰을 저장하기 전이라 실패해도 정리할 것이 없고, 오류는 서버의 message 그대로 화면에 보인다.
   // 방금 받은 토큰을 직접 넘기므로, 이 조회의 401이 "시간이 지나 로그아웃됐어요" 안내로 이어지지도 않는다.
   const user = await fetchMe(data.accessToken);

   saveAccessToken(data.accessToken, rememberMe);
   // 사용자 정보도 같은 저장소에 함께 둔다. 새로고침 때 내 정보 조회가 실패하면 이 값을 보여 준다.
   saveMockSession(user, rememberMe);
   return user;
}
