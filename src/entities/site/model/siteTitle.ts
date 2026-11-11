import type { HeaderSection } from '@/entities/block';
import type { SiteContent } from '../types';

const UNTITLED_SITE = '이름 없는 사이트';

// 에디터 위쪽의 "내 사이트 › 이름"에 보이는 사이트 이름. 헤더 블록의 상호명을 쓰고,
// 헤더가 없거나 상호명이 비어 있으면 대체 문구를 쓴다.
export function getSiteTitle(site: SiteContent): string {
   const header = site.rows
      .flatMap((row) => row.sections)
      .find((section): section is HeaderSection => section.type === 'header');
   return header?.content.brandName.trim() || UNTITLED_SITE;
}
