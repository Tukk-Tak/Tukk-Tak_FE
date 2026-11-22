'use client';

import { BLOCK_LIMITS, type HeroSection } from '@/entities/block';
import { useEditorSite } from '@/features/editor-site';
import { BadgesField } from '../BadgesField';
import { EditorSection } from '../EditorSection';
import { TextField } from '../fields';
import { ImageField } from '../ImageField';
import { StructureSection } from '../StructureSection';

// 히어로 편집: 구조, 제목(필수), 부제, 강조 특징(뱃지), 이미지(+크기).
// 이미지는 전면 이미지형과 좌우 분할형에서만 쓰이고, 텍스트형에서는 값을 남긴 채 흐리게 보여 준다.
export function HeroEditor({ section }: { section: HeroSection }) {
   const updateContent = useEditorSite((state) => state.updateContent);
   const { title, subtitle, badges, image } = section.content;

   return (
      <>
         <StructureSection section={section} />
         <EditorSection title="내용">
            <TextField
               id={`${section.id}-title`}
               label="제목"
               required
               value={title}
               maxLength={BLOCK_LIMITS.heroTitle}
               onChange={(value) => updateContent(section.id, { title: value })}
            />
            <TextField
               id={`${section.id}-subtitle`}
               label="부제"
               optional
               multiline
               rows={3}
               value={subtitle}
               maxLength={BLOCK_LIMITS.heroSubtitle}
               onChange={(value) => updateContent(section.id, { subtitle: value || undefined })}
            />
            <BadgesField
               id={`${section.id}-badges`}
               badges={badges}
               onChange={(next) => updateContent(section.id, { badges: next })}
            />
         </EditorSection>
         <EditorSection title="이미지">
            <ImageField
               id={`${section.id}-image`}
               image={image}
               scaleLabel="사진 크기"
               unusedNotice={
                  section.variant === 'textOnly'
                     ? '이 구조에서는 이미지를 쓰지 않아요. 입력한 사진은 다른 구조로 바꾸면 다시 보여요.'
                     : undefined
               }
               onChange={(next) => updateContent(section.id, { image: next })}
            />
         </EditorSection>
      </>
   );
}
