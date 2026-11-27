import { useCallback, useRef, useState } from 'react';
import { getReplies, type CommentView } from '@/entities/post';
import { toApiError } from '@/shared/lib/apiClient';

interface RepliesState {
   expanded: boolean;
   items: CommentView[];
   // 처음 한 번이라도 불러왔는지
   loaded: boolean;
   status: 'idle' | 'loading' | 'error';
   message: string | null;
}

const INITIAL: RepliesState = {
   expanded: false,
   items: [],
   loaded: false,
   status: 'idle',
   message: null,
};

// 한 스레드(최상위 댓글 하나)의 대댓글. 처음에는 접혀 있고, 펼치면 한 번에 모두 불러온다. (서버가 페이지 없이 배열로 준다.)
// 답글을 쓰거나 지운 뒤에는 reload로 다시 받는다. 이미 보여 주던 목록은 새로 받는 동안 그대로 둔다.
// replyCount는 서버가 알려 준 답글 수이고, 0이면 불러올 것이 없어서 요청을 보내지 않는다.
export function useReplies(postId: string, rootId: string, replyCount: number) {
   const [state, setState] = useState<RepliesState>(INITIAL);
   // 요청마다 올라가는 번호. 오래된 요청의 응답이 늦게 도착해도 무시한다.
   const requestRef = useRef(0);

   // 불러오기를 끝낼 때까지 기다리고, 실패해도 던지지 않는다. (실패는 status로 알린다.)
   const load = useCallback(async () => {
      const request = ++requestRef.current;
      setState((prev) => ({ ...prev, expanded: true, status: 'loading', message: null }));
      try {
         const items = await getReplies(postId, rootId);
         if (request !== requestRef.current) return;
         setState((prev) => ({ ...prev, items, loaded: true, status: 'idle' }));
      } catch (error) {
         if (request !== requestRef.current) return;
         setState((prev) => ({ ...prev, status: 'error', message: toApiError(error).message }));
      }
   }, [postId, rootId]);

   const expand = useCallback(() => {
      setState((prev) => ({ ...prev, expanded: true }));
      if (!state.loaded && state.status !== 'loading' && replyCount > 0) void load();
   }, [load, replyCount, state.loaded, state.status]);

   const collapse = useCallback(() => setState((prev) => ({ ...prev, expanded: false })), []);

   return { ...state, expand, collapse, reload: load, retry: load };
}
