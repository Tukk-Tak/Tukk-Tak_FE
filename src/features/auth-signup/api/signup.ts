import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { SIGNUP_ERROR } from '../model/errorCodes';
import { formatPhone } from '../model/validation';
import type { SignupPayload } from '../types';

// 회원가입 POST /auth/signup
// 성공하면 201이고 본문은 없다. (자동 로그인은 되지 않으므로 호출한 쪽이 로그인 화면으로 보낸다.)
// 실패하면 서버가 에러 코드를 주고, 문구는 서버 message를 그대로 보여 준다. 어떤 코드에 어떻게 반응하는지는 StoreStep이 정한다.
// 아직 로그인하기 전의 요청이라 로그인 토큰은 붙이지 않는다. (auth: false)
export async function signup(payload: SignupPayload): Promise<void> {
   // TODO: 구글 가입 API가 정해지면 이 분기를 지우고 같은 방식으로 교체한다. 지금은 UI 확인용 mock이다.
   // mock 규칙: 닉네임이 "가입실패" 이면 오류가 나고, 그 외에는 가입에 성공한다.
   if (payload.provider === 'GOOGLE') {
      await mockDelay(900);
      if (payload.nickname === '가입실패') {
         throw new ApiError(
            SIGNUP_ERROR.SIGNUP_FAILED,
            '가입 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요',
         );
      }
      return;
   }

   await apiFetch<null>('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         emailToken: payload.emailToken,
         password: payload.password,
         passwordConfirm: payload.passwordConfirm,
         name: payload.name,
         nickname: payload.nickname,
         // 서버 명세의 예시처럼 하이픈을 넣은 형식으로 보낸다. (입력 칸을 벗어나기 전에 제출해도 같은 형식이 되게 여기서 한 번 더 맞춘다.)
         phone: formatPhone(payload.phone),
         privacyAgreed: payload.agreedToTerms,
         aiUsageAgreed: payload.agreedToTerms,
         // 선택 항목은 없으면 아예 보내지 않는다. (JSON.stringify는 undefined 값을 빼 준다.)
         businessToken: payload.businessToken,
         businessPhone: payload.store ? formatPhone(payload.store.phone) : undefined,
         address: payload.store?.address,
      }),
      auth: false,
   });
}
