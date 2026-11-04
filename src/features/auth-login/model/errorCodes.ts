// 서버가 내려주는 에러 코드. 코드별 분기가 필요하면 흩어 쓰지 않고 여기 상수를 쓴다.
export const LOGIN_ERROR = {
   INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
   SERVER_ERROR: 'SERVER_ERROR',
   GOOGLE_UNREGISTERED: 'GOOGLE_UNREGISTERED',
} as const;
