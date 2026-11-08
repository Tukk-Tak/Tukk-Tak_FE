import { readMockSession } from '@/entities/user/api/mockSession';
import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { POST_ERROR, type MockMode, type PostDetail } from '../types';
import { isMockDeleted, isMockLiked } from './mockPostState';
import { MOCK_POSTS } from './mockPosts';

// 상세 화면에 보여 줄 본문. 실제로는 서버가 저장한 글 내용이다. (mock은 글마다 같은 모양의 문단을 만든다.)
function makeContent(title: string, authorNickname: string): string {
   return [
      `${authorNickname}의 가게 이야기를 소개해요. "${title}"`,
      '매일 아침 직접 준비한 재료로 정성껏 만들고, 누구나 편하게 머물 수 있는 공간이 되길 바랍니다.',
      '근처에 오실 일이 있다면 따뜻한 한 끼 드시러 놀러 오세요.',
   ].join('\n');
}

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// 보는 사람에 따라 달라지는 값(liked, canDelete)은 서버가 계산해서 내려준다. mock은 로그인 정보(세션)의 닉네임으로 흉내 낸다.
// mock 규칙: 목록의 글 id(post-1 ~ post-26)만 있고, 삭제한 글과 없는 id는 "없는 글" 오류이다.
//            ?mock=notfound 는 없는 글, ?mock=error 는 불러오기 실패, ?mock=slow 는 느린 응답이다.
export async function getPost(id: string, mock?: MockMode): Promise<PostDetail> {
   await mockDelay(mock === 'slow' ? 3000 : 500);

   if (mock === 'error') {
      throw new ApiError(
         POST_ERROR.LOAD_FAILED,
         '게시물을 불러오지 못했어요. 잠시 후 다시 시도해주세요',
      );
   }

   const post = MOCK_POSTS.find((item) => item.id === id);
   if (mock === 'notfound' || !post || isMockDeleted(id)) {
      throw new ApiError(POST_ERROR.NOT_FOUND, '게시물을 찾을 수 없어요');
   }

   const viewer = readMockSession()?.nickname ?? null;
   const liked = viewer !== null && isMockLiked(id);

   return {
      id: post.id,
      title: post.title,
      content: makeContent(post.title, post.authorNickname),
      tags: post.tags,
      authorNickname: post.authorNickname,
      createdAt: post.createdAt,
      likeCount: post.likeCount + (liked ? 1 : 0),
      liked,
      canDelete: viewer !== null && viewer === post.authorNickname,
      thumbnailUrl: post.thumbnailUrl,
   };
}
