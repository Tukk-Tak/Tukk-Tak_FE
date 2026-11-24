import { createStore } from 'zustand';
import { setUnauthorizedHandler } from '@/shared/lib/apiClient';
import { clearAccessToken, getAccessToken } from '@/shared/lib/authToken';
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

// 로그인 상태 저장소. 값만 담고, 바꾸는 동작(signIn 등)은 아래 함수로 둔다. (useSession이 돌려주는 모양을 그대로 유지하려는 것이다.)
// 에디터처럼 화면마다 저장소를 새로 만들지 않고 하나를 공유한다. 서버에서는 항상 LOADING으로 시작하고,
// 사용자 값은 브라우저에서만(세션 확인, 로그인) 채워지므로 서버 렌더링 중에 사용자끼리 값이 섞이지 않는다.
export const sessionStore = createStore<SessionState>(() => LOADING);

// 상태를 통째로 바꾼다. (두 번째 인자 true: 합치지 않고 교체한다. 그래야 expired처럼 없어진 값이 남지 않는다.)
function setSession(next: SessionState) {
   sessionStore.setState(next, true);
}

// 서버가 로그인 토큰을 거절(401: 만료·무효)하면 이 브라우저의 로그인 상태를 정리한다.
// 상태가 비면 로그인이 필요한 화면은 useMemberOnly가 로그인으로 보내고, 헤더는 비로그인 모습으로 바뀐다.
// 토큰을 들고 있었다는 것은 로그인해 있었다는 뜻이므로, 사용자가 이유를 알 수 있게 만료 안내를 켠다.
// 401을 받은 요청의 토큰이 지금 저장된 토큰과 다르면, 그 사이에 로그아웃했거나 새로 로그인한 것이므로 무시한다.
// (직접 로그아웃한 직후 진행 중이던 요청의 401로 "시간이 지나 로그아웃됐어요" 안내가 뜨거나, 새 로그인이 지워지는 것을 막는다.)
setUnauthorizedHandler((sentToken) => {
   if (getAccessToken() !== sentToken) return;
   clearAccessToken();
   clearMockSession();
   setSession({ status: 'ready', user: null, expired: true });
});

// 만료 안내를 띄울 차례인지 확인하고, 띄울 차례였다면 안내를 끈다. (true면 호출한 쪽이 안내를 한 번 띄운다.)
// 현재 상태를 직접 보고 끄기 때문에, 개발 모드의 이중 실행이나 요청 여러 개가 동시에 401을 받아도 안내는 한 번만 나온다.
export function consumeExpiredNotice(): boolean {
   const current = sessionStore.getState();
   if (!current.expired) return false;
   setSession({ status: 'ready', user: current.user });
   return true;
}

async function refresh() {
   try {
      setSession({ status: 'ready', user: await getMe() });
   } catch {
      setSession({ status: 'ready', user: null });
   }
}

// 다른 탭에서 로그인하거나 로그아웃하면 저장소가 바뀌므로 세션을 다시 확인한다.
function handleStorage(event: StorageEvent) {
   if (event.key === MOCK_SESSION_KEY || event.key === null) void refresh();
}

let started = false;

// 세션 확인을 시작한다. 처음 한 번만 실행되므로 여러 곳에서(개발 모드의 이중 실행 포함) 불러도 안전하다.
// useSession이 처음 쓰이는 시점에 부른다. (브라우저에서만 불리므로 window를 바로 써도 된다.)
export function startSession() {
   if (started) return;
   started = true;
   window.addEventListener('storage', handleStorage);
   void refresh();
}

// 로그인 요청이 성공했을 때 호출한다. 헤더 등 세션을 보는 모든 곳이 바로 바뀐다.
export function signIn(user: User) {
   setSession({ status: 'ready', user });
}

// 로그아웃. 이 브라우저의 토큰·세션 정리와 화면 상태 변경을 바로 끝내고, 서버에는 그 뒤에 알린다. (서버 응답을 기다리지 않는다.)
export async function signOut() {
   logout();
   setSession({ status: 'ready', user: null });
}
