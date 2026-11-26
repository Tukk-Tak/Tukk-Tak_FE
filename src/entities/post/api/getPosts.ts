import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import type { GetPostsParams, PostPage, PostSort, PostSummary } from '../types';

// 서버 응답(data) 중 화면이 쓰는 것. 글 id는 숫자로 온다.
interface PostSummaryData {
   id: number | string;
   title: string;
   imageUrl?: string | null;
   nickname: string;
   tags?: string[];
   likeCount?: number;
   commentCount?: number;
   liked?: boolean;
   bookmarked?: boolean;
}

interface PostPageData {
   posts?: PostSummaryData[];
   page?: number;
   size?: number;
   totalElements?: number;
   totalPages?: number;
}

// 서버는 정렬을 대문자(LATEST, POPULAR)로만 받는다. 소문자를 보내면 400이다.
const SORT_PARAM: Record<PostSort, string> = { popular: 'POPULAR', latest: 'LATEST' };

function toPostSummary(data: PostSummaryData): PostSummary {
   return {
      id: String(data.id),
      title: data.title,
      tags: Array.isArray(data.tags) ? data.tags : [],
      authorNickname: data.nickname,
      likeCount: data.likeCount ?? 0,
      commentCount: data.commentCount ?? 0,
      liked: data.liked === true,
      bookmarked: data.bookmarked === true,
      thumbnailUrl: data.imageUrl || null,
   };
}

// 커뮤니티 글 목록 조회(검색 포함) GET /post
// 로그인 여부와 상관없이 볼 수 있다. 로그인했다면 토큰이 함께 가서(apiFetch가 붙인다) liked·bookmarked가 그 사용자 기준이고, 아니면 둘 다 false다.
// - sort: 서버는 sort가 없으면 로그인한 사람은 최신순, 아닌 사람은 인기순으로 정한다. 화면은 늘 같은 기본(인기순)을 보여 주려고 항상 직접 보낸다.
// - keyword: 비었거나 공백뿐이면 전체 조회, '#'으로 시작하면 태그에서만, 그 밖에는 닉네임·제목·태그에서 부분 일치로 찾는다.
//   '#'은 URL에서 뒷부분을 잘라 버리므로 URLSearchParams로 인코딩해서 보낸다.
// - page(1부터)·size(1~30)가 범위를 벗어나거나 숫자가 아니면 400이고, 문구는 서버 message를 그대로 보여 준다.
// 서버는 범위를 넘은 page를 마지막 페이지로 맞춰 주지 않고 빈 목록을 돌려준다. 그 처리는 호출하는 화면이 한다.
export async function getPosts(params: GetPostsParams): Promise<PostPage> {
   const search = new URLSearchParams();
   if (params.keyword) search.set('keyword', params.keyword);
   search.set('sort', SORT_PARAM[params.sort]);
   search.set('page', String(params.page));
   search.set('size', String(params.pageSize));

   const data = await apiFetch<PostPageData | null>(`/post?${search.toString()}`);
   if (!data || !Array.isArray(data.posts)) {
      throw new ApiError('UNKNOWN', '글 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요');
   }

   return {
      posts: data.posts.map(toPostSummary),
      totalCount: data.totalElements ?? 0,
      page: data.page ?? params.page,
      totalPages: data.totalPages ?? 0,
   };
}
