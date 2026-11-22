import { memo } from 'react';
import type { Section } from '../types';
import { BlockPlaceholder } from './BlockPlaceholder';
import { FooterBlock } from './footer/FooterBlock';
import { GalleryBlock } from './gallery/GalleryBlock';
import { HeaderBlock } from './header/HeaderBlock';
import { HeroBlock } from './hero/HeroBlock';
import { ListBlock } from './list/ListBlock';
import { TextBlock } from './text/TextBlock';

// 블록 한 개를 type에 맞는 컴포넌트로 그린다. 블록을 만들 때마다 case를 하나씩 추가한다.
// memo: 에디터에서 한 블록을 고칠 때, 값이 바뀌지 않은 다른 블록은 다시 그리지 않는다. (블록 객체가 그대로면 건너뛴다)
export const BlockRenderer = memo(function BlockRenderer({ section }: { section: Section }) {
   switch (section.type) {
      case 'header':
         return <HeaderBlock section={section} />;
      case 'hero':
         return <HeroBlock section={section} />;
      case 'text':
         return <TextBlock section={section} />;
      case 'gallery':
         return <GalleryBlock section={section} />;
      case 'list':
         return <ListBlock section={section} />;
      case 'footer':
         return <FooterBlock section={section} />;
      default:
         return <BlockPlaceholder section={section} />;
   }
});
