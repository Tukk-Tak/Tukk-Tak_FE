'use client';

import { ArrowLeft, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PostThumbnail, usePostDetail, type MockMode } from '@/entities/post';
import { LikeButton } from '@/features/community-like';
import { PostDeleteButton } from '@/features/community-post-delete';
import { formatDotDate, parseIsoDate } from '@/shared/lib/date';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { PostDetailSkeleton } from './PostDetailSkeleton';
import { ShareButton } from './ShareButton';

// TODO: 댓글·대댓글 단계에서 오른쪽에 댓글 카드를 붙여 2열로 바꾼다. (지금은 본문만 한 열로 가운데에 둔다.)
const CONTAINER_CLASS = 'mx-auto w-full max-w-4xl px-[4%] py-8 md:py-10';
const MOCK_MODES: MockMode[] = ['error', 'slow', 'notfound'];

function BackToList() {
   return (
      <Link
         href="/community"
         className="inline-flex items-center gap-2 text-sm font-bold text-brand-brown hover:underline"
      >
         <ArrowLeft aria-hidden className="size-4" />
         목록으로
      </Link>
   );
}

// 주소의 글 id를 읽는 동안(Suspense) 보여 주는 화면.
export function PostDetailFallback() {
   return (
      <section className={CONTAINER_CLASS}>
         <BackToList />
         <PostDetailSkeleton />
      </section>
   );
}

// 게시물 상세(본문). 좋아요·공유·삭제 버튼과 태그를 보여 주고, 삭제 버튼은 서버가 알려 준 canDelete일 때만 나온다.
export function PostDetail({ postId }: { postId: string }) {
   const searchParams = useSearchParams();
   // TODO: mock 동작 확인용 스위치이다. 백엔드 연동 때 삭제한다. (개발 환경에서만 주소의 ?mock= 로 켠다.)
   const mock =
      process.env.NODE_ENV === 'production'
         ? undefined
         : MOCK_MODES.find((mode) => mode === searchParams.get('mock'));
   const detail = usePostDetail(postId, mock);

   return (
      <section className={CONTAINER_CLASS}>
         <BackToList />

         {detail.status === 'loading' && <PostDetailSkeleton />}

         {detail.status === 'not-found' && (
            <div className="flex flex-col items-center px-4 py-24 text-center">
               <h1 className="text-lg font-bold text-black">게시물을 찾을 수 없어요</h1>
               <p className="mt-2 text-sm text-black/50">삭제되었거나 없는 게시물이에요.</p>
               <ButtonLink href="/community" size="field" className="mt-6">
                  목록으로 돌아가기
               </ButtonLink>
            </div>
         )}

         {detail.status === 'error' && (
            <div role="alert" className="flex flex-col items-center px-4 py-24 text-center">
               <p className="text-sm text-black/60">{detail.message}</p>
               <Button variant="outline" size="field" onClick={detail.retry} className="mt-5">
                  다시 시도
               </Button>
            </div>
         )}

         {detail.status === 'success' && (
            <article className="mt-6">
               <PostThumbnail
                  id={detail.post.id}
                  thumbnailUrl={detail.post.thumbnailUrl}
                  className="aspect-21/10 w-full rounded-2xl"
               />

               <div className="mt-4 flex flex-wrap items-center gap-x-4 border-b border-brand-line pb-3">
                  <LikeButton
                     key={detail.post.id}
                     postId={detail.post.id}
                     initialLiked={detail.post.liked}
                     initialCount={detail.post.likeCount}
                  />
                  {/* TODO: 북마크는 지금 표시만 한다. 마이페이지의 북마크 목록과 함께 누르는 기능을 구현한다. (그때 button으로 바꾼다.) */}
                  <span className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-black/60">
                     <Bookmark aria-hidden className="size-5" />
                     북마크
                  </span>
                  <ShareButton />
               </div>

               <div className="mt-6 flex items-start justify-between gap-4">
                  <h1 className="text-2xl font-bold wrap-break-word text-black">{detail.post.title}</h1>
                  {detail.post.canDelete && <PostDeleteButton postId={detail.post.id} />}
               </div>
               <p className="mt-2 text-xs text-black/50">
                  {detail.post.authorNickname}
                  {parseIsoDate(detail.post.createdAt) &&
                     ` · ${formatDotDate(parseIsoDate(detail.post.createdAt)!)}`}
               </p>

               {/* 내용은 글자 그대로만 보여 준다. (줄바꿈은 유지하고, 긴 글은 줄바꿈한다. HTML로 해석하지 않는다.) */}
               <p className="mt-5 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-black/80">
                  {detail.post.content}
               </p>

               {detail.post.tags.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2">
                     {detail.post.tags.map((tag) => (
                        <li key={tag}>
                           <Link
                              href={`/community?q=${encodeURIComponent(`#${tag}`)}`}
                              className="inline-block rounded-full bg-brand-orange-light px-4 py-2 text-xs font-bold text-brand-brown hover:bg-brand-line/50"
                           >
                              #{tag}
                           </Link>
                        </li>
                     ))}
                  </ul>
               )}
            </article>
         )}
      </section>
   );
}
