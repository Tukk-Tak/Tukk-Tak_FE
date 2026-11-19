'use client';

import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';
import { BLOCK_LIMITS, type TextAlign, type TextSection } from '@/entities/block';
import { useEditorSite } from '@/features/editor-site';
import { EditorSection } from '../EditorSection';
import { TextField } from '../fields';
import { ImageField } from '../ImageField';
import { StructureSection } from '../StructureSection';

const ALIGNS: { value: TextAlign; label: string; icon: typeof AlignLeft }[] = [
   { value: 'left', label: '왼쪽 정렬', icon: AlignLeft },
   { value: 'center', label: '가운데 정렬', icon: AlignCenter },
   { value: 'right', label: '오른쪽 정렬', icon: AlignRight },
];

// 줄글 편집: 구조, 제목(선택), 본문(필수), 이미지(+크기), 글 정렬.
// 이미지는 이미지 병행형에서만 쓰이고, 단일 컬럼형에서는 값을 남긴 채 흐리게 보여 준다.
// 글 정렬은 줄글에서만 고를 수 있다.
export function TextEditor({ section }: { section: TextSection }) {
   const updateContent = useEditorSite((state) => state.updateContent);
   const { title, body, image, align = 'left' } = section.content;

   return (
      <>
         <StructureSection section={section} />
         <EditorSection title="내용">
            <TextField
               id={`${section.id}-title`}
               label="제목"
               optional
               value={title}
               maxLength={BLOCK_LIMITS.textTitle}
               onChange={(value) => updateContent(section.id, { title: value || undefined })}
            />
            <TextField
               id={`${section.id}-body`}
               label="본문"
               required
               multiline
               rows={6}
               value={body}
               maxLength={BLOCK_LIMITS.textBody}
               onChange={(value) => updateContent(section.id, { body: value })}
            />
         </EditorSection>
         <EditorSection title="이미지">
            <ImageField
               id={`${section.id}-image`}
               image={image}
               scaleLabel="사진 크기"
               unusedNotice={
                  section.variant === 'withImage'
                     ? undefined
                     : '이 구조에서는 이미지를 쓰지 않아요. 입력한 사진은 다른 구조로 바꾸면 다시 보여요.'
               }
               onChange={(next) => updateContent(section.id, { image: next })}
            />
         </EditorSection>
         <EditorSection title="글 정렬">
            <div role="group" aria-label="글 정렬" className="flex gap-2">
               {ALIGNS.map(({ value, label, icon: Icon }) => {
                  const selected = align === value;
                  return (
                     <button
                        key={value}
                        type="button"
                        aria-pressed={selected}
                        aria-label={label}
                        title={label}
                        onClick={() => updateContent(section.id, { align: value })}
                        className={`flex size-10 cursor-pointer items-center justify-center rounded-lg border transition-colors ${
                           selected
                              ? 'border-brand-brown bg-brand-brown text-white'
                              : 'border-brand-line bg-white text-[#79716B] hover:border-brand-orange hover:text-brand-orange'
                        }`}
                     >
                        <Icon className="size-4" aria-hidden />
                     </button>
                  );
               })}
            </div>
         </EditorSection>
      </>
   );
}
