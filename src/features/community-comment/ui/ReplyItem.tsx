'use client';

import type { CommentView } from '@/entities/post';
import type { ComposerTarget } from '../model/commentUi';
import { CommentBody } from './CommentBody';
import { DeletedRow } from './DeletedRow';
import { PrivateRow } from './PrivateRow';

interface ReplyItemProps {
   reply: CommentView;
   rootId: string;
   onReply: (target: ComposerTarget) => void;
   onDeleted: (commentId: string) => void;
}

// 대댓글 한 건. 서버가 알려 준 상태(visible / private_hidden / deleted)에 맞춰 그리기만 한다.
export function ReplyItem({ reply, rootId, onReply, onDeleted }: ReplyItemProps) {
   if (reply.status === 'private_hidden') {
      return (
         <li>
            <PrivateRow compact />
         </li>
      );
   }
   if (reply.status === 'deleted') {
      return (
         <li>
            <DeletedRow compact />
         </li>
      );
   }

   return (
      <li>
         <CommentBody
            comment={reply}
            kind="reply"
            rootId={rootId}
            onReply={onReply}
            onDeleted={onDeleted}
         />
      </li>
   );
}
