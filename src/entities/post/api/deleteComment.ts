import { apiFetch } from '@/shared/lib/apiClient';

// 댓글·대댓글 삭제 DELETE /post/comment/{commentId}
// 소프트 딜리트라서 삭제한 뒤에는 "삭제된 댓글입니다."로 남고(아래 대댓글이 있으면), 없으면 목록에서 빠진다.
// 댓글 작성자와 관리자만 지울 수 있고 게시물 작성자는 지울 수 없다. 실패하면 서버 message를 그대로 보여 준다.
// - 403: 삭제 권한이 없음 / 404: 없거나 이미 삭제된 댓글
export async function deleteComment(id: string): Promise<void> {
   await apiFetch<null>(`/post/comment/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
