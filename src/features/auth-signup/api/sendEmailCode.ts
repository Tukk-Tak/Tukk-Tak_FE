import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { SIGNUP_ERROR } from '../model/errorCodes';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// mock 규칙: used@example.com 은 이미 가입된 이메일이고, 그 외에는 발송에 성공한다.
export async function sendEmailCode(email: string): Promise<{ expiresInSeconds: number }> {
   await mockDelay();

   if (email === 'used@example.com') {
      throw new ApiError(SIGNUP_ERROR.EMAIL_ALREADY_REGISTERED, '이미 가입된 이메일이에요');
   }
   return { expiresInSeconds: 300 };
}
