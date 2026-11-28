'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import type { ComposerTarget } from '../model/commentUi';
import type { useReplies } from '../model/useReplies';
import { ReplyItem } from './ReplyItem';

interface ReplyListProps {
   rootId: string;
   // 부모(최상위) 댓글이 삭제됐는지
   rootDeleted: boolean;
   // 서버가 알려 준 이 스레드의 답글 수
   replyCount: number;
   replies: ReturnType<typeof useReplies>;
   onReply: (target: ComposerTarget) => void;
   onDeleted: (commentId: string) => void;
   // 스레드 맨 끝에 붙는 답글 입력창
   children?: ReactNode;
}

// 한 스레드의 대댓글. 기본은 접혀 있고("답글 N개 보기"), 펼치면 서버가 준 답글을 한 번에 모두 보여 준다.
// 새 답글은 맨 끝에 붙는다. 들여쓰기와 왼쪽 세로선으로 스레드임을 보여 준다.
export function ReplyList({
   rootId,
   rootDeleted,
   replyCount,
   replies,
   onReply,
   onDeleted,
   children,
}: ReplyListProps) {
   const listId = useId();
   const firstLoading = replies.status === 'loading' && !replies.loaded;
   // 서버가 알려 준 답글 수와 실제로 받은 답글 수가 다를 수 있다. (예: 답글을 지운 직후, 삭제된 답글 줄을 개수에 세는지에 따라)
   // 받은 답글이 더 많으면 그 수를 써서, 보이는 답글이 있는데 접는 버튼이 사라지는 일이 없게 한다.
   const shownCount = Math.max(replyCount, replies.items.length);

   return (
      <div>
         {shownCount > 0 && (
            <button
               type="button"
               aria-expanded={replies.expanded}
               aria-controls={listId}
               onClick={replies.expanded ? replies.collapse : replies.expand}
               className="flex w-full cursor-pointer items-center justify-center gap-1 py-2 text-sm font-semibold text-brand-orange hover:underline"
            >
               {replies.expanded ? `답글 ${shownCount}개 접기` : `답글 ${shownCount}개 보기`}
               {replies.expanded ? (
                  <ChevronUp aria-hidden className="size-4" />
               ) : (
                  <ChevronDown aria-hidden className="size-4" />
               )}
            </button>
         )}

         {replies.expanded && (
            <div id={listId}>
               {firstLoading && (
                  <div
                     role="status"
                     className="ml-9 animate-pulse space-y-3 border-l-2 border-brand-line px-4 py-4"
                  >
                     <span className="sr-only">답글을 불러오는 중이에요</span>
                     <div aria-hidden className="h-3 w-1/3 rounded-full bg-field-readonly" />
                     <div aria-hidden className="h-3 w-4/5 rounded-full bg-field-readonly" />
                  </div>
               )}

               {replies.items.length > 0 && (
                  <ul className="ml-9 border-l-2 border-brand-line">
                     {replies.items.map((reply) => (
                        <ReplyItem
                           key={reply.id}
                           reply={reply}
                           rootId={rootId}
                           rootDeleted={rootDeleted}
                           onReply={onReply}
                           onDeleted={onDeleted}
                        />
                     ))}
                  </ul>
               )}

               {replies.status === 'error' && (
                  <div
                     role="alert"
                     className="ml-9 flex items-center gap-3 px-4 py-3 text-xs text-black/60"
                  >
                     {replies.message}
                     <button
                        type="button"
                        onClick={replies.retry}
                        className="cursor-pointer font-bold text-brand-orange hover:underline"
                     >
                        다시 시도
                     </button>
                  </div>
               )}
            </div>
         )}

         {children}
      </div>
   );
}
