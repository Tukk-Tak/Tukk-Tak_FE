import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { PASSWORD_RESET_ERROR } from '../model/errorCodes';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// 가입 때와 반대로 "가입된 이메일"에만 인증번호를 보낸다.
// mock 규칙: none@example.com 은 가입되지 않은 이메일, google@example.com 은 구글로 가입한 계정이고,
//            그 외에는 발송에 성공한다.
export async function sendResetCode(email: string): Promise<{ expiresInSeconds: number }> {
   await mockDelay();

   if (email === 'none@example.com') {
      throw new ApiError(PASSWORD_RESET_ERROR.EMAIL_NOT_REGISTERED, '가입되지 않은 이메일이에요');
   }
   if (email === 'google@example.com') {
      throw new ApiError(
         PASSWORD_RESET_ERROR.GOOGLE_ACCOUNT,
         '구글로 가입한 계정이에요. 구글로 로그인해주세요',
      );
   }
   return { expiresInSeconds: 300 };
}
