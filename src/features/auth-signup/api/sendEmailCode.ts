import { apiFetch } from '@/shared/lib/apiClient';

interface SendEmailCodeData {
   expiresInSeconds?: number;
   resendAfterSeconds?: number;
}

// 서버가 값을 주지 않을 때 쓰는 기본값이다. (명세의 예시 값)
const DEFAULT_EXPIRES_IN_SECONDS = 300;
// 이 시간 안에 다시 보내면 서버가 429로 거절한다. 응답에서 이 값이 빠져도 그 사이에 다시 받기를 누르지 못하게 같은 시간을 기다리게 한다.
// (공용 훅이 아니라 가입 쪽에 두는 이유: 비밀번호 재설정은 이 값을 주지 않으며 지금처럼 대기 없이 동작해야 한다.)
const DEFAULT_RESEND_AFTER_SECONDS = 60;

// 인증번호 발송 POST /auth/email/send
// 가입에서는 이미 가입된 이메일이면 409(AUTH-EMAIL-ALREADY-REGISTERED)이고, 너무 빨리 다시 보내거나(429) 횟수를 넘겨도(429) 거절한다.
// 성공하면 인증번호의 유효 시간(expiresInSeconds)과, 다시 받을 수 있게 되기까지 기다려야 하는 시간(resendAfterSeconds)을 준다.
// 아직 로그인하기 전의 요청이라 로그인 토큰은 붙이지 않는다. (auth: false)
export async function sendEmailCode(
   email: string,
): Promise<{ expiresInSeconds: number; resendAfterSeconds?: number }> {
   const data = await apiFetch<SendEmailCodeData | null>('/auth/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      auth: false,
   });

   // 메일은 이미 보냈으므로 응답에서 값을 읽지 못해도 실패로 보여 주지 않고 기본값으로 이어 간다.
   return {
      expiresInSeconds:
         typeof data?.expiresInSeconds === 'number'
            ? data.expiresInSeconds
            : DEFAULT_EXPIRES_IN_SECONDS,
      resendAfterSeconds:
         typeof data?.resendAfterSeconds === 'number'
            ? data.resendAfterSeconds
            : DEFAULT_RESEND_AFTER_SECONDS,
   };
}
