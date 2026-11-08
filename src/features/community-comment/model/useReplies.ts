import { useCallback, useRef, useState } from 'react';
import { getReplies, type CommentView } from '@/entities/post';
import { toApiError } from '@/shared/lib/apiClient';

interface RepliesState {
   expanded: boolean;
   items: CommentView[];
   nextCursor: string | null;
   hasNext: boolean;
   // 처음 한 번이라도 불러왔는지
   loaded: boolean;
   status: 'idle' | 'loading' | 'loading-more' | 'error';
   message: string | null;
}

const INITIAL: RepliesState = {
   expanded: false,
   items: [],
   nextCursor: null,
   hasNext: false,
   loaded: false,
   status: 'idle',
   message: null,
};

// 이미 가진 목록에 새로 받은 답글을 이어 붙인다. (같은 답글이 두 번 들어가지 않게 id로 거른다.)
function mergeReplies(current: CommentView[], incoming: CommentView[]): CommentView[] {
   const known = new Set(current.map((item) => item.id));
   return [...current, ...incoming.filter((item) => !known.has(item.id))];
}

// 한 스레드(최상위 댓글 하나)의 대댓글. 처음에는 접혀 있고, 펼치면 5개를 불러온 뒤 "더 보기"로 5개씩 이어 받는다.
// 답글을 쓴 뒤에는 loadAll로 끝까지 불러와서 새 답글이 목록 맨 끝에 보이게 한다. (대댓글은 오래된 순이다.)
export function useReplies(rootId: string) {
   const [state, setState] = useState<RepliesState>(INITIAL);
   // 요청마다 올라가는 번호. 오래된 요청의 응답이 늦게 도착해도 무시한다.
   const requestRef = useRef(0);

   const loadFirst = useCallback(async () => {
      const request = ++requestRef.current;
      setState((prev) => ({ ...prev, status: 'loading', message: null }));
      try {
         const page = await getReplies(rootId);
         if (request !== requestRef.current) return;
         setState((prev) => ({
            ...prev,
            items: page.replies,
            nextCursor: page.nextCursor,
            hasNext: page.hasNext,
            loaded: true,
            status: 'idle',
         }));
      } catch (error) {
         if (request !== requestRef.current) return;
         setState((prev) => ({ ...prev, status: 'error', message: toApiError(error).message }));
      }
   }, [rootId]);

   const loadMore = useCallback(async () => {
      if (!state.hasNext || state.status === 'loading-more') return;
      const request = ++requestRef.current;
      setState((prev) => ({ ...prev, status: 'loading-more', message: null }));
      try {
         const page = await getReplies(rootId, { cursor: state.nextCursor });
         if (request !== requestRef.current) return;
         setState((prev) => ({
            ...prev,
            items: mergeReplies(prev.items, page.replies),
            nextCursor: page.nextCursor,
            hasNext: page.hasNext,
            status: 'idle',
         }));
      } catch (error) {
         if (request !== requestRef.current) return;
         setState((prev) => ({ ...prev, status: 'error', message: toApiError(error).message }));
      }
   }, [rootId, state.hasNext, state.nextCursor, state.status]);

   // 처음부터 끝까지 모두 불러온다. 스레드가 짧아서(답글 수십 개 이내) 반복 요청으로 충분하다.
   const loadAll = useCallback(async () => {
      const request = ++requestRef.current;
      setState((prev) => ({ ...prev, expanded: true, status: 'loading', message: null }));
      try {
         let items: CommentView[] = [];
         let cursor: string | null = null;
         let hasNext = true;
         while (hasNext) {
            const page = await getReplies(rootId, { cursor });
            items = mergeReplies(items, page.replies);
            cursor = page.nextCursor;
            hasNext = page.hasNext;
         }
         if (request !== requestRef.current) return;
         setState((prev) => ({
            ...prev,
            items,
            nextCursor: null,
            hasNext: false,
            loaded: true,
            status: 'idle',
         }));
      } catch (error) {
         if (request !== requestRef.current) return;
         setState((prev) => ({ ...prev, status: 'error', message: toApiError(error).message }));
      }
   }, [rootId]);

   const expand = useCallback(() => {
      setState((prev) => ({ ...prev, expanded: true }));
      if (!state.loaded && state.status !== 'loading') void loadFirst();
   }, [loadFirst, state.loaded, state.status]);

   const collapse = useCallback(() => setState((prev) => ({ ...prev, expanded: false })), []);

   const retry = useCallback(() => {
      if (state.loaded) void loadMore();
      else void loadFirst();
   }, [loadFirst, loadMore, state.loaded]);

   // 삭제한 답글을 목록에서 "삭제된 댓글입니다." 상태로 바꾼다. (서버 응답을 다시 받지 않고 화면에서만 바꾼다.)
   const markDeleted = useCallback((id: string) => {
      setState((prev) => ({
         ...prev,
         items: prev.items.map((item) =>
            item.id === id
               ? {
                    ...item,
                    status: 'deleted',
                    authorNickname: null,
                    content: null,
                    isPrivate: false,
                    isPostAuthor: false,
                    mentionNickname: null,
                    canReply: false,
                    canDelete: false,
                    authorCanViewPrivateReply: false,
                 }
               : item,
         ),
      }));
   }, []);

   return { ...state, expand, collapse, loadMore, loadAll, retry, markDeleted };
}
