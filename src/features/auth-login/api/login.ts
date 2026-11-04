import { saveMockSession } from '@/entities/user/api/mockSession';
import type { User } from '@/entities/user/types';
import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { LOGIN_ERROR } from '../model/errorCodes';
import type { LoginPayload } from '../types';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// mock 규칙: owner@example.com / abc12345! 이면 로그인에 성공하고,
//            error@example.com 이면 서버 오류, 그 외에는 이메일 또는 비밀번호 불일치다.
// 실제로는 서버가 세션 쿠키를 내려주므로, 아래 saveMockSession 호출은 mock에서만 필요하다.
export async function login({ email, password, rememberMe }: LoginPayload): Promise<User> {
   await mockDelay(700);

   if (email === 'error@example.com') {
      throw new ApiError(
         LOGIN_ERROR.SERVER_ERROR,
         '로그인 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요',
      );
   }
   if (email !== 'owner@example.com' || password !== 'abc12345!') {
      throw new ApiError(LOGIN_ERROR.INVALID_CREDENTIALS, '이메일 또는 비밀번호가 맞지 않아요');
   }

   const user: User = { nickname: '맛있는분식' };
   saveMockSession(user, rememberMe);
   return user;
}
