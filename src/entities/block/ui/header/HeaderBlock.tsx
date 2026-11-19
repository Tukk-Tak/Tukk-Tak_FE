import type { HeaderSection, HeaderVariant } from '../../types';
import { HeaderLogoImage } from './HeaderLogoImage';

// 두 variant는 로고와 상호명을 놓는 정렬만 다르다.
const ALIGN_CLASS: Record<HeaderVariant, string> = {
   horizontal: 'justify-start',
   centered: 'justify-center',
};

// 로고 이미지가 있으면 [로고 이미지] 상호명 순서로 나란히 보여 준다. 로고가 없거나 불러오지 못하면 상호명만 보인다.
export function HeaderBlock({ section }: { section: HeaderSection }) {
   const { brandName, logo } = section.content;
   const hasBrandName = Boolean(brandName?.trim());

   return (
      <header className={`flex py-5 ${ALIGN_CLASS[section.variant]}`}>
         <div className="flex items-center gap-3">
            {logo && <HeaderLogoImage url={logo.url} scale={logo.scale} />}
            {hasBrandName && <span className="text-xl font-bold text-site-text">{brandName}</span>}
         </div>
      </header>
   );
}
