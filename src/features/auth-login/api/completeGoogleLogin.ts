import { saveMockSession } from '@/entities/user/api/mockSession';
import type { User } from '@/entities/user/types';
import { mockDelay } from '@/shared/lib/mockDelay';

// TODO: 백엔드 API가 정해지면 교체한다. 지금은 UI 확인용 mock이다.
// 실제로는 구글 인증이 끝나면 백엔드가 세션 쿠키를 내려주고 바로 메인(/)으로 돌려보내므로,
// 이 함수와 /login/google 화면은 mock에서만 필요하다.
// mock 규칙: 항상 로그인에 성공한다. (가입되지 않은 계정 등 오류는 /login?google=unregistered 처럼
//            주소로 직접 확인한다.)
export async function completeGoogleLogin(): Promise<User> {
   await mockDelay(600);

   const user: User = { nickname: '맛있는분식' };
   saveMockSession(user, true);
   return user;
}
