import { isValidEmail } from '@/shared/lib/isValidEmail';
import type { LoginValues } from '../types';

export type LoginErrors = Partial<Record<'email' | 'password', string>>;

// 로그인에서는 회원가입과 달리 비밀번호 규칙(영문·숫자·특수문자)을 검사하지 않고, 입력했는지만 본다.
// 규칙에 맞지 않는 비밀번호는 서버가 틀린 비밀번호로 처리한다.
export function getLoginErrors({ email, password }: Pick<LoginValues, 'email' | 'password'>) {
   const errors: LoginErrors = {};

   const trimmedEmail = email.trim();
   if (!trimmedEmail) errors.email = '이메일을 입력해주세요';
   else if (!isValidEmail(trimmedEmail)) errors.email = '이메일 형식이 맞지 않아요';

   if (!password) errors.password = '비밀번호를 입력해주세요';

   return errors;
}
