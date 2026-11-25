import { useCallback, useEffect, useState } from 'react';
import { ApiError, toApiError } from '@/shared/lib/apiClient';
import { getPost } from '../api/getPost';
import type { PostDetail } from '../types';

type PostDetailState =
   | { status: 'loading' }
   | { status: 'success'; post: PostDetail }
   | { status: 'not-found' }
   | { status: 'error'; message: string };

type Outcome = { post: PostDetail } | { notFound: true } | { message: string };

interface Settled {
   key: string;
   outcome: Outcome;
}

// 게시물 하나를 불러온다. 없는 글(not-found)과 불러오기 실패(error)를 나눠서 알려 주고, 다시 시도할 수 있다.
// 글 id가 바뀌어 요청이 겹쳐도 가장 마지막 요청의 결과만 반영한다.
export function usePostDetail(postId: string) {
   const [attempt, setAttempt] = useState(0);
   const [settled, setSettled] = useState<Settled | null>(null);

   const key = JSON.stringify([postId, attempt]);

   useEffect(() => {
      let ignore = false;

      getPost(postId)
         .then((post) => {
            if (!ignore) setSettled({ key, outcome: { post } });
         })
         .catch((error: unknown) => {
            if (ignore) return;
            const apiError = toApiError(error);
            // 없거나 삭제된 글은 서버가 404로 알려 준다. (에러 코드는 정해진 값이 없어서 상태로 구분한다.)
            const notFound = error instanceof ApiError && error.status === 404;
            setSettled({
               key,
               outcome: notFound ? { notFound: true } : { message: apiError.message },
            });
         });

      return () => {
         ignore = true;
      };
      // 입력이 같은지는 직렬화한 key로 판단한다.
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [key]);

   const retry = useCallback(() => setAttempt((count) => count + 1), []);

   let state: PostDetailState = { status: 'loading' };
   if (settled && settled.key === key) {
      const { outcome } = settled;
      if ('post' in outcome) state = { status: 'success', post: outcome.post };
      else if ('notFound' in outcome) state = { status: 'not-found' };
      else state = { status: 'error', message: outcome.message };
   }

   return { ...state, retry };
}
