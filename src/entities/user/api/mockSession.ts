import type { User } from '../types';

export const MOCK_SESSION_KEY = 'ttukttak:mock-session';

// TODO: 백엔드가 쿠키 세션을 내려주면 이 파일은 삭제한다. 지금은 로그인 결과를 브라우저 저장소에 흉내 내서 보관한다.
// 로그인 상태 유지를 체크하면 localStorage(브라우저를 닫아도 유지), 해제하면 sessionStorage(탭을 닫으면 로그아웃)에 둔다.

function isUser(value: unknown): value is User {
   return (
      typeof value === 'object' &&
      value !== null &&
      typeof (value as { nickname?: unknown }).nickname === 'string'
   );
}

// 쿠키를 막은 브라우저나 제한된 iframe에서는 저장소 속성을 읽는 것만으로 예외가 난다.
// 그래서 접근 자체를 개별로 보호하고, 쓸 수 있는 저장소만 돌려준다.
function storages(): Storage[] {
   const available: Storage[] = [];
   for (const name of ['sessionStorage', 'localStorage'] as const) {
      try {
         available.push(window[name]);
      } catch {
         // 접근이 막힌 저장소는 건너뛴다.
      }
   }
   return available;
}

function getStorage(remember: boolean): Storage | undefined {
   try {
      return remember ? window.localStorage : window.sessionStorage;
   } catch {
      return undefined;
   }
}

export function readMockSession(): User | null {
   for (const storage of storages()) {
      try {
         const raw = storage.getItem(MOCK_SESSION_KEY);
         if (!raw) continue;
         const parsed: unknown = JSON.parse(raw);
         if (isUser(parsed)) return parsed;
      } catch {
         // 저장소에 접근할 수 없거나 값이 깨졌으면 로그인하지 않은 것으로 본다.
      }
   }
   return null;
}

export function clearMockSession() {
   for (const storage of storages()) {
      try {
         storage.removeItem(MOCK_SESSION_KEY);
      } catch {
         // 저장소에 접근할 수 없으면 지울 것도 없다.
      }
   }
}

export function saveMockSession(user: User, remember: boolean) {
   clearMockSession();
   try {
      getStorage(remember)?.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
   } catch {
      // 저장소를 쓸 수 없으면 이 탭의 메모리 상태로만 로그인된다.
   }
}
