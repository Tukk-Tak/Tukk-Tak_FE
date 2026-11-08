import type { SiteContent } from '../types';

// 에디터 화면 확인용 목업 사이트. API 연동 때 getSite를 실제 호출로 바꾸면서 함께 없앤다.
export const MOCK_SITE: SiteContent = {
   theme: {},
   rows: [
      {
         id: 'r1',
         sections: [
            {
               id: 's1',
               type: 'header',
               variant: 'horizontal',
               content: { brandName: '카페 오롯' },
            },
         ],
      },
      {
         id: 'r2',
         sections: [
            {
               id: 's2',
               type: 'hero',
               variant: 'split',
               content: {
                  title: '골목 끝에서 만나는 작은 로스터리',
                  subtitle: '매일 아침 원두를 직접 볶아요',
                  badges: ['주차 가능', '반려동물 동반'],
               },
            },
         ],
      },
      {
         id: 'r3',
         sections: [
            {
               id: 's3',
               type: 'text',
               variant: 'withImage',
               content: {
                  title: '우리 가게 이야기',
                  body: '2019년 문을 연 이후 매일 아침 원두를 직접 볶고 있어요.',
               },
            },
         ],
      },
      {
         id: 'r4',
         sections: [
            {
               id: 's4',
               type: 'list',
               variant: 'card',
               content: {
                  title: '대표 메뉴',
                  items: [
                     {
                        id: 'i1',
                        name: '아메리카노',
                        price: '4,000원',
                        description: '고소한 블렌드',
                     },
                     { id: 'i2', name: '카페라떼', price: '4,500원', description: '부드러운 우유' },
                     { id: 'i3', name: '에스프레소', price: '3,500원', description: '진한 풍미' },
                  ],
               },
            },
         ],
      },
      {
         id: 'r5',
         sections: [
            {
               id: 's5',
               type: 'text',
               variant: 'single',
               content: { body: '오늘도 갓 볶은 원두로 시작해요' },
            },
            {
               id: 's6',
               type: 'gallery',
               variant: 'featured',
               content: { images: [] },
            },
         ],
      },
      {
         id: 'r6',
         sections: [
            {
               id: 's7',
               type: 'footer',
               variant: 'simple',
               content: {
                  brandName: '카페 오롯',
                  address: '서울시 마포구 동교로 12길 8',
                  phone: '02-123-4567',
               },
            },
         ],
      },
   ],
};
