export interface LoginValues {
   email: string;
   password: string;
   // 로그인 상태 유지. 시안처럼 처음부터 체크되어 있다.
   rememberMe: boolean;
}

export type LoginPayload = LoginValues;
