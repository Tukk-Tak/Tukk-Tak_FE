// TODO: 백엔드가 생기면 이 파일은 삭제한다. 좋아요와 삭제 결과를 브라우저 저장소에 흉내 내서 보관한다.
// (실제로는 서버가 사용자별로 보관하고, 목록·상세 조회 응답에 이미 반영해서 내려준다.)
const STATE_KEY = 'ttukttak:mock-post-state';

interface MockPostState {
   likedIds: string[];
   deletedIds: string[];
}

function read(): MockPostState {
   try {
      const raw = window.localStorage.getItem(STATE_KEY);
      if (!raw) return { likedIds: [], deletedIds: [] };
      const parsed = JSON.parse(raw) as Partial<MockPostState>;
      return {
         likedIds: Array.isArray(parsed.likedIds) ? parsed.likedIds : [],
         deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
      };
   } catch {
      return { likedIds: [], deletedIds: [] };
   }
}

function write(state: MockPostState) {
   try {
      window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
   } catch {
      // 저장소를 쓸 수 없으면 이 탭의 메모리에서만 유지되지 않는다. (mock이라 무시한다.)
   }
}

export function isMockDeleted(id: string): boolean {
   return read().deletedIds.includes(id);
}

export function isMockLiked(id: string): boolean {
   return read().likedIds.includes(id);
}

export function markMockDeleted(id: string) {
   const state = read();
   if (!state.deletedIds.includes(id)) write({ ...state, deletedIds: [...state.deletedIds, id] });
}

export function setMockLiked(id: string, liked: boolean) {
   const state = read();
   const others = state.likedIds.filter((likedId) => likedId !== id);
   write({ ...state, likedIds: liked ? [...others, id] : others });
}
