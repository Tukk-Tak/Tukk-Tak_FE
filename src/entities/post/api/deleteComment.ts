import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { COMMENT_ERROR } from '../commentTypes';
import { currentViewer, findRecord } from './mockCommentStore';

// TODO: 백엔드 API가 정해지면 교체한다. (DELETE /comments/{id})
// 댓글을 삭제한다. 삭제하면 "삭제된 댓글입니다."로 남고, 아래 답글은 그대로 남는다.
// 삭제 버튼을 보여 주는 것(canDelete)과 별개로, 서버가 본인(또는 관리자)인지 다시 확인한다. (관리자 삭제는 아직 다루지 않는다.)
export async function deleteComment(id: string): Promise<void> {
   await mockDelay(400);

   const record = findRecord(id);
   if (!record || record.deleted) {
      throw new ApiError(COMMENT_ERROR.NOT_FOUND, '댓글을 찾을 수 없어요');
   }
   if (currentViewer() !== record.author) {
      throw new ApiError(COMMENT_ERROR.FORBIDDEN, '삭제할 수 없는 댓글이에요');
   }

   record.deleted = true;
}
