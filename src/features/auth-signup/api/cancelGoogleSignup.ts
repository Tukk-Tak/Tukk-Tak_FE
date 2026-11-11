import { mockDelay } from '@/shared/lib/mockDelay';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// 구글 가입을 취소하면 서버에 만들어 둔 가입 대기 정보(구글에서 가져온 이름, 이메일)를 지운다.
export async function cancelGoogleSignup(): Promise<void> {
   await mockDelay(300);
}
