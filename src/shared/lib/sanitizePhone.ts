// 전화번호 입력에 쓸 수 있는 글자(숫자, +, 하이픈, 괄호, 공백)만 남긴다.
export function sanitizePhoneInput(value: string) {
   return value.replace(/[^0-9+\-() ]/g, '');
}
