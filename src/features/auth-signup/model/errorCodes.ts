// 서버가 내려주는 에러 코드. 코드별 분기가 필요하면 흩어 쓰지 않고 여기 상수를 쓴다.
// 문구는 코드와 상관없이 서버가 준 message를 그대로 보여 준다. (아래 코드는 화면이 "다음 행동"을 정할 때만 쓴다.)
export const SIGNUP_ERROR = {
   // 이미 가입된 이메일 (인증번호 발송 때 409, 이메일·구글 가입 때 409)
   EMAIL_ALREADY_REGISTERED: 'AUTH-EMAIL-ALREADY-REGISTERED',
   // 이메일 토큰이 없거나 이미 쓰임 (이메일 가입 때 400)
   EMAIL_TOKEN_INVALID: 'AUTH-EMAIL-TOKEN-INVALID',
   // 구글 가입 티켓이 없거나 이미 쓰임, 시간이 지남 (구글 가입 때 400)
   GOOGLE_TICKET_INVALID: 'AUTH-GOOGLE-TICKET-INVALID',
   // 이미 있는 닉네임 (가입 때 409)
   NICKNAME_ALREADY_USED: 'AUTH-NICKNAME-ALREADY-USED',
   // 사업자 토큰이 없음 (가입 때 400)
   BUSINESS_TOKEN_INVALID: 'AUTH-BUSINESS-TOKEN-INVALID',
   // 가입 이름이 사업자 인증 때 대표자명과 다름 (가입 때 400)
   BUSINESS_NAME_MISMATCH: 'AUTH-BUSINESS-NAME-MISMATCH',
   // 이미 인증된 사업자번호 (사업자 인증·가입 때 409)
   BUSINESS_ALREADY_USED: 'AUTH-BUSINESS-ALREADY-USED',
   // 서버 코드가 아니라 프론트가 정한 코드다. 닉네임 확인 응답이 200이면서 available이 false일 때 쓴다.
   NICKNAME_TAKEN: 'NICKNAME_TAKEN',
} as const;
