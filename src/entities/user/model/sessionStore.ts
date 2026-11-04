import { getMe } from '../api/getMe';
import { logout } from '../api/logout';
import { MOCK_SESSION_KEY } from '../api/mockSession';
import type { User } from '../types';

// 로그인 상태. loading은 아직 세션을 확인하기 전이다. (서버 렌더링과 첫 렌더링은 항상 loading)
export type SessionState =
   { status: 'loading'; user: null } | { status: 'ready'; user: User | null };

const LOADING: SessionState = { status: 'loading', user: null };

let state: SessionState = LOADING;
let started = false;
const listeners = new Set<() => void>();

function setState(next: SessionState) {
   state = next;
   listeners.forEach((listener) => listener());
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
