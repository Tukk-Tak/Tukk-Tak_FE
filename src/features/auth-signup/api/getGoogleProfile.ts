import { mockDelay } from '@/shared/lib/mockDelay';
import type { GoogleProfile } from '../types';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// 실제로는 구글 인증 때 서버가 만들어 둔 가입 대기 정보를 조회한다. (없거나 만료되면 오류)
// mock 규칙: 항상 같은 계정 정보를 돌려준다.
export async function getGoogleProfile(): Promise<GoogleProfile> {
   await mockDelay(500);
   return { name: '김뚝딱', email: 'ttuk@gmail.com' };
}
