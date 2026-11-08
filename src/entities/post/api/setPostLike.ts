import { readMockSession } from '@/entities/user/api/mockSession';
import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { POST_ERROR } from '../types';
import { isMockDeleted, setMockLiked } from './mockPostState';
import { MOCK_POSTS } from './mockPosts';

// TODO: 백엔드 API가 정해지면 교체한다. 지금은 UI 확인용 mock이다.
// 좋아요를 누르거나 취소한다. 실제로는 서버가 사용자별로 한 번만 세고, 결과(눌렀는지, 개수)를 돌려준다.
// mock 규칙: 로그인하지 않았으면 오류이고, 그 외에는 약 0.4초 뒤 성공한다.
export async function setPostLike(
   id: string,
   liked: boolean,
): Promise<{ liked: boolean; likeCount: number }> {
   await mockDelay(400);

   const post = MOCK_POSTS.find((item) => item.id === id);
   if (!post || isMockDeleted(id)) {
      throw new ApiError(POST_ERROR.NOT_FOUND, '게시물을 찾을 수 없어요');
   }
   if (!readMockSession()) {
      throw new ApiError(POST_ERROR.FORBIDDEN, '로그인이 필요해요');
   }

   setMockLiked(id, liked);
   return { liked, likeCount: post.likeCount + (liked ? 1 : 0) };
}
