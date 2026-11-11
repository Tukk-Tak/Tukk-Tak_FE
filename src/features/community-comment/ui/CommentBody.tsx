'use client';

import { Lock } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { CommentView } from '@/entities/post';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';
import { useCommentUi, type ComposerTarget } from '../model/commentUi';
import { CommentAvatar } from './CommentAvatar';
import { DeleteCommentButton } from './DeleteCommentButton';

interface CommentBodyProps {
   // 보이는(visible) 댓글·답글 한 건
   comment: CommentView;
   // root: 최상위 댓글 / reply: 대댓글
   kind: 'root' | 'reply';
   // 이 댓글이 속한 스레드의 최상위 댓글 id
   rootId: string;
   onReply: (target: ComposerTarget) => void;
   onDeleted: (commentId: string) => void;
}

// 보이는 댓글·답글의 본문: 아바타, 닉네임, 시간, 작성자·비공개 표시, 내용, 답글·삭제 동작.
// 내용은 글자 그대로만 보여 준다. (HTML로 해석하지 않고, 줄바꿈은 유지하고, 공백 없는 긴 글은 줄바꿈한다.)
export function CommentBody({ comment, kind, rootId, onReply, onDeleted }: CommentBodyProps) {
   const ui = useCommentUi();
   const ref = useRef<HTMLDivElement>(null);
   const highlighted = ui.highlightId === comment.id;
   const nickname = comment.authorNickname ?? '';

   // 방금 쓴 댓글이 화면 밖에 있으면 보이는 곳까지 스크롤한다.
   useEffect(() => {
      if (highlighted) ref.current?.scrollIntoView({ block: 'nearest' });
   }, [highlighted]);

   // 로그인하지 않았어도 보이는 댓글에는 답글 버튼을 보여 주고, 누르면 로그인 안내를 띄운다.
   const showReply = comment.canReply || (!ui.loggedIn && comment.status === 'visible');

   const handleReply = () => {
      if (!ui.loggedIn) {
         ui.requireLogin();
         return;
      }
      onReply({
         rootId,
         // 최상위 댓글에 바로 답할 때는 멘션을 붙이지 않고, 대댓글에 답할 때만 그 사람을 멘션한다.
         mention: kind === 'reply' ? nickname : null,
         mentionCanViewPrivateReply: comment.authorCanViewPrivateReply,
      });
   };

   return (
      <div
         ref={ref}
         data-comment-id={comment.id}
         className={`flex gap-3 py-4 transition-colors duration-500 ${
            kind === 'root' ? 'px-5' : 'px-4'
         } ${highlighted ? 'bg-brand-orange-light' : comment.isPrivate ? 'bg-brand-orange-light/50' : ''}`}
      >
         <CommentAvatar nickname={nickname} size={kind === 'root' ? 'md' : 'sm'} />

         <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
               <span className="truncate text-sm font-bold text-black">{nickname}</span>
               {comment.isPostAuthor && (
                  <span className="shrink-0 rounded border border-brand-orange px-1.5 py-px text-[10px] font-bold text-brand-orange">
                     작성자
                  </span>
               )}
               <time dateTime={comment.createdAt} className="shrink-0 text-xs text-black/40">
                  {formatRelativeTime(comment.createdAt)}
               </time>
               {comment.isPrivate && (
                  <span className="ml-auto flex shrink-0 items-center gap-1 text-xs text-black/50">
                     <Lock aria-hidden className="size-3" />
                     비공개
                  </span>
               )}
            </div>

            <p className="mt-1 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-black/80">
               {comment.mentionNickname && (
                  <span className="mr-1 font-bold text-brand-orange">
                     @{comment.mentionNickname}
                  </span>
               )}
               {comment.content}
            </p>

            {(showReply || comment.canDelete) && (
               <div className="mt-2 flex items-center gap-3 text-xs">
                  {showReply && (
                     <button
                        type="button"
                        onClick={handleReply}
                        className="cursor-pointer font-semibold text-black/50 hover:text-black hover:underline"
                     >
                        답글
                     </button>
                  )}
                  {comment.canDelete && (
                     <DeleteCommentButton commentId={comment.id} onDeleted={onDeleted} />
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
