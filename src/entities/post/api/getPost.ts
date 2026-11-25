import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import type { PostDetail } from '../types';

// 서버 응답(data) 중 화면이 쓰는 것. 글 id는 숫자로 온다.
interface PostDetailData {
   id: number | string;
   title: string;
   imageUrl?: string | null;
   nickname: string;
   content: string;
   tags?: string[];
   createdAt: string;
   likeCount?: number;
   commentCount?: number;
   liked?: boolean;
   bookmarked?: boolean;
}

function toPostDetail(data: PostDetailData | null | undefined): PostDetail {
   if (
      !data ||
      typeof data.title !== 'string' ||
      typeof data.content !== 'string' ||
      typeof data.nickname !== 'string'
   ) {
      throw new ApiError('UNKNOWN', '게시물을 불러오지 못했어요. 잠시 후 다시 시도해주세요');
   }

   return {
      id: String(data.id),
      title: data.title,
      content: data.content,
      tags: Array.isArray(data.tags) ? data.tags : [],
      authorNickname: data.nickname,
      // 서버는 "2026-10-24T09:30:00"처럼 시각까지 주는데, 화면은 날짜(YYYY-MM-DD)만 읽는다.
      createdAt: typeof data.createdAt === 'string' ? data.createdAt.slice(0, 10) : '',
      likeCount: data.likeCount ?? 0,
      commentCount: data.commentCount ?? 0,
      liked: data.liked === true,
      bookmarked: data.bookmarked === true,
      thumbnailUrl: data.imageUrl || null,
   };
}

// 게시물 상세 조회 GET /post/detail/{postId}
// 로그인했다면 토큰이 함께 가서(apiFetch가 붙인다) liked·bookmarked를 그 사용자 기준으로 돌려주고, 로그인하지 않았으면 둘 다 false다.
// 이 화면은 로그인하지 않아도 볼 수 있어서 인증 오류는 나지 않는다. 없거나 삭제된(소프트 딜리트) 글은 404이다.
export async function getPost(id: string): Promise<PostDetail> {
   const data = await apiFetch<PostDetailData | null>(`/post/detail/${encodeURIComponent(id)}`);
   return toPostDetail(data);
}
