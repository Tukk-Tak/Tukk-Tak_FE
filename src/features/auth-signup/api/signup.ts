import { establishSession } from '@/entities/user/api/establishSession';
import type { User } from '@/entities/user/types';
import { apiFetch } from '@/shared/lib/apiClient';
import { formatPhone } from '../model/validation';
import type { SignupPayload } from '../types';

interface GoogleSignupData {
   accessToken?: string;
}

// 이메일·구글 가입이 함께 보내는 가게 정보 부분. 선택 항목은 없으면 아예 보내지 않는다. (JSON.stringify는 undefined 값을 빼 준다.)
function buildCommonBody(payload: SignupPayload) {
   return {
      name: payload.name,
      nickname: payload.nickname,
      // 서버 명세의 예시처럼 하이픈을 넣은 형식으로 보낸다. (입력 칸을 벗어나기 전에 제출해도 같은 형식이 되게 여기서 한 번 더 맞춘다.)
      phone: formatPhone(payload.phone),
      privacyAgreed: payload.agreedToTerms,
      aiUsageAgreed: payload.agreedToTerms,
      businessToken: payload.businessToken,
      businessPhone: payload.store ? formatPhone(payload.store.phone) : undefined,
      address: payload.store?.address,
   };
}

// 회원가입. 아직 로그인하기 전의 요청이라 로그인 토큰은 붙이지 않는다. (auth: false)
// 실패하면 서버가 에러 코드를 주고, 문구는 서버 message를 그대로 보여 준다. 어떤 코드에 어떻게 반응하는지는 화면이 정한다.
//
// - 이메일 가입 POST /auth/signup: 성공하면 201이고 본문은 없다. 자동 로그인은 되지 않으므로 null을 돌려주고, 호출한 쪽이 로그인 화면으로 보낸다.
// - 구글 가입 POST /auth/google/signup: 성공하면 201과 함께 액세스 토큰을 주고(리프레시 토큰은 쿠키), 바로 로그인된다. 로그인한 사용자를 돌려준다.
//   쿠키를 받아야 하므로 withCredentials를 켠다. (서버 CORS가 프론트 주소와 credentials를 허용해야 한다.)
//   구글 로그인과 같이 "로그인 상태 유지" 선택이 없어서 항상 유지한다. (localStorage)
export async function signup(payload: SignupPayload): Promise<User | null> {
   if (payload.provider === 'GOOGLE') {
      const data = await apiFetch<GoogleSignupData | null>('/auth/google/signup', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ signupTicket: payload.signupTicket, ...buildCommonBody(payload) }),
         auth: false,
         withCredentials: true,
      });

      // 이 시점에 가입은 이미 끝났다. 로그인 상태를 만들지 못했다고 가입 실패로 보여 주면 안 되므로,
      // 토큰이 없거나 내 정보 조회가 실패하면 예외를 던지지 않고 null을 돌려준다. (호출한 쪽이 로그인 화면으로 보낸다.)
      if (!data?.accessToken) return null;
      try {
         return await establishSession(data.accessToken, true);
      } catch {
         return null;
      }
   }

   await apiFetch<null>('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         emailToken: payload.emailToken,
         password: payload.password,
         passwordConfirm: payload.passwordConfirm,
         ...buildCommonBody(payload),
      }),
      auth: false,
   });
   return null;
}
