import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { COMMENT_ERROR, REPLY_PAGE_SIZE, type ReplyPage } from '../commentTypes';
import {
   canView,
   currentViewer,
   findRecord,
   getRecords,
   postAuthorOf,
   toView,
} from './mockCommentStore';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. (GET /comments/{id}/replies?cursor=&size=5)
// 한 스레드의 대댓글을 오래된 순으로 5개씩 돌려준다. cursor는 다음에 받을 위치를 가리키는 값이고, 서버가 만든 값을 그대로 다시 보낸다.
// 비공개로 숨겨진 댓글의 대댓글은 요청해도 받을 수 없다.
export async function getReplies(
   rootId: string,
   { cursor }: { cursor?: string | null } = {},
): Promise<ReplyPage> {
   await mockDelay(300);

   const root = findRecord(rootId);
   if (!root || root.parentId !== null) {
      throw new ApiError(COMMENT_ERROR.NOT_FOUND, '댓글을 찾을 수 없어요');
   }
   const viewer = currentViewer();
   if (!root.deleted && !canView(root, null, viewer, postAuthorOf(root.postId))) {
      throw new ApiError(COMMENT_ERROR.FORBIDDEN, '볼 수 없는 댓글이에요');
   }

   const replies = getRecords(root.postId)
      .filter((record) => record.parentId === root.id)
      .sort((a, b) => a.createdAt - b.createdAt);

   const start = Number(cursor ?? 0) || 0;
   const end = start + REPLY_PAGE_SIZE;
   const hasNext = end < replies.length;

   return {
      replies: replies.slice(start, end).map((record) => toView(record, viewer)),
      nextCursor: hasNext ? String(end) : null,
      hasNext,
   };
}
