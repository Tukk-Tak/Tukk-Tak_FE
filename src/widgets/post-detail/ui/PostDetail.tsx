'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PostThumbnail, usePostDetail } from '@/entities/post';
import { useSession } from '@/entities/user/model/useSession';
import { BookmarkButton } from '@/features/community-bookmark';
import { CommentCard } from '@/features/community-comment';
import { LikeButton } from '@/features/community-like';
import { PostDeleteButton } from '@/features/community-post-delete';
import { formatDotDate, parseIsoDate } from '@/shared/lib/date';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';
import { PostDetailSkeleton } from './PostDetailSkeleton';
import { ShareButton } from './ShareButton';

// 큰 화면에서는 왼쪽에 본문, 오른쪽에 댓글 카드(화면에 붙어 있음)를 둔다. 작은 화면에서는 본문 아래에 댓글이 이어진다.
const CONTAINER_CLASS = 'mx-auto w-full max-w-[75rem] px-[3%] py-8 md:py-10';
const DETAIL_GRID_CLASS = 'grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]';
// 댓글 카드가 "목록으로" 줄 아래, 사진과 같은 높이에서 시작하도록 맞춘 위쪽 여백 (링크 줄 높이 + 사진 위 간격)
const COMMENT_OFFSET_CLASS = 'lg:pt-12';

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

// 게시물 상세(본문). 좋아요·북마크·공유·삭제 버튼과 태그를 보여 준다.
// 삭제 버튼은 로그인한 사용자의 닉네임이 글 작성자와 같을 때만 나온다. (서버가 삭제 가능 여부를 따로 알려 주지 않는다.)
// 닉네임은 가입할 때 중복이 막히는 값이라 본인 확인에 쓸 수 있고, 실제 삭제 권한은 서버가 다시 확인한다.
// 관리자도 삭제할 수 있지만, 프론트는 아직 관리자 여부(role)를 알지 못해서 관리자용 삭제 버튼은 관리자 화면 작업 때 함께 다룬다.
export function PostDetail({ postId }: { postId: string }) {
   const detail = usePostDetail(postId);
   const session = useSession();

   return (
      <section className={CONTAINER_CLASS}>
         {(detail.status === 'not-found' || detail.status === 'error') && <BackToList />}

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
            <div className={DETAIL_GRID_CLASS}>
               <article className="min-w-0">
                  <BackToList />
                  <PostThumbnail
                     id={detail.post.id}
                     thumbnailUrl={detail.post.thumbnailUrl}
                     className="mt-6 aspect-21/10 w-full rounded-2xl"
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 border-b border-brand-line pb-3">
                     {/* 두 버튼은 같은 부모 안에 있으므로 key가 서로 달라야 한다. (글이 바뀌면 각각 새로 만들려는 것이다.) */}
                     <LikeButton
                        key={`like-${detail.post.id}`}
                        postId={detail.post.id}
                        initialLiked={detail.post.liked}
                        initialCount={detail.post.likeCount}
                     />
                     <BookmarkButton
                        key={`bookmark-${detail.post.id}`}
                        postId={detail.post.id}
                        initialBookmarked={detail.post.bookmarked}
                     />
                     <ShareButton />
                  </div>

                  <div className="mt-6 flex items-start justify-between gap-4">
                     <h1 className="text-2xl font-bold wrap-break-word text-black">
                        {detail.post.title}
                     </h1>
                     {session.user?.nickname === detail.post.authorNickname && (
                        <PostDeleteButton postId={detail.post.id} />
                     )}
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

               <div className={COMMENT_OFFSET_CLASS}>
                  <CommentCard key={detail.post.id} postId={detail.post.id} />
               </div>
            </div>
         )}
      </section>
   );
}
