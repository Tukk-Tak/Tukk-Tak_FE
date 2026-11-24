import type { User } from '../types';

export const MOCK_SESSION_KEY = 'ttukttak:mock-session';

// 마지막으로 확인한 사용자 정보를 브라우저 저장소에 보관한다. 두 가지 용도가 있다.
// 1) 구글 mock 로그인: 아직 토큰 없이 이 값만으로 로그인 상태를 흉내 낸다. (구글 로그인 API를 연동하면 이 용도는 사라진다.)
// 2) 내 정보 조회(GET /members/me)가 네트워크·서버 오류로 실패했을 때, 로그아웃된 것처럼 보이지 않도록 보여 줄 마지막 값.
// TODO: 구글 로그인 API를 연동하면 이름을 바꾸거나(예: userCache) 용도 1)을 지운다.
// 로그인 상태 유지를 체크하면 localStorage(브라우저를 닫아도 유지), 해제하면 sessionStorage(탭을 닫으면 로그아웃)에 둔다.

// 저장된 값에서 User를 꺼낸다. 필드가 없던 예전 세션은 인증은 "미인증", 이름은 닉네임, 가입 방식은 이메일로 채운다.
function parseUser(value: unknown): User | null {
   if (typeof value !== 'object' || value === null) return null;
   const { nickname, name, isBusinessVerified, authProvider } = value as Record<string, unknown>;
   if (typeof nickname !== 'string') return null;
   return {
      nickname,
      name: typeof name === 'string' ? name : nickname,
      isBusinessVerified: isBusinessVerified === true,
      authProvider: authProvider === 'GOOGLE' ? 'GOOGLE' : 'LOCAL',
   };
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
         const user = parseUser(JSON.parse(raw));
         if (user) return user;
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

// 이미 저장된 값이 있을 때, 같은 저장소에서 내용만 최신으로 바꾼다. (로그인 상태 유지 선택을 그대로 둔다.)
// 저장된 값이 없으면 아무것도 하지 않는다. 값이 같으면 쓰지 않아서 다른 탭에 불필요한 변경 알림(storage 이벤트)이 가지 않는다.
export function updateMockSession(user: User) {
   const next = JSON.stringify(user);
   for (const storage of storages()) {
      try {
         const current = storage.getItem(MOCK_SESSION_KEY);
         if (current === null) continue;
         if (current !== next) storage.setItem(MOCK_SESSION_KEY, next);
         return;
      } catch {
         // 저장소를 쓸 수 없으면 최신으로 바꾸지 못할 뿐이다.
      }
   }
}
