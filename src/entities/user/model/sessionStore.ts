import { setUnauthorizedHandler } from '@/shared/lib/apiClient';
import { clearAccessToken } from '@/shared/lib/authToken';
import { getMe } from '../api/getMe';
import { logout } from '../api/logout';
import { clearMockSession, MOCK_SESSION_KEY } from '../api/mockSession';
import type { User } from '../types';

// 로그인 상태. loading은 아직 세션을 확인하기 전이다. (서버 렌더링과 첫 렌더링은 항상 loading)
// expired는 로그인 시간이 지나(토큰 만료) 자동으로 로그아웃된 직후에만 true이고, 안내를 한 번 띄운 뒤 꺼진다.
export type SessionState =
   | { status: 'loading'; user: null; expired?: undefined }
   | { status: 'ready'; user: User | null; expired?: boolean };

const LOADING: SessionState = { status: 'loading', user: null };

let state: SessionState = LOADING;
let started = false;
const listeners = new Set<() => void>();

function setState(next: SessionState) {
   state = next;
   listeners.forEach((listener) => listener());
}

// 서버가 로그인 토큰을 거절(401: 만료·무효)하면 이 브라우저의 로그인 상태를 정리한다.
// 상태가 비면 로그인이 필요한 화면은 useMemberOnly가 로그인으로 보내고, 헤더는 비로그인 모습으로 바뀐다.
// 토큰을 들고 있었다는 것은 로그인해 있었다는 뜻이므로, 사용자가 이유를 알 수 있게 만료 안내를 켠다.
setUnauthorizedHandler(() => {
   clearAccessToken();
   clearMockSession();
   setState({ status: 'ready', user: null, expired: true });
});

// 만료 안내를 띄울 차례인지 확인하고, 띄울 차례였다면 안내를 끈다. (true면 호출한 쪽이 안내를 한 번 띄운다.)
// 현재 상태를 직접 보고 끄기 때문에, 개발 모드의 이중 실행이나 요청 여러 개가 동시에 401을 받아도 안내는 한 번만 나온다.
export function consumeExpiredNotice(): boolean {
   if (!state.expired) return false;
   setState({ status: 'ready', user: state.user });
   return true;
}

async function refresh() {
   try {
      setState({ status: 'ready', user: await getMe() });
   } catch {
      setState({ status: 'ready', user: null });
   }
}

// 다른 탭에서 로그인하거나 로그아웃하면 저장소가 바뀌므로 세션을 다시 확인한다.
function handleStorage(event: StorageEvent) {
   if (event.key === MOCK_SESSION_KEY || event.key === null) void refresh();
}

// useSyncExternalStore에 넘기는 구독 함수. 처음 구독할 때 세션을 한 번 확인한다.
export function subscribe(listener: () => void) {
   listeners.add(listener);
   if (!started) {
      started = true;
      window.addEventListener('storage', handleStorage);
      void refresh();
   }
   return () => {
      listeners.delete(listener);
   };
}

export const getSnapshot = () => state;
export const getServerSnapshot = () => LOADING;

// 로그인 요청이 성공했을 때 호출한다. 헤더 등 세션을 보는 모든 곳이 바로 바뀐다.
export function signIn(user: User) {
   setState({ status: 'ready', user });
}

export async function signOut() {
   try {
      await logout();
   } finally {
      setState({ status: 'ready', user: null });
   }
}
