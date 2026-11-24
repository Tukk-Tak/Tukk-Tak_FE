import { saveAccessToken } from '@/shared/lib/authToken';
import type { User } from '../types';
import { fetchMe } from './getMe';
import { saveMockSession } from './mockSession';

// 서버에서 받은 액세스 토큰으로 로그인 상태를 만든다. (이메일 로그인, 구글 로그인, 구글 가입이 함께 쓴다.)
// 화면이 쓰는 이름과 사업자 인증 여부는 로그인 응답에 없어서 내 정보 조회로 채운다.
// 조회에 실패하면 예외를 던지고, 그 경우 토큰은 저장하지 않으므로 정리할 것이 없다.
// 방금 받은 토큰을 직접 넘기므로, 이 조회의 401이 "시간이 지나 로그아웃됐어요" 안내로 이어지지도 않는다.
export async function establishSession(accessToken: string, remember: boolean): Promise<User> {
   const user = await fetchMe(accessToken);

   saveAccessToken(accessToken, remember);
   // 사용자 정보도 같은 저장소에 함께 둔다. 새로고침 때 내 정보 조회가 실패하면 이 값을 보여 준다.
   saveMockSession(user, remember);
   return user;
}
