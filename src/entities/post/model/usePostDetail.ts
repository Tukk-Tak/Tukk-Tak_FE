import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, toApiError } from '@/shared/lib/apiClient';
import { getAccessToken } from '@/shared/lib/authToken';
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
//
// viewer는 지금 보는 사람을 구분하는 값이다. 세션을 아직 확인하지 못했으면 null이다.
// 응답의 liked·bookmarked는 요청한 사용자 기준이라, 같은 화면에서 로그인·로그아웃하거나 다른 탭에서 로그인이 바뀌면 낡은 값이 된다.
// 그래서 세션 확인이 끝난 뒤 viewer가 바뀌면 상세를 다시 받는다.
// 상세는 로그인하지 않아도 볼 수 있으므로, 세션 확인을 기다리지 않고 바로 요청한다.
// 처음 세션 확인이 끝났을 때는, 이미 보낸 요청이 확인된 결과와 같은 쪽(토큰을 붙였는지)이면 다시 받지 않고,
// 어긋났을 때만 다시 받는다. (세션을 확인하는 사이에 다른 탭에서 로그아웃했거나 토큰이 만료돼 로그인이 풀린 경우)
export function usePostDetail(postId: string, viewer: string | null) {
   const [attempt, setAttempt] = useState(0);
   // 세션 확인이 끝난 뒤 viewer가 바뀐 횟수. 올라가면 상세를 다시 받는다.
   const [viewerChanges, setViewerChanges] = useState(0);
   // 조용한 재조회(refresh)로 새 값을 반영한 횟수. 화면은 이 값을 버튼의 key에 넣어, 새 값으로 다시 시작하게 한다.
   const [version, setVersion] = useState(0);
   const [settled, setSettled] = useState<Settled | null>(null);
   const lastViewerRef = useRef<string | null>(null);
   // 가장 최근 요청을 로그인 토큰을 붙여서 보냈는지. (아직 요청을 보내기 전이면 null)
   const sentWithTokenRef = useRef<boolean | null>(null);

   useEffect(() => {
      if (viewer === null) return;
      const last = lastViewerRef.current;
      lastViewerRef.current = viewer;
      const sent = sentWithTokenRef.current;
      const changed =
         last !== null ? last !== viewer : sent !== null && sent !== (viewer !== 'guest');
      if (changed) setViewerChanges((count) => count + 1);
   }, [viewer]);

   const key = JSON.stringify([postId, attempt, viewerChanges]);
   const keyRef = useRef(key);
   useEffect(() => {
      keyRef.current = key;
   });

   useEffect(() => {
      let ignore = false;

      // apiFetch가 요청을 보내는 순간 읽는 것과 같은 토큰으로 판단한다.
      sentWithTokenRef.current = getAccessToken() !== null;
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

   // 화면을 스켈레톤으로 바꾸지 않고 조용히 다시 받아서 값만 갱신한다. (좋아요 개수가 서버와 어긋났을 가능성이 있을 때 쓴다.)
   // 실패해도 지금 화면을 그대로 두고, 받는 사이에 글이나 사용자가 바뀌었다면 그 결과는 버린다.
   const refresh = useCallback(() => {
      const requestedKey = keyRef.current;
      getPost(postId)
         .then((post) => {
            if (keyRef.current !== requestedKey) return;
            setSettled({ key: requestedKey, outcome: { post } });
            setVersion((count) => count + 1);
         })
         .catch(() => {
            // 조용한 재조회라서 실패해도 알리지 않는다.
         });
   }, [postId]);

   let state: PostDetailState = { status: 'loading' };
   if (settled && settled.key === key) {
      const { outcome } = settled;
      if ('post' in outcome) state = { status: 'success', post: outcome.post };
      else if ('notFound' in outcome) state = { status: 'not-found' };
      else state = { status: 'error', message: outcome.message };
   }

   return { ...state, retry, refresh, version };
}
