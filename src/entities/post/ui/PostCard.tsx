import Link from 'next/link';
import type { PostSummary, TagHighlight } from '../types';
import { PostStats } from './PostStats';
import { PostThumbnail } from './PostThumbnail';
import { TagList } from './TagList';

interface PostCardProps {
   post: PostSummary;
   highlight?: TagHighlight;
   onTagClick?: (tag: string) => void;
}

// 카드형 목록의 글 하나. 카드 전체를 누르면 글로 이동하고(제목 링크가 카드를 덮는다), 태그는 따로 눌린다.
export function PostCard({ post, highlight, onTagClick }: PostCardProps) {
   return (
      <article className="relative flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white transition-shadow hover:shadow-card has-[a:focus-visible]:shadow-card">
         <PostThumbnail
            id={post.id}
            thumbnailUrl={post.thumbnailUrl}
            className="aspect-4/3 w-full"
         />

         <div className="flex flex-1 flex-col gap-2 p-4">
            <h3 className="text-sm font-bold text-black">
               {/* TODO: 글 상세 페이지(/community/[postId])가 만들어지면 연결이 동작한다. */}
               <Link
                  href={`/community/${post.id}`}
                  className="line-clamp-1 after:absolute after:inset-0"
               >
                  {post.title}
               </Link>
            </h3>
            <TagList tags={post.tags} highlight={highlight} onTagClick={onTagClick} />
            <div className="mt-auto flex items-center justify-between gap-3 pt-1">
               <span className="min-w-0 truncate text-xs font-bold text-black/70">
                  {post.authorNickname}
               </span>
               <PostStats likeCount={post.likeCount} commentCount={post.commentCount} />
            </div>
         </div>
      </article>
   );
}
