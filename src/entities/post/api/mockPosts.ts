import type { PostSummary } from '../types';

// TODO: 백엔드 API가 정해지면 삭제한다. UI 확인용 mock 데이터이다. (12개를 3번 반복해 26개를 만든다.)
const BASE: Omit<PostSummary, 'id' | 'thumbnailUrl'>[] = [
   {
      title: '혼자 운영하는 가게의 메뉴판 정리 팁',
      tags: ['메뉴판', '운영팁'],
      authorNickname: '소소한식탁',
      likeCount: 67,
      commentCount: 12,
      createdAt: '2026-10-10',
   },
   {
      title: '간판 하나로 가게의 인상이 달라졌어요',
      tags: [],
      authorNickname: '플라워룸',
      likeCount: 54,
      commentCount: 9,
      createdAt: '2026-10-08',
   },
   {
      title: '계절의 색을 담은 작은 꽃가게, 오월',
      tags: ['맛집', '분식', '떡볶이', '꽃집', '계절'],
      authorNickname: '오월의정원',
      likeCount: 42,
      commentCount: 8,
      createdAt: '2026-10-12',
   },
   {
      title: '햇살이 머무는 카페 공간을 만들었어요',
      tags: ['카페', '디저트', '브런치'],
      authorNickname: '모닝브루',
      likeCount: 31,
      commentCount: 6,
      createdAt: '2026-10-11',
   },
   {
      title: '빈티지 가구로 완성한 우리의 첫 쇼룸',
      tags: ['인테리어'],
      authorNickname: '취향상점',
      likeCount: 28,
      commentCount: 4,
      createdAt: '2026-10-09',
   },
   {
      title: '테이블 위 작은 변화, 손님들이 먼저 알아봐요',
      tags: ['테이블', '공간', '운영', '손님'],
      authorNickname: '다정한하루',
      likeCount: 24,
      commentCount: 5,
      createdAt: '2026-10-07',
   },
   {
      title: '오픈 첫 달, 단골이 생기는 순간들',
      tags: ['오픈', '단골', '맛집'],
      authorNickname: '골목이자카야',
      likeCount: 1280,
      commentCount: 87,
      createdAt: '2026-10-06',
   },
   {
      title: '포장 용기를 고르는 나만의 기준',
      tags: ['포장', '분식', '운영팁', '맛집'],
      authorNickname: '동네분식집',
      likeCount: 19,
      commentCount: 3,
      createdAt: '2026-10-05',
   },
   {
      title: '사진 한 장으로 달라지는 메뉴 소개',
      tags: ['사진', '메뉴판', '맛집'],
      authorNickname: '브런치랩',
      likeCount: 15,
      commentCount: 2,
      createdAt: '2026-10-04',
   },
   {
      title: '재료 손질 시간을 줄이는 작은 습관',
      tags: ['운영팁', '주방'],
      authorNickname: '소소한식탁',
      likeCount: 12,
      commentCount: 7,
      createdAt: '2026-10-03',
   },
   {
      title: '첫 홈페이지를 만들고 달라진 점',
      tags: ['홈페이지', '뚝딱', '후기'],
      authorNickname: '맛있는분식',
      likeCount: 9,
      commentCount: 1,
      createdAt: '2026-10-02',
   },
   {
      title: '단체 예약 손님을 맞이하는 방법',
      tags: ['예약', '손님', '맛집'],
      authorNickname: '골목이자카야',
      likeCount: 5,
      commentCount: 0,
      createdAt: '2026-10-01',
   },
];

export const MOCK_POSTS: PostSummary[] = Array.from({ length: 26 }, (_, index) => {
   const base = BASE[index % BASE.length];
   const round = Math.floor(index / BASE.length);
   return {
      ...base,
      // 반복된 글은 제목 끝에 번호를 붙이고 날짜를 하루씩 앞으로 당겨 서로 구분한다.
      title: round === 0 ? base.title : `${base.title} (${round + 1})`,
      likeCount: Math.max(0, base.likeCount - round * 3),
      createdAt: shiftDate(base.createdAt, -round * 15),
      id: `post-${index + 1}`,
      thumbnailUrl: null,
   };
});

function shiftDate(isoDate: string, days: number): string {
   const [year, month, day] = isoDate.split('-').map(Number);
   const date = new Date(Date.UTC(year, month - 1, day + days));
   return date.toISOString().slice(0, 10);
}
