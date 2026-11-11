import { useCallback, useEffect, useState } from 'react';
import { getComments, type CommentMock, type CommentPage } from '@/entities/post';
import { toApiError } from '@/shared/lib/apiClient';

type CommentsState =
   | { status: 'loading' }
   // refreshing: 이미 보여 주고 있는 목록 위에서 새로 불러오는 중 (깜빡이지 않게 이전 목록을 그대로 둔다.)
   | { status: 'success'; data: CommentPage; refreshing: boolean }
   | { status: 'error'; message: string };

interface Settled {
   key: string;
   postId: string;
   outcome: { data: CommentPage } | { message: string };
}

// 한 게시물의 최상위 댓글 한 페이지를 불러온다. 페이지를 바꾸거나 다시 불러올 때(reload) 이전 목록을 유지한 채 갱신하고,
// 조건이 겹쳐 요청이 여러 번 가도 마지막 요청의 결과만 반영한다.
export function useComments(postId: string, page: number, mock?: CommentMock) {
   const [attempt, setAttempt] = useState(0);
   const [settled, setSettled] = useState<Settled | null>(null);

   const key = JSON.stringify([postId, page, mock, attempt]);

   useEffect(() => {
      let ignore = false;

      getComments(postId, { page, mock })
         .then((data) => {
            if (!ignore) setSettled({ key, postId, outcome: { data } });
         })
         .catch((error: unknown) => {
            if (!ignore)
               setSettled({ key, postId, outcome: { message: toApiError(error).message } });
         });

      return () => {
         ignore = true;
      };
      // 입력이 같은지는 직렬화한 key로 판단한다.
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [key]);

   // 오류에서 다시 시도하는 것과 쓰기·삭제 뒤 새로고침을 같은 동작으로 쓴다.
   const reload = useCallback(() => setAttempt((count) => count + 1), []);

   let state: CommentsState = { status: 'loading' };
   if (settled && settled.key === key) {
      state =
         'data' in settled.outcome
            ? { status: 'success', data: settled.outcome.data, refreshing: false }
            : { status: 'error', message: settled.outcome.message };
   } else if (settled && settled.postId === postId && 'data' in settled.outcome) {
      state = { status: 'success', data: settled.outcome.data, refreshing: true };
   }

   return { ...state, reload };
}
