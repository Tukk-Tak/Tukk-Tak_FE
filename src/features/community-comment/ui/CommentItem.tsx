'use client';

import type { CommentView } from '@/entities/post';
import { useCommentUi, type ComposerTarget } from '../model/commentUi';
import { useReplies } from '../model/useReplies';
import { CommentBody } from './CommentBody';
import { DeletedRow } from './DeletedRow';
import { PrivateRow } from './PrivateRow';
import { ReplyComposer } from './ReplyComposer';
import { ReplyList } from './ReplyList';

// 최상위 댓글 하나와 그 스레드(대댓글, 답글 입력창).
// 어떻게 보일지는 서버가 알려 준 status로 정하고, 이 컴포넌트는 열람 권한을 직접 계산하지 않는다.
// - visible: 본문 + 답글 / private_hidden: "비공개 댓글이에요." 한 줄(아래 답글도 없음) / deleted: "삭제된 댓글입니다." 한 줄(남은 답글은 보임)
export function CommentItem({ comment }: { comment: CommentView }) {
   const ui = useCommentUi();
   const replies = useReplies(comment.id);

   const composerOpen = ui.composer?.rootId === comment.id;
   const showThread =
      comment.status !== 'private_hidden' && (comment.replyCount > 0 || composerOpen);

   // 답글 버튼을 누르면 이 스레드를 펼치고 맨 끝에 입력창을 연다. (다른 스레드에서 열려 있던 입력창은 닫힌다.)
   const handleReply = (target: ComposerTarget) => {
      ui.openComposer(target);
      replies.expand();
   };

   // 답글을 등록하면 스레드를 끝까지 불러와 새 답글이 맨 끝에 보이게 하고, 잠깐 강조한 뒤 댓글 개수를 갱신한다.
   const handleSubmitted = async (reply: CommentView) => {
      ui.closeComposer();
      await replies.loadAll();
      ui.highlight(reply.id);
      ui.refresh();
   };

   const handleReplyDeleted = (commentId: string) => {
      replies.markDeleted(commentId);
      ui.refresh();
   };

   return (
      <li className="border-b border-brand-line last:border-b-0">
         {comment.status === 'private_hidden' && <PrivateRow />}
         {comment.status === 'deleted' && <DeletedRow />}
         {comment.status === 'visible' && (
            <CommentBody
               comment={comment}
               kind="root"
               rootId={comment.id}
               onReply={handleReply}
               onDeleted={ui.refresh}
            />
         )}

         {showThread && (
            <ReplyList
               rootId={comment.id}
               replyCount={comment.replyCount}
               replies={replies}
               onReply={handleReply}
               onDeleted={handleReplyDeleted}
            >
               {composerOpen && ui.composer && (
                  <ReplyComposer
                     // 다른 사람에게 답하는 것으로 바뀌면 입력창을 새로 시작한다.
                     key={`${ui.composer.rootId}:${ui.composer.mention ?? ''}`}
                     target={ui.composer}
                     rootPrivate={comment.isPrivate}
                     onSubmitted={handleSubmitted}
                     onCancel={ui.closeComposer}
                  />
               )}
            </ReplyList>
         )}
      </li>
   );
}
