import { useCallback, useEffect, useRef, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { getPosts } from '../api/getPosts';
import type { GetPostsParams, PostPage } from '../types';

type PostsState =
   | { status: 'loading' }
   | { status: 'success'; data: PostPage }
   | { status: 'error'; message: string };

interface Settled {
   key: string;
   outcome: { data: PostPage } | { message: string };
}

// 조건(검색어·정렬·페이지)이 바뀔 때마다 목록을 다시 불러온다.
// 조건을 빠르게 바꿔도 가장 마지막 조건의 결과만 화면에 반영한다.
// (이전 요청의 응답이 늦게 도착해도 무시한다. 현재 조건과 맞는 결과가 없는 동안은 loading이다.)
//
// viewer는 지금 보는 사람을 구분하는 값이다. 세션을 아직 확인하지 못했으면 null이다.
// 응답의 liked·bookmarked는 요청한 사용자 기준이라, 같은 화면에서 로그인·로그아웃하거나 다른 탭에서 로그인이 바뀌면 낡은 값이 된다.
// 그래서 세션 확인이 끝난 뒤 viewer가 바뀌면 목록을 다시 받는다. (처음 세션 확인이 끝났을 때는 다시 받지 않는다.)
// 목록은 로그인하지 않아도 볼 수 있으므로, 세션 확인을 기다리지 않고 바로 요청한다.
export function usePosts(params: GetPostsParams, viewer: string | null) {
   const [attempt, setAttempt] = useState(0);
   // 세션 확인이 끝난 뒤 viewer가 바뀐 횟수. 올라가면 목록을 다시 받는다.
   const [viewerChanges, setViewerChanges] = useState(0);
   const [settled, setSettled] = useState<Settled | null>(null);
   const lastViewerRef = useRef<string | null>(null);

   useEffect(() => {
      if (viewer === null) return;
      const last = lastViewerRef.current;
      lastViewerRef.current = viewer;
      if (last !== null && last !== viewer) setViewerChanges((count) => count + 1);
   }, [viewer]);

   const key = JSON.stringify([params, attempt, viewerChanges]);

   useEffect(() => {
      let ignore = false;

      getPosts(params)
         .then((data) => {
            if (!ignore) setSettled({ key, outcome: { data } });
         })
         .catch((error: unknown) => {
            if (!ignore) setSettled({ key, outcome: { message: toApiError(error).message } });
         });

      return () => {
         ignore = true;
      };
      // params 객체는 렌더링마다 새로 만들어지므로, 내용이 같은지는 key(직렬화한 값)로 판단한다.
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [key]);

   const retry = useCallback(() => setAttempt((count) => count + 1), []);

   let state: PostsState = { status: 'loading' };
   if (settled && settled.key === key) {
      state =
         'data' in settled.outcome
            ? { status: 'success', data: settled.outcome.data }
            : { status: 'error', message: settled.outcome.message };
   }

   return { ...state, retry };
}
