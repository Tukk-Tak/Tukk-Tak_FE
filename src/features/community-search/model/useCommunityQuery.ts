import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { POST_SORTS, type MockMode, type PostSort } from '@/entities/post';
import { normalizeQueryInput, parseQuery, type ParsedQuery } from './parseQuery';

export const COMMUNITY_VIEWS = ['card', 'list'] as const;
export type CommunityView = (typeof COMMUNITY_VIEWS)[number];

const DEFAULT_SORT: PostSort = 'popular';
const DEFAULT_VIEW: CommunityView = 'card';
const MOCK_MODES: MockMode[] = ['empty', 'error', 'slow'];

interface QueryState {
   q: string;
   sort: PostSort;
   view: CommunityView;
   page: number;
}

function pick<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
   return allowed.includes(value as T) ? (value as T) : fallback;
}

function parsePage(value: string | null): number {
   const page = Number(value);
   return Number.isInteger(page) && page >= 1 ? page : 1;
}

// 목록 화면의 조건(검색어·정렬·보기 방식·페이지)을 주소의 쿼리로 보관한다.
// 그래서 뒤로 가기, 새로고침, 링크 공유가 모두 같은 화면을 보여 준다. 기본값은 주소에 적지 않는다.
// 예) /community?q=맛집&sort=latest&view=list&page=2
export function useCommunityQuery() {
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const state: QueryState = {
      q: normalizeQueryInput(searchParams.get('q') ?? ''),
      sort: pick(searchParams.get('sort'), POST_SORTS, DEFAULT_SORT),
      view: pick(searchParams.get('view'), COMMUNITY_VIEWS, DEFAULT_VIEW),
      page: parsePage(searchParams.get('page')),
   };
   // TODO: mock 동작 확인용 스위치이다. 백엔드 연동 때 삭제한다. (운영 빌드에서는 무시한다.)
   const mock =
      process.env.NODE_ENV === 'production'
         ? undefined
         : MOCK_MODES.find((mode) => mode === searchParams.get('mock'));

   const { q, sort, view, page } = state;

   const navigate = useCallback(
      (patch: Partial<QueryState>, mode: 'push' | 'replace') => {
         const next = { q, sort, view, page, ...patch };
         const params = new URLSearchParams();
         if (next.q) params.set('q', next.q);
         if (next.sort !== DEFAULT_SORT) params.set('sort', next.sort);
         if (next.view !== DEFAULT_VIEW) params.set('view', next.view);
         if (next.page > 1) params.set('page', String(next.page));
         if (mock) params.set('mock', mock);

         const query = params.toString();
         // 목록 스크롤은 페이지가 아니라 main 안에서 일어나므로 Next의 자동 스크롤은 쓰지 않는다.
         router[mode](query ? `${pathname}?${query}` : pathname, { scroll: false });
      },
      [q, sort, view, page, mock, pathname, router],
   );

   // 검색어나 정렬이 바뀌면 결과가 달라지므로 1페이지로 돌아간다.
   const search = useCallback(
      (input: string) => navigate({ q: normalizeQueryInput(input), page: 1 }, 'push'),
      [navigate],
   );
   const changeSort = useCallback(
      (next: PostSort) => navigate({ sort: next, page: 1 }, 'push'),
      [navigate],
   );
   // 보기 방식은 조건이 아니라 취향이라 기록을 쌓지 않는다. (뒤로 가기가 보기 전환을 되돌리지 않게)
   const changeView = useCallback(
      (next: CommunityView) => navigate({ view: next }, 'replace'),
      [navigate],
   );
   const goToPage = useCallback((next: number) => navigate({ page: next }, 'push'), [navigate]);
   // 요청한 페이지가 범위를 넘어 서버가 마지막 페이지로 맞춰 줬을 때, 주소도 맞춘다.
   const syncPage = useCallback((next: number) => navigate({ page: next }, 'replace'), [navigate]);
   const reset = useCallback(() => navigate({ q: '', page: 1 }, 'push'), [navigate]);

   const parsed: ParsedQuery = parseQuery(q);

   return { ...state, parsed, mock, search, changeSort, changeView, goToPage, syncPage, reset };
}
