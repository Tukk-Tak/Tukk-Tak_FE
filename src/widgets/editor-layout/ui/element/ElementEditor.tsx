'use client';

import type { Section } from '@/entities/block';
import { FooterEditor } from './editors/FooterEditor';
import { GalleryEditor } from './editors/GalleryEditor';
import { HeaderEditor } from './editors/HeaderEditor';
import { HeroEditor } from './editors/HeroEditor';
import { ListEditor } from './editors/ListEditor';
import { TextEditor } from './editors/TextEditor';

// 선택한 블록의 종류에 맞는 편집 화면을 보여 준다.
// 블록을 바꿔 선택하면 입력칸이 새로 시작되도록 key에 블록 id를 준다. (접힘 상태와 입력 중이던 임시 값이 섞이지 않게)
export function ElementEditor({ section }: { section: Section }) {
   switch (section.type) {
      case 'header':
         return <HeaderEditor key={section.id} section={section} />;
      case 'hero':
         return <HeroEditor key={section.id} section={section} />;
      case 'text':
         return <TextEditor key={section.id} section={section} />;
      case 'footer':
         return <FooterEditor key={section.id} section={section} />;
      case 'list':
         return <ListEditor key={section.id} section={section} />;
      case 'gallery':
         return <GalleryEditor key={section.id} section={section} />;
   }
}
