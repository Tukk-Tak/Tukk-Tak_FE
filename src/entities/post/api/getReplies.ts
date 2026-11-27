import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import type { CommentView } from '../commentTypes';
import { toCommentView, type CommentData } from './commentMapper';

// 한 스레드(최상위 댓글 하나)의 대댓글 조회 GET /post/comment/{postId}/{parentCommentId}
// 페이지 없이 모두 배열로 온다. 대댓글이 없으면 빈 배열이다. 로그인 여부와 상관없이 볼 수 있고, 토큰이 있으면 그 사용자 기준이다.
// - 없는 글은 404("게시글을 찾을 수 없어요"), 부모 댓글이 없거나 다른 글의 것이거나 대댓글 id를 넣었으면 404("댓글을 찾을 수 없어요")이다.
//   문구는 서버 message를 그대로 보여 준다.
// - 비공개 대댓글을 누가 볼 수 있는지는 서버가 정하고, 가려진 값(null)만 화면이 따른다.
export async function getReplies(postId: string, rootId: string): Promise<CommentView[]> {
   const data = await apiFetch<CommentData[] | null>(
      `/post/comment/${encodeURIComponent(postId)}/${encodeURIComponent(rootId)}`,
   );
   if (!Array.isArray(data)) {
      throw new ApiError('UNKNOWN', '답글을 불러오지 못했어요. 잠시 후 다시 시도해주세요');
   }
   return data.map((item) => toCommentView(item, { postId, parentId: rootId }));
}
