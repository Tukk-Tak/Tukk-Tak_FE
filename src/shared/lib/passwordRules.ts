// 비밀번호 규칙. 회원가입과 비밀번호 재설정이 같은 규칙을 쓰므로 한 곳에 둔다.
// 서버 검증 규칙이 확정되면 이 파일의 규칙만 맞춰서 바꾼다.

// 특수문자로 인정하는 ASCII 문자 32개. 한글, 이모지, 공백은 특수문자로 보지 않는다.
// TODO: 서버가 허용하는 특수문자 범위가 확정되면 이 집합만 맞춘다.
const SPECIAL_CHARACTER_PATTERN = /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

const PASSWORD_RULES = [
   { id: 'letter', label: '영문 포함', test: (value: string) => /[A-Za-z]/.test(value) },
   { id: 'number', label: '숫자 포함', test: (value: string) => /\d/.test(value) },
   {
      id: 'special',
      label: '특수문자 포함',
      test: (value: string) => SPECIAL_CHARACTER_PATTERN.test(value),
   },
   {
      id: 'length',
      label: '8~16자',
      test: (value: string) => value.length >= 8 && value.length <= 16,
   },
];

export interface PasswordRuleResult {
   id: string;
   label: string;
   passed: boolean;
}

export function checkPasswordRules(password: string): PasswordRuleResult[] {
   return PASSWORD_RULES.map(({ id, label, test }) => ({ id, label, passed: test(password) }));
}

// 모든 규칙을 충족하는지
export const isPasswordValid = (password: string) =>
   checkPasswordRules(password).every((rule) => rule.passed);
