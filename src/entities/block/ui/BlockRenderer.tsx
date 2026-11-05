import type { Section } from '../types';
import { BlockPlaceholder } from './BlockPlaceholder';

// 블록 한 개를 type에 맞는 컴포넌트로 그린다. 블록을 만들 때마다 case를 하나씩 추가한다.
export function BlockRenderer({ section }: { section: Section }) {
   switch (section.type) {
      default:
         return <BlockPlaceholder section={section} />;
   }
}
