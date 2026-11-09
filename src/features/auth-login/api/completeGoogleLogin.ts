import type { User } from '@/entities/user/types';
import { mockDelay } from '@/shared/lib/mockDelay';

// TODO: 백엔드 API가 정해지면 교체한다. 지금은 UI 확인용 mock이다.
// 실제로는 구글 인증이 끝나면 백엔드가 세션 쿠키를 내려주고 바로 메인(/)으로 돌려보내므로,
// 이 함수와 /login/google 화면은 mock에서만 필요하다.
// 세션 저장은 여기서 하지 않는다. 처리 중에 화면을 떠났다면(취소) 저장하면 안 되므로,
// 취소 여부를 아는 호출 쪽(GoogleLoginCallback)이 saveMockSession과 signIn을 함께 실행한다.
// mock 규칙: 항상 로그인에 성공한다. (가입되지 않은 계정 등 오류는 /login?google=unregistered 처럼
//            주소로 직접 확인한다.)
export async function completeGoogleLogin(): Promise<User> {
   await mockDelay(600);

   return { nickname: '맛있는분식', isBusinessVerified: true };
}
