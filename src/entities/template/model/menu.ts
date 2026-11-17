import type { Template } from '../types';
import { SAMPLE, sampleItems } from './sampleCopy';

// 깔끔한 메뉴형: 메뉴와 가격이 잘 보이는 구성. 가운데 정렬 헤더, 텍스트 히어로, 메뉴 행, 반폭 목록 2개.
export const MENU_TEMPLATE: Template = {
   id: 'menu',
   name: '깔끔한 메뉴형',
   description: '메뉴와 가격이 잘 보이는 구성',
   content: {
      theme: {
         bg: '#ffffff',
         text: '#1f2937',
         textMuted: '#5b6472',
         border: '#e5e7eb',
         surface: '#f9fafb',
         primary: '#4b6b5c',
         onPrimary: '#ffffff',
         radius: '6px',
      },
      rows: [
         {
            id: 'r1',
            sections: [
               {
                  id: 's1',
                  type: 'header',
                  variant: 'centered',
                  content: { brandName: SAMPLE.brandName },
               },
            ],
         },
         {
            id: 'r2',
            sections: [
               {
                  id: 's2',
                  type: 'hero',
                  variant: 'textOnly',
                  content: {
                     title: SAMPLE.heroTitle,
                     subtitle: SAMPLE.heroSubtitle,
                     badges: [...SAMPLE.heroBadges],
                  },
               },
            ],
         },
         {
            id: 'r3',
            sections: [
               {
                  id: 's3',
                  type: 'list',
                  variant: 'row',
                  content: { title: '메뉴', items: sampleItems(6, true) },
               },
            ],
         },
         {
            id: 'r4',
            sections: [
               {
                  id: 's4',
                  type: 'list',
                  variant: 'compact',
                  content: { title: '음료', items: sampleItems(4, false) },
               },
               {
                  id: 's5',
                  type: 'list',
                  variant: 'compact',
                  content: { title: '디저트', items: sampleItems(4, false) },
               },
            ],
         },
         {
            id: 'r5',
            sections: [
               {
                  id: 's6',
                  type: 'text',
                  variant: 'single',
                  content: {
                     title: '이용 안내',
                     body: '영업시간, 예약, 주차 등 방문 전에 알려 드리고 싶은 내용을 적어 주세요.',
                  },
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
                     brandName: SAMPLE.brandName,
                     address: SAMPLE.address,
                     phone: SAMPLE.phone,
                  },
               },
            ],
         },
      ],
   },
};
