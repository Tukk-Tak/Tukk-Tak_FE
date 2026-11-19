'use client';

import type { Section } from '@/entities/block';
import { EditorSection } from './EditorSection';
import { VariantPicker } from './VariantPicker';

// 모든 블록 편집 화면의 맨 위 "구조" 섹션. 제목 바로 옆에 구조를 바꿀 때의 안내를 두고, 아래에 구조를 고르는 카드를 둔다.
export function StructureSection({ section }: { section: Section }) {
   return (
      <EditorSection title="구조" note="· 구조를 바꿔도 입력한 내용은 그대로 남아요.">
         <VariantPicker section={section} />
      </EditorSection>
   );
}
