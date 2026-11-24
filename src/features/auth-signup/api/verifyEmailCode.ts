import { ApiError, apiFetch } from '@/shared/lib/apiClient';

interface VerifyEmailCodeData {
   emailToken?: string;
}

// 인증번호 확인 POST /auth/email/verify
// 맞으면 가입 요청에 쓸 이메일 토큰(emailToken)을 돌려주고, 이 토큰은 가입이 끝날 때까지 훅이 들고 있는다.
// 틀리면 400(AUTH-EMAIL-CODE-MISMATCH), 만료·받은 적 없음·이미 쓴 번호면 400(AUTH-EMAIL-CODE-EXPIRED),
// 5번 연속 틀리면 429(AUTH-EMAIL-VERIFY-LOCKED, 이후에는 맞는 번호도 거절)다. 문구는 서버 message를 그대로 보여 준다.
// 아직 로그인하기 전의 요청이라 로그인 토큰은 붙이지 않는다. (auth: false)
export async function verifyEmailCode(email: string, code: string): Promise<string> {
   const data = await apiFetch<VerifyEmailCodeData | null>('/auth/email/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
      auth: false,
   });

   // 토큰이 없으면 가입을 이어 갈 수 없으므로, 인증이 끝난 것으로 보지 않고 실패로 알린다.
   if (!data?.emailToken) {
      throw new ApiError('UNKNOWN', '이메일 인증 처리 중 오류가 발생했어요. 다시 시도해주세요');
   }
   return data.emailToken;
}
