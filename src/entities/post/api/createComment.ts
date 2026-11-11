import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import {
   COMMENT_ERROR,
   COMMENT_MAX_LENGTH,
   type CommentView,
   type CreateCommentPayload,
   type CreateReplyPayload,
} from '../commentTypes';
import {
   canView,
   createRecord,
   currentViewer,
   findRecord,
   postAuthorOf,
   toView,
} from './mockCommentStore';
import { isMockDeleted } from './mockPostState';

// 서버가 다시 검사하는 입력 규칙: 앞뒤 공백을 뺀 내용이 1~100자여야 한다. (화면에서 막아도 서버가 다시 확인한다.)
function validateContent(content: string): string {
   const trimmed = content.trim();
   if (trimmed.length < 1 || trimmed.length > COMMENT_MAX_LENGTH) {
      throw new ApiError(COMMENT_ERROR.INVALID, `댓글은 1~${COMMENT_MAX_LENGTH}자로 입력해주세요`);
   }
   return trimmed;
}

function requireViewer(): string {
   const viewer = currentViewer();
   if (!viewer) throw new ApiError(COMMENT_ERROR.UNAUTHENTICATED, '로그인이 필요해요');
   return viewer;
}

// TODO: 백엔드 API가 정해지면 교체한다. (POST /posts/{id}/comments)
// 댓글을 쓴다. 등록한 댓글은 수정할 수 없다.
// mock 규칙: 내용이 "등록실패"이면 오류가 나고, 그 외에는 약 0.5초 뒤 성공한다.
export async function createComment(
   postId: string,
   { content, isPrivate }: CreateCommentPayload,
): Promise<CommentView> {
   await mockDelay(500);

   const viewer = requireViewer();
   const text = validateContent(content);
   if (isMockDeleted(postId)) {
      throw new ApiError(COMMENT_ERROR.NOT_FOUND, '게시물을 찾을 수 없어요');
   }
   if (text === '등록실패') {
      throw new ApiError(
         COMMENT_ERROR.CREATE_FAILED,
         '댓글을 등록하지 못했어요. 잠시 후 다시 시도해주세요',
      );
   }

   const record = createRecord(postId, {
      parentId: null,
      author: viewer,
      content: text,
      isPrivate,
      mention: null,
   });
   return toView(record, viewer);
}

// TODO: 백엔드 API가 정해지면 교체한다. (POST /comments/{id}/replies)
// 대댓글을 쓴다. 답글은 항상 그 스레드의 최상위 댓글에 붙는다. (대댓글에 답해도 깊이는 늘지 않고, 멘션으로 누구에게 한 말인지 표시한다.)
// 비공개 댓글 아래의 답글은 서버가 비공개로 등록한다. (화면에서 체크를 고정해도 서버가 다시 정한다.)
// mock 규칙: 내용이 "등록실패"이면 오류가 나고, 그 외에는 약 0.5초 뒤 성공한다.
export async function createReply(
   rootId: string,
   { content, isPrivate, mentionNickname }: CreateReplyPayload,
): Promise<CommentView> {
   await mockDelay(500);

   const viewer = requireViewer();
   const text = validateContent(content);
   const root = findRecord(rootId);
   if (!root || root.parentId !== null) {
      throw new ApiError(COMMENT_ERROR.NOT_FOUND, '댓글을 찾을 수 없어요');
   }
   // 볼 수 없는 비공개 댓글에는 답글을 달 수 없다. (삭제된 댓글의 남은 답글에는 달 수 있다.)
   if (!root.deleted && !canView(root, null, viewer, postAuthorOf(root.postId))) {
      throw new ApiError(COMMENT_ERROR.FORBIDDEN, '답글을 달 수 없는 댓글이에요');
   }
   if (text === '등록실패') {
      throw new ApiError(
         COMMENT_ERROR.CREATE_FAILED,
         '답글을 등록하지 못했어요. 잠시 후 다시 시도해주세요',
      );
   }

   const record = createRecord(root.postId, {
      parentId: root.id,
      author: viewer,
      content: text,
      isPrivate: isPrivate || root.isPrivate,
      mention: mentionNickname?.trim() || null,
   });
   return toView(record, viewer);
}
