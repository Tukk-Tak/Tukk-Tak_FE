import type { Template } from '../types';
import { SAMPLE, sampleImages, sampleItems } from './sampleCopy';

// 감각적인 포토형: 사진으로 분위기를 전하는 구성. 어두운 테마, 전면 사진 히어로, 대표 사진 갤러리, 지그재그 목록.
export const PHOTO_TEMPLATE: Template = {
   id: 'photo',
   name: '감각적인 포토형',
   description: '사진으로 분위기를 전하는 구성',
   content: {
      theme: {
         bg: '#1e1e1e',
         text: '#ededed',
         textMuted: '#a6a6a6',
         border: '#3a3a3a',
         surface: '#2a2a2a',
         primary: '#f2f2f2',
         onPrimary: '#1e1e1e',
         radius: '8px',
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
                  variant: 'fullImage',
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
                  type: 'gallery',
                  variant: 'featured',
                  content: { images: sampleImages(5) },
               },
            ],
         },
         {
            id: 'r4',
            sections: [
               {
                  id: 's4',
                  type: 'text',
                  variant: 'single',
                  content: { title: SAMPLE.storyTitle, body: SAMPLE.storyBody },
               },
            ],
         },
         {
            id: 'r5',
            sections: [
               {
                  id: 's5',
                  type: 'list',
                  variant: 'zigzag',
                  content: { title: '시그니처', items: sampleItems(3, true) },
               },
            ],
         },
         {
            id: 'r6',
            sections: [
               {
                  id: 's6',
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
