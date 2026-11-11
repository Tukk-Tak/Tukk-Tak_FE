import type { SiteContent } from '../types';
import { MOCK_SITE } from './mockSite';
import { MOCK_VARIANTS_SITE } from './mockVariants';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이고 siteId와 관계없이 같은 사이트를 돌려준다.
// mock 규칙: ?mock=empty 는 블록이 하나도 없는 사이트, ?mock=variants 는 구현된 블록의 variant를 한 줄씩 모아 보는 사이트이다.
export async function getSite(siteId: string, mock?: string): Promise<SiteContent> {
   void siteId;
   if (mock === 'empty') return { theme: {}, rows: [] };
   if (mock === 'variants') return MOCK_VARIANTS_SITE;
   return MOCK_SITE;
}
