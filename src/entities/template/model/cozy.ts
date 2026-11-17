import type { Template } from '../types';
import { SAMPLE, sampleItems } from './sampleCopy';

// 아늑한 기본형: 따뜻한 톤의 소개 중심 구성. 분할 히어로, 이야기, 대표 메뉴 카드, 정보형 푸터.
export const COZY_TEMPLATE: Template = {
   id: 'cozy',
   name: '아늑한 기본형',
   description: '따뜻한 톤의 소개 중심 구성',
   content: {
      theme: {
         bg: '#fff9f3',
         text: '#352d25',
         textMuted: '#76664f',
         border: '#c3b099',
         surface: '#ffffff',
         primary: '#7e654b',
         onPrimary: '#ffffff',
         radius: '12px',
      },
      rows: [
         {
            id: 'r1',
            sections: [
               {
                  id: 's1',
                  type: 'header',
                  variant: 'horizontal',
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
                  variant: 'split',
                  content: {
                     title: SAMPLE.heroTitle,
                     subtitle: SAMPLE.heroSubtitle,
                     badges: [...SAMPLE.heroBadges],
                     image: { url: '' },
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
                     title: SAMPLE.storyTitle,
                     body: SAMPLE.storyBody,
                     image: { url: '' },
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
                  content: { title: '대표 메뉴', items: sampleItems(4, true) },
               },
            ],
         },
         {
            id: 'r5',
            sections: [
               {
                  id: 's5',
                  type: 'footer',
                  variant: 'info',
                  content: {
                     brandName: SAMPLE.brandName,
                     address: SAMPLE.address,
                     phone: SAMPLE.phone,
                     hours: SAMPLE.hours,
                     social: [{ kind: 'instagram', url: 'https://www.instagram.com/' }],
                     businessInfo: {
                        representative: '대표자 이름',
                        registrationNumber: '000-00-00000',
                     },
                  },
               },
            ],
         },
      ],
   },
};
