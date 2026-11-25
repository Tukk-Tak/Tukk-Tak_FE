// TODO: 목록(getPosts)과 댓글(createComment) mock이 아직 읽고 있어서 남겨 둔다. 두 API를 연동할 때 이 파일을 삭제한다.
// 좋아요·삭제는 이제 실제 서버가 처리하므로 이 저장소에 더 이상 기록하지 않는다. (그래서 항상 "없음"이다.)
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

export function isMockDeleted(id: string): boolean {
   return read().deletedIds.includes(id);
}

export function isMockLiked(id: string): boolean {
   return read().likedIds.includes(id);
}
