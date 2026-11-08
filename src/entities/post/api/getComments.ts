import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import {
   COMMENT_ERROR,
   COMMENT_PAGE_SIZE,
   type CommentMock,
   type CommentPage,
} from '../commentTypes';
import { currentViewer, getRecords, toView } from './mockCommentStore';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. (GET /posts/{id}/comments?page=&size=10)
// 최상위 댓글만 최신순으로 10개씩 돌려준다. 대댓글은 getReplies로 따로 불러온다.
// 보는 사람에 맞춘 처리(비공개 숨김, 할 수 있는 동작)는 서버가 한다. mock은 mockCommentStore가 흉내 낸다.
// mock 규칙: ?cmock=empty 는 댓글 없음, ?cmock=error 는 불러오기 실패, ?cmock=slow 는 느린 응답이다.
export async function getComments(
   postId: string,
   { page, mock }: { page: number; mock?: CommentMock },
): Promise<CommentPage> {
   await mockDelay(mock === 'slow' ? 3000 : 400);

   if (mock === 'error') {
      throw new ApiError(
         COMMENT_ERROR.LOAD_FAILED,
         '댓글을 불러오지 못했어요. 잠시 후 다시 시도해주세요',
      );
   }
   if (mock === 'empty') return { comments: [], totalCount: 0, page: 1, totalPages: 1 };

   const viewer = currentViewer();
   const records = getRecords(postId);
   const roots = records
      .filter((record) => record.parentId === null)
      .sort((a, b) => b.createdAt - a.createdAt);

   const totalPages = Math.max(1, Math.ceil(roots.length / COMMENT_PAGE_SIZE));
   const current = Math.min(Math.max(1, page), totalPages);
   const start = (current - 1) * COMMENT_PAGE_SIZE;

   return {
      comments: roots
         .slice(start, start + COMMENT_PAGE_SIZE)
         .map((record) => toView(record, viewer)),
      // 삭제된 것은 빼고, 비공개 댓글은 볼 수 없어도 센다.
      totalCount: records.filter((record) => !record.deleted).length,
      page: current,
      totalPages,
   };
}
