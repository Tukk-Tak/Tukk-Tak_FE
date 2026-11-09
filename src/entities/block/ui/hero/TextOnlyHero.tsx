import type { HeroContent } from '../../types';
import { HeroText } from './HeroText';

// 텍스트형: 이미지 없이 옅은 배경 블록 위에 문구를 가운데로 놓는다. (image 값은 보존하고 표시하지 않는다)
export function TextOnlyHero({ content }: { content: HeroContent }) {
   const { title, subtitle, badges } = content;

   return (
      <div className="flex justify-center rounded-site bg-site-text/5 px-6 py-10 @2xl:py-18">
         <HeroText title={title} subtitle={subtitle} badges={badges} align="center" />
      </div>
   );
}
