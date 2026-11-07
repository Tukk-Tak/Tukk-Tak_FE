export const POST_SORTS = ['popular', 'latest'] as const;
export type PostSort = (typeof POST_SORTS)[number];

export interface PostSummary {
   id: string;
   title: string;
   // 태그 이름은 '#' 없이 보관한다. (화면에서 붙여 보여 준다.)
   tags: string[];
   authorNickname: string;
   likeCount: number;
   commentCount: number;
   // 작성일(YYYY-MM-DD)
   createdAt: string;
   // 대표 이미지. 없으면 색 블록과 아이콘으로 대신한다.
   thumbnailUrl: string | null;
}

// 목록 조회 조건. text(제목·닉네임·태그 부분 일치)와 tag(태그 정확 일치)는 함께 쓰지 않는다.
export interface GetPostsParams {
   text?: string;
   tag?: string;
   sort: PostSort;
   page: number;
   pageSize: number;
   // TODO: mock 동작 확인용 스위치이다. 백엔드 연동 때 삭제한다. (개발 환경에서만 주소의 ?mock= 로 켠다.)
   mock?: MockMode;
}

export type MockMode = 'empty' | 'error' | 'slow';

export interface PostPage {
   posts: PostSummary[];
   totalCount: number;
   // 실제로 돌려준 페이지. 요청한 페이지가 범위를 넘으면 마지막 페이지로 맞춘다.
   page: number;
   totalPages: number;
}

// 카드·목록 행이 일치한 태그를 강조하는 데 쓴다. exact가 true면 태그 정확 일치(태그 검색), false면 부분 일치(글자 검색)이다.
export interface TagHighlight {
   value: string;
   exact: boolean;
}

// 에러코드가 정해지면 이 값을 맞춘다.
export const POST_ERROR = {
   LOAD_FAILED: 'POST_LOAD_FAILED',
} as const;
