import Link from 'next/link';
import { formatDotDate, parseIsoDate } from '@/shared/lib/date';
import type { PostSummary, TagHighlight } from '../types';
import { PostStats } from './PostStats';
import { PostThumbnail } from './PostThumbnail';
import { TagList } from './TagList';

interface PostRowProps {
   post: PostSummary;
   highlight?: TagHighlight;
   onTagClick?: (tag: string) => void;
}

// 목록형의 글 하나(행). 좁은 화면에서는 좋아요·댓글이 아래 줄로 내려간다.
export function PostRow({ post, highlight, onTagClick }: PostRowProps) {
   const createdAt = parseIsoDate(post.createdAt);

   return (
      // 행 전체가 링크라서, 마우스를 올리거나 키보드로 링크에 포커스가 오면 배경색을 바꿔 눌린다는 걸 알려 준다.
      // (카드형의 호버 그림자와 같은 역할이다.)
      <li className="relative grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-brand-orange-light/30 has-[a:focus-visible]:bg-brand-orange-light/30 sm:grid-cols-[auto_1fr_auto]">
         <PostThumbnail
            id={post.id}
            thumbnailUrl={post.thumbnailUrl}
            className="size-16 rounded-lg sm:size-20"
         />

         <div className="flex min-w-0 flex-col gap-1">
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
            <p className="truncate text-xs text-black/50">
               {post.authorNickname}
               {createdAt && ` · ${formatDotDate(createdAt)}`}
            </p>
         </div>

         <PostStats
            likeCount={post.likeCount}
            commentCount={post.commentCount}
            className="col-span-2 sm:col-span-1"
         />
      </li>
   );
}
