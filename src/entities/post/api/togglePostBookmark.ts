import { ApiError, apiFetch } from '@/shared/lib/apiClient';

// 북마크 누르기/취소하기 POST /post/bookmark/{postId}
// 좋아요와 같은 토글이다. 한 번 누르면 북마크, 한 번 더 누르면 취소이고, 결과만 돌려받는다.
// 돌려주는 값: 처리 뒤에 북마크가 되어 있는지(true: 방금 북마크했다, false: 방금 취소했다).
// 글이 없거나 삭제됐으면 404이고, 문구는 서버 message를 그대로 보여 준다.
export async function togglePostBookmark(id: string): Promise<boolean> {
   const bookmarked = await apiFetch<boolean | null>(`/post/bookmark/${encodeURIComponent(id)}`, {
      method: 'POST',
   });
   if (typeof bookmarked !== 'boolean') {
      throw new ApiError('UNKNOWN', '북마크를 반영하지 못했어요. 잠시 후 다시 시도해주세요');
   }
   return bookmarked;
}
