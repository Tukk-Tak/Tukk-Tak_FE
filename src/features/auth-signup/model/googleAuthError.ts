// 구글 가입 화면(/signup/google)에서 가입 티켓이 없거나 시간이 지나 /signup 으로 돌아올 때 주소에 담기는 값. (/signup?google=expired)
// 구글 인증 자체의 실패는 주소가 아니라 구글 버튼 아래에 서버 메시지로 바로 보여 준다.
export const GOOGLE_AUTH_ERROR = {
   EXPIRED: 'expired', // 가입 티켓이 없거나 이미 쓰였거나 시간이 지남
} as const;

export type GoogleAuthError = (typeof GOOGLE_AUTH_ERROR)[keyof typeof GOOGLE_AUTH_ERROR];

export function parseGoogleAuthError(value: string | undefined): GoogleAuthError | undefined {
   return Object.values(GOOGLE_AUTH_ERROR).find((error) => error === value);
}
