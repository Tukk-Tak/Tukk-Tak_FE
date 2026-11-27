import { useCallback, useEffect, useRef, useState } from 'react';
import { getComments, type CommentPage } from '@/entities/post';
import { toApiError } from '@/shared/lib/apiClient';
import { getAccessToken } from '@/shared/lib/authToken';

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
//
// viewer는 지금 보는 사람을 구분하는 값이다. 세션을 아직 확인하지 못했으면 null이다.
// 응답의 내 댓글(삭제 버튼)·비공개 열람 여부는 요청한 사용자 기준이라, 로그인·로그아웃하면 낡은 값이 된다.
// 그래서 세션 확인이 끝난 뒤 viewer가 바뀌면 다시 받는다. (viewerChanges가 올라가면 열려 있던 답글 목록도 새로 시작하게 쓴다.)
// 댓글은 로그인하지 않아도 볼 수 있으므로, 세션 확인을 기다리지 않고 바로 요청한다.
// 처음 세션 확인이 끝났을 때는, 이미 보낸 요청이 확인된 결과와 같은 쪽(토큰을 붙였는지)이면 다시 받지 않고,
// 어긋났을 때만 다시 받는다. (세션을 확인하는 사이에 다른 탭에서 로그아웃했거나 토큰이 만료돼 로그인이 풀린 경우)
export function useComments(postId: string, page: number, viewer: string | null) {
   const [attempt, setAttempt] = useState(0);
   const [viewerChanges, setViewerChanges] = useState(0);
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

   const key = JSON.stringify([postId, page, attempt, viewerChanges]);

   useEffect(() => {
      let ignore = false;

      // apiFetch가 요청을 보내는 순간 읽는 것과 같은 토큰으로 판단한다.
      sentWithTokenRef.current = getAccessToken() !== null;
      getComments(postId, { page })
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

   return { ...state, reload, viewerChanges };
}
