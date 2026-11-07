'use client';

import { useEffect, useRef } from 'react';
import {
   PostCard,
   PostRow,
   usePosts,
   type GetPostsParams,
   type TagHighlight,
} from '@/entities/post';
import { useSession } from '@/entities/user/model/useSession';
import { SearchBar, SortSelect, useCommunityQuery, ViewToggle } from '@/features/community-search';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { Pagination } from '@/shared/ui/Pagination';
import { CommunityEmpty } from './CommunityEmpty';
import { PostListSkeleton } from './PostListSkeleton';
import { ResultSummary } from './ResultSummary';

// 한 페이지에 보여 주는 글 수. 카드형은 3열 × 2행이다.
const PAGE_SIZE = 6;

const CONTAINER_CLASS = 'mx-auto w-full max-w-6xl px-[4%] py-10 md:py-12';

function CommunityHeading() {
   return (
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
         <div>
            <p className="text-xs font-bold tracking-[0.2em] text-brand-orange">COMMUNITY</p>
            <h1 className="mt-1 text-2xl font-bold text-black md:text-3xl">
               사장님들의 가게 이야기
            </h1>
         </div>
         <p className="text-sm text-black/40">가게를 만들고 운영하는 서로의 경험을 나눠보세요.</p>
      </header>
   );
}

// 주소의 검색 조건을 읽는 동안(Suspense) 보여 주는 화면. 제목과 목록 자리만 먼저 그린다.
export function CommunityListFallback() {
   return (
      <section className={CONTAINER_CLASS}>
         <CommunityHeading />
         <div className="mt-6 h-10" />
         <div className="mt-6">
            <PostListSkeleton view="card" />
         </div>
      </section>
   );
}

// 커뮤니티 글 목록. 검색·정렬·보기 방식·페이지는 주소에 담기고, 로그인한 사용자에게만 글쓰기 버튼이 보인다.
export function CommunityList() {
   const query = useCommunityQuery();
   const session = useSession();
   const rootRef = useRef<HTMLElement>(null);

   // 세션을 확인하기 전에는 숨겨서, 로그인한 사용자가 잠깐 비로그인 화면을 보지 않게 한다.
   const canWrite = session.status === 'ready' && session.user !== null;

   const { parsed } = query;
   const params: GetPostsParams = {
      text: parsed.kind === 'text' ? parsed.text : undefined,
      tag: parsed.kind === 'tag' ? parsed.tag : undefined,
      sort: query.sort,
      page: query.page,
      pageSize: PAGE_SIZE,
      mock: query.mock,
   };
   const posts = usePosts(params);

   // 요청한 페이지가 범위를 넘으면 서버가 마지막 페이지를 돌려준다. 주소도 같은 페이지로 맞춘다.
   const loadedPage = posts.status === 'success' ? posts.data.page : null;
   const { page: requestedPage, syncPage } = query;
   useEffect(() => {
      if (loadedPage !== null && loadedPage !== requestedPage) syncPage(loadedPage);
   }, [loadedPage, requestedPage, syncPage]);

   const highlight: TagHighlight | undefined =
      parsed.kind === 'tag'
         ? { value: parsed.tag, exact: true }
         : parsed.kind === 'text'
           ? { value: parsed.text, exact: false }
           : undefined;

   const searching = parsed.kind !== 'none';
   // 올라온 글이 하나도 없으면 정렬과 보기 전환은 쓸 수 없다.
   const noPostsAtAll = posts.status === 'success' && !searching && posts.data.totalCount === 0;

   const searchByTag = (tag: string) => query.search(`#${tag}`);

   const handlePageChange = (page: number) => {
      query.goToPage(page);
      // 스크롤은 페이지가 아니라 main 안에서 일어나므로, 새 페이지의 맨 위부터 보이게 main을 올린다.
      rootRef.current?.closest('main')?.scrollTo({ top: 0 });
   };

   return (
      <section ref={rootRef} className={CONTAINER_CLASS}>
         <CommunityHeading />

         {/* 안내 박스나 검색 오류 문구가 생겨도 다른 버튼이 밀리지 않게 위쪽에 맞춘다(items-start). */}
         <div className="mt-6 flex flex-wrap items-start gap-2">
            <div className="w-full min-w-0 flex-1 sm:w-auto">
               <SearchBar value={query.q} onSearch={query.search} />
            </div>
            <SortSelect value={query.sort} disabled={noPostsAtAll} onChange={query.changeSort} />
            <ViewToggle value={query.view} disabled={noPostsAtAll} onChange={query.changeView} />
            {canWrite && (
               // TODO: 글쓰기 페이지(/community/write)가 만들어지면 연결이 동작한다.
               <ButtonLink href="/community/write" size="field">
                  글쓰기
               </ButtonLink>
            )}
         </div>

         {posts.status === 'success' && parsed.kind !== 'none' && (
            <ResultSummary
               query={parsed}
               totalCount={posts.data.totalCount}
               onReset={query.reset}
            />
         )}

         <div className="mt-6">
            {posts.status === 'loading' && <PostListSkeleton view={query.view} />}

            {posts.status === 'error' && (
               <div role="alert" className="flex flex-col items-center px-4 py-20 text-center">
                  <p className="text-sm text-black/60">{posts.message}</p>
                  <Button variant="outline" size="field" onClick={posts.retry} className="mt-5">
                     다시 시도
                  </Button>
               </div>
            )}

            {posts.status === 'success' && posts.data.totalCount === 0 && (
               <CommunityEmpty
                  kind={parsed.kind === 'tag' ? 'tag' : parsed.kind === 'text' ? 'text' : 'none'}
                  keyword={
                     parsed.kind === 'tag' ? parsed.tag : parsed.kind === 'text' ? parsed.text : ''
                  }
                  canWrite={canWrite}
                  onReset={query.reset}
               />
            )}

            {posts.status === 'success' && posts.data.totalCount > 0 && (
               <>
                  {query.view === 'card' ? (
                     <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.posts.map((post) => (
                           <li key={post.id} className="flex">
                              <div className="w-full">
                                 <PostCard
                                    post={post}
                                    highlight={highlight}
                                    onTagClick={searchByTag}
                                 />
                              </div>
                           </li>
                        ))}
                     </ul>
                  ) : (
                     <ul className="divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-white">
                        {posts.data.posts.map((post) => (
                           <PostRow
                              key={post.id}
                              post={post}
                              highlight={highlight}
                              onTagClick={searchByTag}
                           />
                        ))}
                     </ul>
                  )}

                  <Pagination
                     page={posts.data.page}
                     totalPages={posts.data.totalPages}
                     onChange={handlePageChange}
                     className="mt-10"
                  />
               </>
            )}
         </div>
      </section>
   );
}
