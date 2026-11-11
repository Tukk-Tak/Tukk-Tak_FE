'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import type { ComposerTarget } from '../model/commentUi';
import type { useReplies } from '../model/useReplies';
import { ReplyItem } from './ReplyItem';

interface ReplyListProps {
   rootId: string;
   // 서버가 알려 준 이 스레드의 답글 수
   replyCount: number;
   replies: ReturnType<typeof useReplies>;
   onReply: (target: ComposerTarget) => void;
   onDeleted: (commentId: string) => void;
   // 스레드 맨 끝에 붙는 답글 입력창
   children?: ReactNode;
}

// 한 스레드의 대댓글. 기본은 접혀 있고("답글 N개 보기"), 펼치면 5개를 보여 준 뒤 "답글 N개 더 보기"로 이어서 불러온다.
// 대댓글은 오래된 순이라 새 답글은 맨 끝에 붙는다. 들여쓰기와 왼쪽 세로선으로 스레드임을 보여 준다.
export function ReplyList({
   rootId,
   replyCount,
   replies,
   onReply,
   onDeleted,
   children,
}: ReplyListProps) {
   const listId = useId();
   const remaining = Math.max(0, replyCount - replies.items.length);
   const firstLoading = replies.status === 'loading' && !replies.loaded;

   return (
      <div>
         {replyCount > 0 && (
            <button
               type="button"
               aria-expanded={replies.expanded}
               aria-controls={listId}
               onClick={replies.expanded ? replies.collapse : replies.expand}
               className="flex w-full cursor-pointer items-center justify-center gap-1 py-2 text-sm font-semibold text-brand-orange hover:underline"
            >
               {replies.expanded ? `답글 ${replyCount}개 접기` : `답글 ${replyCount}개 보기`}
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

               {replies.hasNext && replies.status !== 'error' && (
                  <button
                     type="button"
                     disabled={replies.status === 'loading-more' || replies.status === 'loading'}
                     onClick={replies.loadMore}
                     className="flex w-full cursor-pointer items-center justify-center gap-1 py-2 text-sm font-semibold text-brand-orange hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                     {replies.status === 'loading-more'
                        ? '불러오는 중'
                        : remaining > 0
                          ? `답글 ${remaining}개 더 보기`
                          : '답글 더 보기'}
                     <ChevronDown aria-hidden className="size-4" />
                  </button>
               )}
            </div>
         )}

         {children}
      </div>
   );
}
