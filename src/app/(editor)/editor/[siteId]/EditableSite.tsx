'use client';

import { useEditorSite } from '@/features/editor-site';
import { SiteRenderer } from '@/widgets/site-renderer';

// 에디터 캔버스에 들어가는 사이트. 편집 중인 내용(저장소)을 그대로 그린다.
// widget끼리는 서로 가져다 쓸 수 없고 feature는 widget을 쓸 수 없어서, 둘을 이어 주는 이 작은 조립만 app에 둔다.
export function EditableSite() {
   const site = useEditorSite((state) => state.site);
   return <SiteRenderer site={site} editable />;
}
