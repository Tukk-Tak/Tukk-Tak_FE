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

function storages() {
   return [window.sessionStorage, window.localStorage];
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
      (remember ? window.localStorage : window.sessionStorage).setItem(
         MOCK_SESSION_KEY,
         JSON.stringify(user),
      );
   } catch {
      // 저장소를 쓸 수 없으면 이 탭의 메모리 상태로만 로그인된다.
   }
}
