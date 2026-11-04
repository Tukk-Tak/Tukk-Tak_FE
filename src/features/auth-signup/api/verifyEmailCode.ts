import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { SIGNUP_ERROR } from '../model/errorCodes';

const MOCK_CODE = '123456';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// mock 규칙: 인증번호가 123456 이면 성공하고, 그 외에는 인증번호 오류다.
export async function verifyEmailCode(email: string, code: string): Promise<void> {
   await mockDelay();

   if (code !== MOCK_CODE) {
      throw new ApiError(SIGNUP_ERROR.INVALID_EMAIL_CODE, '인증번호가 맞지 않아요');
   }
   void email;
}
