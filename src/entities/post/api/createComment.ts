import { apiFetch } from '@/shared/lib/apiClient';
import type { CreateCommentPayload } from '../commentTypes';

// 댓글·대댓글 작성 POST /post/comment/{postId}
// 본문의 parentCommentId가 null이면 댓글, 부모 댓글 id이면 대댓글이다. 성공해도 data는 null이라 만든 댓글의 id는 알 수 없다.
// (화면은 등록 뒤 목록을 다시 받아서 보여 준다. 최신순이라 새 댓글은 1페이지 맨 위에 생긴다.)
// 실패하면 서버 message를 그대로 보여 준다.
// - 400: 내용이 비었거나("댓글을 입력해주세요.") 너무 길 때("댓글은 최대 100글자까지 입력할 수 있어요")
// - 404: 없거나 삭제된 글, 없거나 삭제된 부모 댓글(다른 글의 부모 댓글 포함)
// - 로그인하지 않았거나 작성 권한이 없을 때(사업자만 쓸 수 있다)의 인증·인가 오류
async function postComment(
   postId: string,
   parentCommentId: number | null,
   { content, isPrivate }: CreateCommentPayload,
): Promise<void> {
   await apiFetch<null>(`/post/comment/${encodeURIComponent(postId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentCommentId, content, isPrivate }),
   });
}

export function createComment(postId: string, payload: CreateCommentPayload): Promise<void> {
   return postComment(postId, null, payload);
}

// 대댓글 작성. 대댓글에 답해도 부모는 그 스레드의 최상위 댓글이다. (서버가 대댓글 id를 부모로 받으면 404를 준다.)
export function createReply(
   postId: string,
   rootId: string,
   payload: CreateCommentPayload,
): Promise<void> {
   return postComment(postId, Number(rootId), payload);
}
