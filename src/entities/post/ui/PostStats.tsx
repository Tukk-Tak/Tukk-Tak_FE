import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { formatCount } from '@/shared/lib/formatCount';

interface PostStatsProps {
   likeCount: number;
   commentCount: number;
   className?: string;
}

// 좋아요·댓글 수와 북마크 표시. 아이콘은 장식이라 숨기고, 숫자에는 보이지 않는 설명을 붙인다.
// TODO: 북마크는 지금 표시만 한다. 마이페이지의 북마크 목록과 함께 누르는 기능을 구현한다. (그때 button으로 바꾼다.)
export function PostStats({ likeCount, commentCount, className = '' }: PostStatsProps) {
   return (
      <div className={`flex items-center gap-3 text-xs text-black/50 ${className}`}>
         <span className="flex items-center gap-1">
            <Heart aria-hidden className="size-4" />
            <span className="sr-only">좋아요</span>
            {formatCount(likeCount)}
         </span>
         <span className="flex items-center gap-1">
            <MessageCircle aria-hidden className="size-4" />
            <span className="sr-only">댓글</span>
            {formatCount(commentCount)}
         </span>
         <Bookmark aria-hidden className="size-4 text-black/40" />
      </div>
   );
}
