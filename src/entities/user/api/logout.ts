import { apiFetch } from '@/shared/lib/apiClient';
import { clearAccessToken, getAccessToken } from '@/shared/lib/authToken';
import { clearMockSession } from './mockSession';

// 로그아웃 POST /auth/logout (Bearer 토큰 + 리프레시 쿠키)
// 서버 응답과 상관없이 이 브라우저의 로그아웃은 항상 끝낸다.
// 이미 로그아웃됐거나(AUTH-ALREADY-LOGGED-OUT) 토큰이 만료됐거나(AUTH-INVALID-TOKEN) 네트워크가 끊겨도,
// 사용자가 원한 것은 "이 화면에서 로그아웃"이라서 오류를 보여 주지 않는다.
export async function logout(): Promise<void> {
   try {
      // 토큰이 없으면(구글 mock 로그인 등) 서버가 알 수 있는 로그인이 아니므로 호출하지 않는다.
      if (getAccessToken()) {
         // 토큰이 만료돼서 401이 와도 직접 로그아웃한 것이므로 "시간이 지나 로그아웃됐어요" 안내를 띄우지 않는다.
         await apiFetch<null>('/auth/logout', {
            method: 'POST',
            withCredentials: true,
            handleUnauthorized: false,
         });
      }
   } catch {
      // 위 설명대로 실패해도 아래 정리는 그대로 진행한다.
   } finally {
      clearAccessToken();
      clearMockSession();
   }
}
