// 구글 인증이 실패해서 /login 으로 돌아올 때 주소에 담기는 값. (/login?google=unregistered)
// 사용자가 구글 창에서 직접 취소한 경우는 오류가 아니므로 안내 문구를 보여주지 않는다.
export const GOOGLE_AUTH_ERROR = {
   UNREGISTERED: 'unregistered', // 가입되지 않은 구글 계정
   FAILED: 'failed', // 연결에 실패
   EXPIRED: 'expired', // 인증 정보가 없거나 시간이 지남
} as const;

export type GoogleAuthError = (typeof GOOGLE_AUTH_ERROR)[keyof typeof GOOGLE_AUTH_ERROR];

export function parseGoogleAuthError(value: string | undefined): GoogleAuthError | undefined {
   return Object.values(GOOGLE_AUTH_ERROR).find((error) => error === value);
}
