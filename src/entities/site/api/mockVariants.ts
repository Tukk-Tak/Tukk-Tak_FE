import type { ListItem } from '@/entities/block';
import type { Row, SiteContent } from '../types';
import { MOCK_IMAGE_URL } from './mockImage';

const IMAGE = { url: MOCK_IMAGE_URL };

// 목록 샘플 항목. 세 번째 항목은 이미지가 없어서, 이미지가 비었을 때의 모습을 함께 볼 수 있다.
// variant마다 앞에서부터 필요한 개수만큼 잘라 쓴다. (카드 4, 행 5, 교차 3, 컴팩트는 전체)
const MENU_ITEMS: ListItem[] = [
   { id: 'i1', name: '아메리카노', description: '고소한 블렌드', price: '4,000원', image: IMAGE },
   { id: 'i2', name: '카페라떼', description: '부드러운 우유', price: '4,500원', image: IMAGE },
   { id: 'i3', name: '시즌 한정 딸기 라떼', description: '이미지 없는 항목', price: '시가' },
   { id: 'i4', name: '에스프레소', description: '진한 풍미', price: '3,500원', image: IMAGE },
   {
      id: 'i5',
      name: '유자 에이드',
      description: '상큼한 제철 유자',
      price: '5,500원',
      image: IMAGE,
   },
   { id: 'i6', name: '바닐라 라떼', price: '5,000원' },
   { id: 'i7', name: '콜드브루', price: '4,800원' },
   { id: 'i8', name: '크루아상', price: '3,800원' },
];
const BODY =
   '2019년 문을 연 이후 매일 아침 원두를 직접 볶고 있어요.\n좋은 재료가 좋은 맛을 만든다는 마음으로 준비합니다.';

// 푸터의 모든 필드를 채운 샘플. 정보형에서만 보이는 email, businessInfo도 포함한다.
const FOOTER_CONTENT = {
   address: '서울시 마포구 동교로 12길 8',
   phone: '02-123-4567',
   hours: '매일 10:00 - 21:00',
   social: [
      { kind: 'instagram', url: 'https://instagram.com/cafe_orot' },
      { kind: 'blog', url: 'https://blog.naver.com/cafe_orot' },
   ],
   email: 'hello@cafe-orot.kr',
   businessInfo: { representative: '김오롯', registrationNumber: '123-45-67890' },
};

// 구현된 블록의 variant를 한 줄씩 모아 보는 목업 (?mock=variants).
// 블록을 만들 때마다 그 블록의 줄을 아래 두 목록에 추가한다.
// - 전체 폭: 그 블록의 모든 variant를 한 줄씩 둔다.
// - 반폭: 반폭이 가능한 variant마다 같은 variant 두 개를 나란히 둔 줄을 둔다. (전체 폭 전용 variant는 두지 않는다)
// 제목이나 상호명에 variant 이름을 적어 두어, 화면에서 어떤 줄인지 알아볼 수 있게 한다.

const FULL_WIDTH_ROWS: Row[] = [
   // 헤더
   {
      id: 'full-header-horizontal',
      sections: [
         {
            id: 'full-header-horizontal-1',
            type: 'header',
            variant: 'horizontal',
            content: { brandName: '가로형 (header / horizontal)' },
         },
      ],
   },
   {
      id: 'full-header-centered',
      sections: [
         {
            id: 'full-header-centered-1',
            type: 'header',
            variant: 'centered',
            content: { brandName: '중앙형 (header / centered)' },
         },
      ],
   },

   // 줄글
   {
      id: 'full-text-single',
      sections: [
         {
            id: 'full-text-single-1',
            type: 'text',
            variant: 'single',
            content: { title: '단일 컬럼형 (text / single)', body: BODY },
         },
      ],
   },
   {
      id: 'full-text-with-image',
      sections: [
         {
            id: 'full-text-with-image-1',
            type: 'text',
            variant: 'withImage',
            content: { title: '이미지 병행형 (text / withImage)', body: BODY, image: IMAGE },
         },
      ],
   },

   // 목록
   {
      id: 'full-list-card',
      sections: [
         {
            id: 'full-list-card-1',
            type: 'list',
            variant: 'card',
            content: { title: '카드 그리드형 (list / card)', items: MENU_ITEMS.slice(0, 4) },
         },
      ],
   },
   {
      id: 'full-list-row',
      sections: [
         {
            id: 'full-list-row-1',
            type: 'list',
            variant: 'row',
            content: { title: '리스트 행형 (list / row)', items: MENU_ITEMS.slice(0, 5) },
         },
      ],
   },
   {
      id: 'full-list-compact',
      sections: [
         {
            id: 'full-list-compact-1',
            type: 'list',
            variant: 'compact',
            content: { title: '컴팩트 타일형 (list / compact)', items: MENU_ITEMS },
         },
      ],
   },
   {
      id: 'full-list-zigzag',
      sections: [
         {
            id: 'full-list-zigzag-1',
            type: 'list',
            variant: 'zigzag',
            content: { title: '좌우 교차형 (list / zigzag)', items: MENU_ITEMS.slice(0, 3) },
         },
      ],
   },

   // 푸터 (두 variant 모두 전체 폭 전용이라 반폭 줄은 없다)
   {
      id: 'full-footer-simple',
      sections: [
         {
            id: 'full-footer-simple-1',
            type: 'footer',
            variant: 'simple',
            content: { ...FOOTER_CONTENT, brandName: '심플형 (footer / simple)' },
         },
      ],
   },
   {
      id: 'full-footer-info',
      sections: [
         {
            id: 'full-footer-info-1',
            type: 'footer',
            variant: 'info',
            content: { ...FOOTER_CONTENT, brandName: '정보형 (footer / info)' },
         },
      ],
   },
];

const HALF_WIDTH_ROWS: Row[] = [
   // 줄글: 단일 컬럼형만 반폭 가능
   {
      id: 'half-text-single',
      sections: [
         {
            id: 'half-text-single-1',
            type: 'text',
            variant: 'single',
            content: { title: '단일 컬럼형 · 반폭', body: BODY },
         },
         {
            id: 'half-text-single-2',
            type: 'text',
            variant: 'single',
            content: { title: '단일 컬럼형 · 반폭', body: BODY },
         },
      ],
   },

   // 목록: 카드, 행, 컴팩트는 반폭 가능, 좌우 교차형은 불가
   {
      id: 'half-list-card',
      sections: [
         {
            id: 'half-list-card-1',
            type: 'list',
            variant: 'card',
            content: { title: '카드 그리드형 · 반폭', items: MENU_ITEMS.slice(0, 4) },
         },
         {
            id: 'half-list-card-2',
            type: 'list',
            variant: 'card',
            content: { title: '카드 그리드형 · 반폭', items: MENU_ITEMS.slice(0, 4) },
         },
      ],
   },
   {
      id: 'half-list-row',
      sections: [
         {
            id: 'half-list-row-1',
            type: 'list',
            variant: 'row',
            content: { title: '리스트 행형 · 반폭', items: MENU_ITEMS.slice(0, 5) },
         },
         {
            id: 'half-list-row-2',
            type: 'list',
            variant: 'row',
            content: { title: '리스트 행형 · 반폭', items: MENU_ITEMS.slice(0, 5) },
         },
      ],
   },
   {
      id: 'half-list-compact',
      sections: [
         {
            id: 'half-list-compact-1',
            type: 'list',
            variant: 'compact',
            content: { title: '컴팩트 타일형 · 반폭', items: MENU_ITEMS },
         },
         {
            id: 'half-list-compact-2',
            type: 'list',
            variant: 'compact',
            content: { title: '컴팩트 타일형 · 반폭', items: MENU_ITEMS },
         },
      ],
   },
];

export const MOCK_VARIANTS_SITE: SiteContent = {
   theme: {},
   rows: [...FULL_WIDTH_ROWS, ...HALF_WIDTH_ROWS],
};
