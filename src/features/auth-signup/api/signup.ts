import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { SIGNUP_ERROR } from '../model/errorCodes';
import type { SignupPayload } from '../types';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// mock 규칙: 닉네임이 "가입실패" 이면 오류가 나고, 그 외에는 가입에 성공한다.
export async function signup(payload: SignupPayload): Promise<void> {
   await mockDelay(900);

   if (payload.nickname === '가입실패') {
      throw new ApiError(
         SIGNUP_ERROR.SIGNUP_FAILED,
         '가입 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요',
      );
   }
}
