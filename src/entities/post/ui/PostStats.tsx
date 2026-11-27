import { Heart, MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { formatCount } from '@/shared/lib/formatCount';

interface PostStatsProps {
   likeCount: number;
   commentCount: number;
   // 내가 좋아요를 눌렀으면 하트를 채워 보여 준다. (목록에서는 표시만 하고, 누르는 것은 글 상세에서 한다.)
   liked?: boolean;
   // 북마크 버튼 같은 동작 버튼. 이 부품은 entities라서 기능(features)을 직접 쓰지 못하므로, 목록 화면이 넘겨 준다.
   actions?: ReactNode;
   className?: string;
}

// 좋아요·댓글 수. 아이콘은 장식이라 숨기고, 숫자에는 보이지 않는 설명을 붙인다.
export function PostStats({
   likeCount,
   commentCount,
   liked = false,
   actions,
   className = '',
}: PostStatsProps) {
   return (
      <div className={`flex items-center gap-3 text-xs text-black/50 ${className}`}>
         <span className="flex items-center gap-1">
            <Heart
               aria-hidden
               className={`size-4 ${liked ? 'fill-brand-orange text-brand-orange' : ''}`}
            />
            <span className="sr-only">{liked ? '내가 좋아요한 글, 좋아요' : '좋아요'}</span>
            {formatCount(likeCount)}
         </span>
         <span className="flex items-center gap-1">
            <MessageCircle aria-hidden className="size-4" />
            <span className="sr-only">댓글</span>
            {formatCount(commentCount)}
         </span>
         {actions}
      </div>
   );
}
