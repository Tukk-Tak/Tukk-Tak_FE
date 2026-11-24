export const ACCESS_TOKEN_KEY = 'ttukttak:access-token';

// 액세스 토큰(로그인 증명서)을 브라우저 저장소에 보관한다.
// 서버가 재발급 API 없이 쓰기로 해서, 새로고침해도 로그인이 이어지려면 저장소에 두어야 한다.
// 로그인 상태 유지를 체크하면 localStorage(브라우저를 닫아도 유지), 해제하면 sessionStorage(탭을 닫으면 로그아웃)에 둔다.
// 토큰 수명은 약 30분이라, 지나면 서버가 401을 주고 apiClient가 로그아웃으로 처리한다.

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

// 저장소에 쓰지 못했을 때만 쓰는 비상용 보관 변수다. (저장소를 막은 브라우저 등)
// 저장소가 정상일 때는 항상 null이라서, 다른 탭에서 로그아웃해 저장소가 비면 이 탭도 같이 로그아웃된다.
// 대신 이 경우의 로그인은 이 페이지가 열려 있는 동안만 유지되고, 새로고침하면 풀린다.
let memoryToken: string | null = null;

// 서버 렌더링 중에는 브라우저 저장소가 없으므로 토큰도 없다.
export function getAccessToken(): string | null {
   if (typeof window === 'undefined') return null;
   for (const storage of storages()) {
      try {
         const token = storage.getItem(ACCESS_TOKEN_KEY);
         if (token) return token;
      } catch {
         // 저장소를 읽을 수 없으면 아래 비상용 변수를 본다.
      }
   }
   return memoryToken;
}

export function clearAccessToken() {
   memoryToken = null;
   for (const storage of storages()) {
      try {
         storage.removeItem(ACCESS_TOKEN_KEY);
      } catch {
         // 저장소에 접근할 수 없으면 지울 것도 없다.
      }
   }
}

export function saveAccessToken(token: string, remember: boolean) {
   // 예전 토큰이 다른 저장소에 남아 있으면 그쪽이 먼저 읽힐 수 있으므로 먼저 지운다.
   clearAccessToken();
   try {
      (remember ? window.localStorage : window.sessionStorage).setItem(ACCESS_TOKEN_KEY, token);
   } catch {
      // 저장소를 쓸 수 없어도 토큰을 버리면 로그인 직후부터 인증 헤더 없이 요청하게 되므로,
      // 이 페이지가 열려 있는 동안만이라도 쓸 수 있게 메모리에 둔다. (새로고침하면 풀린다.)
      memoryToken = token;
   }
}
