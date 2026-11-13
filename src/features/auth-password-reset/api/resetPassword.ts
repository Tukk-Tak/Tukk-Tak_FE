import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { PASSWORD_RESET_ERROR } from '../model/errorCodes';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// 서버는 이 이메일이 인증을 마쳤는지, 새 비밀번호가 규칙을 지키는지, 기존 비밀번호와 같은지를 다시 확인한다.
// mock 규칙: Same1234! 는 기존 비밀번호와 같다는 오류, Fail1234! 는 변경 실패이고, 그 외에는 성공한다.
export async function resetPassword(email: string, password: string): Promise<void> {
   await mockDelay();

   if (password === 'Same1234!') {
      throw new ApiError(
         PASSWORD_RESET_ERROR.SAME_AS_OLD,
         '이전에 쓰던 비밀번호와 같아요. 다른 비밀번호를 입력해주세요',
      );
   }
   if (password === 'Fail1234!') {
      throw new ApiError(
         PASSWORD_RESET_ERROR.RESET_FAILED,
         '비밀번호를 변경하지 못했어요. 잠시 후 다시 시도해주세요',
      );
   }
   void email;
}
