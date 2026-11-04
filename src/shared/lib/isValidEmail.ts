// 회원가입과 로그인이 함께 쓰는 이메일 형식 검사.
// TODO: 서버의 이메일 검증 규칙이 확정되면 이 파일의 규칙만 맞춰서 바꾼다.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string) {
   return EMAIL_PATTERN.test(email);
}
