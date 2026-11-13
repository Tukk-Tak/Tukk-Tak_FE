// 서버가 내려주는 에러 코드. 코드별 분기가 필요하면 흩어 쓰지 않고 여기 상수를 쓴다.
export const PASSWORD_RESET_ERROR = {
   EMAIL_NOT_REGISTERED: 'EMAIL_NOT_REGISTERED',
   // 구글로만 가입한 계정이라 비밀번호가 없다.
   GOOGLE_ACCOUNT: 'GOOGLE_ACCOUNT',
   INVALID_EMAIL_CODE: 'INVALID_EMAIL_CODE',
   SAME_AS_OLD: 'SAME_AS_OLD',
   RESET_FAILED: 'RESET_FAILED',
} as const;
