import { readMockSession } from '@/entities/user/api/mockSession';
import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { POST_ERROR } from '../types';
import { isMockDeleted, markMockDeleted } from './mockPostState';
import { MOCK_POSTS } from './mockPosts';

// TODO: 백엔드 API가 정해지면 교체한다. 지금은 UI 확인용 mock이다.
// 실제로는 서버가 작성자(또는 관리자)인지 다시 확인하고, 글과 댓글·좋아요를 함께 지운다. 삭제 버튼을 보여 주는 것(canDelete)과 별개이다.
// mock 규칙: 작성자가 아니면 오류이고, 그 외에는 약 0.6초 뒤 삭제된다. (삭제한 글은 목록과 상세에서 사라진다.)
export async function deletePost(id: string): Promise<void> {
   await mockDelay(600);

   const post = MOCK_POSTS.find((item) => item.id === id);
   if (!post || isMockDeleted(id)) {
      throw new ApiError(POST_ERROR.NOT_FOUND, '게시물을 찾을 수 없어요');
   }
   if (readMockSession()?.nickname !== post.authorNickname) {
      throw new ApiError(POST_ERROR.FORBIDDEN, '삭제할 수 없는 게시물이에요');
   }

   markMockDeleted(id);
}
