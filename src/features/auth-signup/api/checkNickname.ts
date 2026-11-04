import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { SIGNUP_ERROR } from '../model/errorCodes';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// mock 규칙: "이미있는이름" 은 사용 중인 이름이고, 그 외에는 사용할 수 있다.
export async function checkNickname(nickname: string): Promise<void> {
   await mockDelay(400);

   if (nickname === '이미있는이름') {
      throw new ApiError(SIGNUP_ERROR.NICKNAME_TAKEN, '이미 사용 중인 이름이에요');
   }
}
