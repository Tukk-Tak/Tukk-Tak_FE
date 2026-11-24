import { apiFetch } from '@/shared/lib/apiClient';
import { clearAccessToken, getAccessToken } from '@/shared/lib/authToken';
import { clearMockSession } from './mockSession';

// 서버가 연결만 받고 응답하지 않아도 요청이 끝나도록, 로그아웃 요청을 기다리는 시간의 상한이다.
const LOGOUT_TIMEOUT_MS = 5000;

// 로그아웃 POST /auth/logout (Bearer 토큰 + 리프레시 쿠키)
// 이 브라우저의 로그아웃(토큰·세션 정리)을 먼저 끝내고, 서버에는 그 뒤에 알린다.
// - 서버가 느리거나 응답하지 않아도 로그아웃이 미뤄지지 않는다.
// - 요청을 기다리는 사이에 다른 탭이 새로 로그인해 저장한 토큰을 뒤늦게 지우지 않는다.
// 서버 요청의 결과(이미 로그아웃됨 AUTH-ALREADY-LOGGED-OUT, 토큰 만료 AUTH-INVALID-TOKEN, 네트워크 오류, 시간 초과)는
// 이미 끝난 로컬 로그아웃을 바꾸지 않으며, 사용자가 원한 것은 "이 화면에서 로그아웃"이라서 오류를 보여 주지 않는다.
export function logout(): void {
   const token = getAccessToken();
   clearAccessToken();
   clearMockSession();

   // 토큰이 없으면(구글 mock 로그인 등) 서버가 알 수 있는 로그인이 아니므로 호출하지 않는다.
   if (!token) return;

   const controller = new AbortController();
   const timer = setTimeout(() => controller.abort(), LOGOUT_TIMEOUT_MS);

   // 저장소의 토큰은 위에서 이미 지웠으므로, 미리 잡아 둔 토큰을 직접 실어 보낸다. (auth: false는 저장소 토큰을 다시 붙이지 않게 한다.)
   // 만료돼서 401이 와도 직접 로그아웃한 것이라서 어떤 안내도 띄우지 않고 조용히 넘긴다.
   apiFetch<null>('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      auth: false,
      withCredentials: true,
      signal: controller.signal,
   })
      .catch(() => {
         // 위 설명대로 실패해도 할 일이 없다.
      })
      .finally(() => clearTimeout(timer));
}
