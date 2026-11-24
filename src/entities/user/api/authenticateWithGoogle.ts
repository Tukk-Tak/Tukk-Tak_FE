import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import { saveGoogleSignupTicket } from '../model/googleSignupTicket';
import type { User } from '../types';
import { establishSession } from './establishSession';

interface GoogleAuthData {
   registered?: boolean;
   // registered가 true일 때
   accessToken?: string;
   // registered가 false일 때(처음 온 구글 계정)
   signupTicket?: string;
   email?: string;
   name?: string;
}

// logged-in: 이미 가입한 구글 계정이라 로그인까지 끝났다. / signup-required: 처음 온 계정이라 추가 정보 입력(가입)이 필요하다.
export type GoogleAuthResult = { status: 'logged-in'; user: User } | { status: 'signup-required' };

// 구글 로그인 POST /auth/google
// 구글에서 받은 ID 토큰(credential)을 보내면, 서버가 구글에 확인한 뒤 가입 여부에 따라 두 가지로 답한다.
// - 이미 가입한 계정(registered: true): 액세스 토큰을 주고 리프레시 토큰은 쿠키로 내려준다. 이메일 로그인과 같은 방식으로 마무리한다.
// - 처음 온 계정(registered: false): 가입 티켓과 구글 계정 정보를 준다. 가입 화면이 쓰도록 보관하고, 이동은 호출한 쪽이 한다.
// 실패하면 서버가 에러 코드를 주고, 문구는 서버 message를 그대로 보여 준다.
// (이메일로 가입한 계정 409, 이메일 미인증 구글 계정 400, 구글 토큰 오류 401, 시도 횟수 초과 429, 탈퇴한 회원 등)
// 쿠키를 받아야 하므로 withCredentials를 켠다. (서버 CORS가 프론트 주소와 credentials를 허용해야 한다.)
// 구글 로그인에는 "로그인 상태 유지" 선택이 없어서 항상 유지한다. (localStorage)
export async function authenticateWithGoogle(credential: string): Promise<GoogleAuthResult> {
   const data = await apiFetch<GoogleAuthData | null>('/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
      auth: false,
      withCredentials: true,
   });

   if (data?.registered === true && data.accessToken) {
      const user = await establishSession(data.accessToken, true);
      return { status: 'logged-in', user };
   }

   if (data?.registered === false && data.signupTicket && data.email && data.name) {
      // 티켓을 저장하지 못하면 가입 화면이 이어서 쓸 정보가 없으므로, 이동하지 않고 오류로 알린다.
      try {
         saveGoogleSignupTicket({
            signupTicket: data.signupTicket,
            email: data.email,
            name: data.name,
         });
      } catch {
         throw new ApiError(
            'STORAGE_UNAVAILABLE',
            '브라우저 저장소를 사용할 수 없어 구글 가입을 이어갈 수 없어요. 브라우저 설정을 확인한 뒤 다시 시도해주세요',
         );
      }
      return { status: 'signup-required' };
   }

   throw new ApiError(
      'UNKNOWN',
      '구글 로그인 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요',
   );
}
