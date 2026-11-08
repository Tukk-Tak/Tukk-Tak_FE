import type { Row, SiteContent } from '../types';
import { MOCK_IMAGE_URL } from './mockImage';

const IMAGE = { url: MOCK_IMAGE_URL };
const BODY =
   '2019년 문을 연 이후 매일 아침 원두를 직접 볶고 있어요.\n좋은 재료가 좋은 맛을 만든다는 마음으로 준비합니다.';

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
];

export const MOCK_VARIANTS_SITE: SiteContent = {
   theme: {},
   rows: [...FULL_WIDTH_ROWS, ...HALF_WIDTH_ROWS],
};
