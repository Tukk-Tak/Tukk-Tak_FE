// 서버가 내려주는 에러 코드. 코드별 분기가 필요하면 흩어 쓰지 않고 여기 상수를 쓴다.
// 문구는 코드와 상관없이 서버가 준 message를 그대로 보여 준다.
export const LOGIN_ERROR = {
   // 이메일 또는 비밀번호 틀림, 없는 이메일 (401)
   INVALID_CREDENTIALS: 'AUTH-LOGIN-FAILED',
   // 구글로 가입한 계정이라 비밀번호가 없음 (401)
   SOCIAL_ACCOUNT_NO_PASSWORD: 'AUTH-SOCIAL-ACCOUNT-NO-PASSWORD',
   // 탈퇴한 회원 (401)
   WITHDRAWN_MEMBER: 'AUTH-WITHDRAWN-MEMBER',
   // 실패 횟수 초과로 15분 잠금 (429)
   ACCOUNT_LOCKED: 'AUTH-ACCOUNT-LOCKED',
   // 입력값 오류: 이메일 형식, 빈 값, 길이 초과 (400)
   VALIDATION_ERROR: 'COMMON-VALIDATION-ERROR',
} as const;
