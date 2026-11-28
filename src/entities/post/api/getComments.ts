import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import { COMMENT_PAGE_SIZE, type CommentPage } from '../commentTypes';
import { toCommentView, type CommentData } from './commentMapper';

interface CommentPageData {
   comments?: CommentData[];
   page?: number;
   size?: number;
   totalElements?: number;
   totalPages?: number;
}

// 게시물의 댓글(최상위) 한 페이지 조회 GET /post/detail/comment/{postId}?page=&size=
// 로그인 여부와 상관없이 볼 수 있고, 로그인했다면 토큰이 함께 가서(apiFetch가 붙인다) isMine·비공개 열람 여부가 그 사용자 기준이다.
// - 최신순이고, page(1부터)·size(1~30)가 범위를 벗어나면 400이다. size는 화면이 정한 값을 항상 보낸다.
// - 삭제된 댓글과 볼 권한이 없는 비공개 댓글은 닉네임·내용이 null로 가려져 온다.
// - 삭제된 댓글은 남은 대댓글이 하나라도 있을 때만 목록에 오고, 모두 지워졌으면 목록에서 빠진다.
// - 없거나 삭제된 글은 404("게시글을 찾을 수 없어요")이고, 문구는 서버 message를 그대로 보여 준다.
// 서버는 범위를 넘은 page를 마지막 페이지로 맞춰 주지 않고 빈 목록을 돌려준다. 그 처리는 호출하는 화면이 한다.
export async function getComments(
   postId: string,
   { page }: { page: number },
): Promise<CommentPage> {
   const search = new URLSearchParams({ page: String(page), size: String(COMMENT_PAGE_SIZE) });
   const data = await apiFetch<CommentPageData | null>(
      `/post/detail/comment/${encodeURIComponent(postId)}?${search.toString()}`,
   );
   if (!data || !Array.isArray(data.comments)) {
      throw new ApiError('UNKNOWN', '댓글을 불러오지 못했어요. 잠시 후 다시 시도해주세요');
   }

   return {
      comments: data.comments.map((item) => toCommentView(item, { postId, parentId: null })),
      totalCount: data.totalElements ?? 0,
      page: data.page ?? page,
      totalPages: data.totalPages ?? 0,
   };
}
