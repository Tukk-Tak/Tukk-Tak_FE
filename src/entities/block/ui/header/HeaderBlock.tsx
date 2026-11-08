import type { HeaderSection, HeaderVariant } from '../../types';
import { HeaderLogoImage } from './HeaderLogoImage';

// 두 variant는 로고(상호명) 정렬만 다르다.
const ALIGN_CLASS: Record<HeaderVariant, string> = {
   horizontal: 'justify-start',
   centered: 'justify-center',
};

export function HeaderBlock({ section }: { section: HeaderSection }) {
   const { brandName, logo } = section.content;
   const brandText = <span className="text-xl font-bold text-site-text">{brandName}</span>;

   return (
      <header className={`flex py-5 ${ALIGN_CLASS[section.variant]}`}>
         {logo ? (
            <HeaderLogoImage url={logo.url} alt={brandName} fallback={brandText} />
         ) : (
            brandText
         )}
      </header>
   );
}
