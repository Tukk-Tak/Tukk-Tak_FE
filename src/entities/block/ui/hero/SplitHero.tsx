import type { HeroContent } from '../../types';
import { BlockImageFrame } from '../BlockImageFrame';
import { HeroText } from './HeroText';

// 분할형: 글과 이미지(가로 3 : 세로 2)를 1:1로 나란히 놓고, 블록 폭이 좁으면 이미지가 위, 글이 아래로 쌓인다.
// 이미지 값이 없으면 글이 전체 폭을 쓴다. (값은 있는데 불러오지 못하면 BlockImageFrame이 대체 화면을 보여 준다)
export function SplitHero({ content }: { content: HeroContent }) {
   const { title, subtitle, image, badges } = content;

   return (
      <div className={`grid items-center gap-8 ${image ? '@2xl:grid-cols-2' : ''}`}>
         {image && (
            <BlockImageFrame image={image} alt="" className="aspect-3/2 w-full @2xl:order-2" />
         )}
         <HeroText title={title} subtitle={subtitle} badges={badges} align="left" />
      </div>
   );
}
