import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { POST_ERROR, type GetPostsParams, type PostPage, type PostSummary } from '../types';
import { isMockDeleted, isMockLiked } from './mockPostState';
import { MOCK_POSTS } from './mockPosts';

// 검색어 비교용으로 정규화한다. (한글 조합 방식 통일 + 대소문자 무시)
function normalize(value: string): string {
   return value.normalize('NFC').trim().toLowerCase();
}

function matches(post: PostSummary, { text, tag }: Pick<GetPostsParams, 'text' | 'tag'>): boolean {
   if (tag) {
      const wanted = normalize(tag);
      return post.tags.some((item) => normalize(item) === wanted);
   }
   if (text) {
      const wanted = normalize(text);
      return (
         normalize(post.title).includes(wanted) ||
         normalize(post.authorNickname).includes(wanted) ||
         post.tags.some((item) => normalize(item).includes(wanted))
      );
   }
   return true;
}

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// 검색·정렬·페이지 나누기는 실제로는 서버가 처리한다. (인기순의 기준도 서버가 정한다. mock은 좋아요 수이다.)
// mock 규칙: ?mock=empty 는 글이 하나도 없는 상태, ?mock=error 는 불러오기 실패, ?mock=slow 는 느린 응답이다.
export async function getPosts(params: GetPostsParams): Promise<PostPage> {
   await mockDelay(params.mock === 'slow' ? 3000 : 500);

   if (params.mock === 'error') {
      throw new ApiError(
         POST_ERROR.LOAD_FAILED,
         '글 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요',
      );
   }

   // 삭제한 글은 빼고, 좋아요를 누른 글은 개수에 반영한다. (실제로는 서버가 이미 반영해서 내려준다.)
   const all = (params.mock === 'empty' ? [] : MOCK_POSTS)
      .filter((post) => !isMockDeleted(post.id))
      .map((post) => (isMockLiked(post.id) ? { ...post, likeCount: post.likeCount + 1 } : post));
   const found = all.filter((post) => matches(post, params));

   found.sort((a, b) => {
      if (params.sort === 'popular' && b.likeCount !== a.likeCount)
         return b.likeCount - a.likeCount;
      // 인기순에서 좋아요 수가 같거나 최신순이면 최근 글이 먼저이다.
      if (b.createdAt !== a.createdAt) return b.createdAt < a.createdAt ? -1 : 1;
      return a.id < b.id ? -1 : 1;
   });

   const totalCount = found.length;
   const totalPages = Math.max(1, Math.ceil(totalCount / params.pageSize));
   const page = Math.min(Math.max(1, params.page), totalPages);
   const start = (page - 1) * params.pageSize;

   return { posts: found.slice(start, start + params.pageSize), totalCount, page, totalPages };
}
