'use client';

import type { CommentView } from '@/entities/post';
import { Button } from '@/shared/ui/Button';
import { CommentItem } from './CommentItem';

// 댓글을 불러오는 동안 보이는 자리 표시
export function CommentListSkeleton() {
   return (
      <div role="status" aria-label="댓글을 불러오는 중이에요">
         <ul aria-hidden className="animate-pulse">
            {[0, 1, 2, 3, 4].map((item) => (
               <li key={item} className="flex gap-3 border-b border-brand-line px-5 py-4">
                  <div className="size-8 shrink-0 rounded-full bg-field-readonly" />
                  <div className="flex-1 space-y-2.5">
                     <div className="h-3 w-1/4 rounded-full bg-field-readonly" />
                     <div className="h-3 w-full rounded-full bg-field-readonly" />
                     <div className="h-3 w-3/5 rounded-full bg-field-readonly" />
                  </div>
               </li>
            ))}
         </ul>
      </div>
   );
}

interface CommentListProps {
   status: 'loading' | 'success' | 'error';
   comments: CommentView[];
   message?: string;
   onRetry: () => void;
   // 글을 쓸 수 있는 사용자인지 (빈 목록 안내 문구가 달라진다.)
   canWrite: boolean;
}

// 댓글 목록의 상태별 화면(불러오는 중 / 불러오기 실패 / 댓글 없음 / 목록).
export function CommentList({ status, comments, message, onRetry, canWrite }: CommentListProps) {
   if (status === 'loading') return <CommentListSkeleton />;

   if (status === 'error') {
      return (
         <div role="alert" className="flex flex-col items-center px-5 py-12 text-center">
            <p className="text-sm text-black/60">{message}</p>
            <Button variant="outline" size="field" onClick={onRetry} className="mt-4">
               다시 시도
            </Button>
         </div>
      );
   }

   if (comments.length === 0) {
      return (
         <div className="px-5 py-12 text-center">
            <p className="text-sm font-bold text-black">아직 댓글이 없어요</p>
            <p className="mt-1 text-xs text-black/50">
               {canWrite ? '첫 댓글을 남겨보세요.' : '로그인하면 댓글을 남길 수 있어요.'}
            </p>
         </div>
      );
   }

   return (
      <ul>
         {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
         ))}
      </ul>
   );
}
