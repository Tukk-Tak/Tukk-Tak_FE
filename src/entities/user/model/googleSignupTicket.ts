// 처음 온 구글 계정이 가입을 마칠 때까지 서버가 준 가입 티켓과 구글 계정 정보를 보관한다.
// 구글 로그인 화면(또는 회원가입 1단계)에서 받아, 가입 화면(/signup/google)이 이어서 쓴다.
// 주소에 담으면 티켓이 노출되므로 브라우저 저장소에 둔다. sessionStorage라서 새로고침해도 유지되고 탭을 닫으면 사라진다.
// 티켓은 한 번만 쓸 수 있고 시간이 지나면 서버가 거절하므로, 가입을 마치거나 취소하면 지운다.

export interface GoogleSignupTicket {
   signupTicket: string;
   email: string;
   name: string;
}

const GOOGLE_SIGNUP_KEY = 'ttukttak:google-signup';

export function saveGoogleSignupTicket(ticket: GoogleSignupTicket) {
   try {
      window.sessionStorage.setItem(GOOGLE_SIGNUP_KEY, JSON.stringify(ticket));
   } catch {
      // 저장소를 쓸 수 없으면 가입 화면에서 정보를 읽지 못해 처음부터 다시 시작하게 된다.
   }
}

export function readGoogleSignupTicket(): GoogleSignupTicket | null {
   try {
      const raw = window.sessionStorage.getItem(GOOGLE_SIGNUP_KEY);
      if (!raw) return null;
      const value: unknown = JSON.parse(raw);
      if (typeof value !== 'object' || value === null) return null;
      const { signupTicket, email, name } = value as Record<string, unknown>;
      if (
         typeof signupTicket !== 'string' ||
         typeof email !== 'string' ||
         typeof name !== 'string'
      ) {
         return null;
      }
      return { signupTicket, email, name };
   } catch {
      // 저장소에 접근할 수 없거나 값이 깨졌으면 티켓이 없는 것으로 본다.
      return null;
   }
}

export function clearGoogleSignupTicket() {
   try {
      window.sessionStorage.removeItem(GOOGLE_SIGNUP_KEY);
   } catch {
      // 저장소에 접근할 수 없으면 지울 것도 없다.
   }
}
