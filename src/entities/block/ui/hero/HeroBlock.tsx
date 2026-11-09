import type { HeroSection } from '../../types';
import { FullImageHero } from './FullImageHero';
import { SplitHero } from './SplitHero';
import { TextOnlyHero } from './TextOnlyHero';

// 히어로는 세 variant 모두 전체 폭 전용이다. (반폭 줄에는 놓지 않는다)
export function HeroBlock({ section }: { section: HeroSection }) {
   switch (section.variant) {
      case 'fullImage':
         return <FullImageHero content={section.content} />;
      case 'split':
         return <SplitHero content={section.content} />;
      case 'textOnly':
         return <TextOnlyHero content={section.content} />;
   }
}
