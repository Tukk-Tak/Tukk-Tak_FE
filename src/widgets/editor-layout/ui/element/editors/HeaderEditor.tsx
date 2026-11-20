'use client';

import { BLOCK_LIMITS, type HeaderSection } from '@/entities/block';
import { useEditorSite } from '@/features/editor-site';
import { EditorSection } from '../EditorSection';
import { TextField } from '../fields';
import { ImageField } from '../ImageField';
import { StructureSection } from '../StructureSection';

// 헤더 편집: 구조, 상호명(필수), 로고 이미지(+크기).
export function HeaderEditor({ section }: { section: HeaderSection }) {
   const updateContent = useEditorSite((state) => state.updateContent);
   const { brandName, logo } = section.content;

   return (
      <>
         <StructureSection section={section} />
         <EditorSection title="내용">
            <TextField
               id={`${section.id}-brandName`}
               label="상호명"
               required
               value={brandName}
               maxLength={BLOCK_LIMITS.headerBrandName}
               onChange={(value) => updateContent(section.id, { brandName: value })}
            />
         </EditorSection>
         <EditorSection title="로고 이미지">
            <ImageField
               id={`${section.id}-logo`}
               image={logo}
               scaleLabel="로고 크기"
               onChange={(image) => updateContent(section.id, { logo: image })}
            />
         </EditorSection>
      </>
   );
}
