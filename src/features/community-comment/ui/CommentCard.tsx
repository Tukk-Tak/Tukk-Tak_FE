'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CommentMock, CommentView } from '@/entities/post';
import { useSession } from '@/entities/user/model/useSession';
import { LoginRequiredModal } from '@/shared/ui/LoginRequiredModal';
import { Pagination } from '@/shared/ui/Pagination';
import { CommentUiContext, type CommentUi, type ComposerTarget } from '../model/commentUi';
import { useComments } from '../model/useComments';
import { CommentInput } from './CommentInput';
import { CommentList } from './CommentList';
import { GuestLoginBox } from './GuestLoginBox';

const COMMENT_MOCKS: CommentMock[] = ['empty', 'error', 'slow'];
// 방금 쓴 댓글을 강조해 두는 시간
const HIGHLIGHT_MS = 2000;

const INPUT_PLACEHOLDER_CLASS =
   'flex h-11 w-full items-center rounded-xl border border-brand-line bg-field-readonly px-4 text-sm text-black/30';

// 게시물 상세의 댓글 카드. 큰 화면에서는 화면에 붙어 있고(헤더 아래, 안쪽 목록만 스크롤), 작은 화면에서는 본문 아래에 이어진다.
// 제목 줄의 개수, 입력창, 댓글 목록, 페이지 번호를 담고, 답글 입력창·강조·로그인 안내처럼 여러 곳이 함께 쓰는 상태를 모아 둔다.
export function CommentCard({ postId }: { postId: string }) {
   const session = useSession();
   const searchParams = useSearchParams();
   // TODO: mock 동작 확인용 스위치이다. 백엔드 연동 때 삭제한다. (개발 환경에서만 주소의 ?cmock= 로 켠다.)
   const mock =
      process.env.NODE_ENV === 'production'
         ? undefined
         : COMMENT_MOCKS.find((mode) => mode === searchParams.get('cmock'));

   // 댓글 페이지는 주소가 아니라 이 컴포넌트가 들고 있는다. (댓글 페이지까지 공유할 일은 없다.)
   const [page, setPage] = useState(1);
   const comments = useComments(postId, page, mock);
   const listRef = useRef<HTMLDivElement>(null);

   const [composer, setComposer] = useState<ComposerTarget | null>(null);
   const [highlightId, setHighlightId] = useState<string | null>(null);
   const [loginPrompt, setLoginPrompt] = useState(false);
   const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

   const loggedIn = session.status === 'ready' && session.user !== null;
   const sessionReady = session.status === 'ready';

   // 요청한 페이지가 범위를 넘으면 서버가 마지막 페이지를 돌려준다. 같은 페이지로 맞춘다.
   // 새로 불러오는 중(refreshing)에는 아직 이전 페이지의 데이터라서, 끝난 뒤에만 비교한다. (안 그러면 페이지 이동이 되돌려진다.)
   const loadedPage =
      comments.status === 'success' && !comments.refreshing ? comments.data.page : null;
   useEffect(() => {
      if (loadedPage !== null && loadedPage !== page) setPage(loadedPage);
   }, [loadedPage, page]);

   useEffect(
      () => () => {
         if (highlightTimer.current) clearTimeout(highlightTimer.current);
      },
      [],
   );

   const highlight = useCallback((id: string) => {
      setHighlightId(id);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightId(null), HIGHLIGHT_MS);
   }, []);

   const { reload } = comments;
   const ui = useMemo<CommentUi>(
      () => ({
         loggedIn,
         composer,
         openComposer: setComposer,
         closeComposer: () => setComposer(null),
         highlightId,
         highlight,
         refresh: reload,
         requireLogin: () => setLoginPrompt(true),
      }),
      [loggedIn, composer, highlightId, highlight, reload],
   );

   // 새 댓글은 최신순이라 1페이지 맨 위에 생긴다. 1페이지로 가서 맨 위로 스크롤하고 잠깐 강조한다.
   const handleCreated = (created: CommentView) => {
      setPage(1);
      reload();
      highlight(created.id);
      listRef.current?.scrollTo({ top: 0 });
   };

   const handlePageChange = (next: number) => {
      setComposer(null);
      setPage(next);
      // 페이지를 바꾸면 목록 맨 위부터 보이게 한다.
      listRef.current?.scrollTo({ top: 0 });
   };

   const data = comments.status === 'success' ? comments.data : null;

   return (
      <CommentUiContext.Provider value={ui}>
         <aside
            aria-label="댓글"
            className="flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white lg:sticky lg:top-6 lg:h-[calc(100dvh-var(--header-height)-4rem)]"
         >
            <div className="shrink-0 border-b border-brand-line px-5 py-5">
               <h2 className="text-sm font-bold text-black">
                  댓글
                  {data && <span className="ml-1.5 text-brand-brown">{data.totalCount}</span>}
               </h2>
               <div className="mt-3">
                  {comments.status === 'loading' || !sessionReady ? (
                     <div className={INPUT_PLACEHOLDER_CLASS}>댓글을 불러오는 중이에요</div>
                  ) : loggedIn ? (
                     <CommentInput postId={postId} onCreated={handleCreated} />
                  ) : (
                     <GuestLoginBox />
                  )}
               </div>
            </div>

            <div
               ref={listRef}
               aria-busy={comments.status === 'success' && comments.refreshing}
               className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
            >
               <CommentList
                  status={comments.status}
                  comments={data?.comments ?? []}
                  message={comments.status === 'error' ? comments.message : undefined}
                  onRetry={comments.reload}
                  canWrite={loggedIn}
               />
            </div>

            {data && data.totalPages > 1 && (
               <div className="shrink-0 border-t border-brand-line py-3">
                  <Pagination
                     page={data.page}
                     totalPages={data.totalPages}
                     onChange={handlePageChange}
                  />
               </div>
            )}
         </aside>

         {loginPrompt && <LoginRequiredModal onCancel={() => setLoginPrompt(false)} />}
      </CommentUiContext.Provider>
   );
}
