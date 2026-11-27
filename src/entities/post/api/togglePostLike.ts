import { ApiError, apiFetch } from '@/shared/lib/apiClient';

// 좋아요 누르기/취소하기 POST /post/like/{postId}
// 서버가 토글로 처리한다. 한 번 누르면 좋아요, 한 번 더 누르면 취소다. 그래서 "원하는 상태"를 보낼 수 없고, 결과만 돌려받는다.
// 돌려주는 값: 처리 뒤에 좋아요가 눌려 있는지(true: 방금 눌렀다, false: 방금 취소했다). 좋아요 개수는 오지 않는다.
// 글이 없거나 삭제됐으면 404, 같은 요청이 동시에 겹치면 409이고, 문구는 서버 message를 그대로 보여 준다.
export async function togglePostLike(id: string): Promise<boolean> {
   const liked = await apiFetch<boolean | null>(`/post/like/${encodeURIComponent(id)}`, {
      method: 'POST',
   });
   if (typeof liked !== 'boolean') {
      throw new ApiError('UNKNOWN', '좋아요를 반영하지 못했어요. 잠시 후 다시 시도해주세요');
   }
   return liked;
}
