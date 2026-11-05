import type { HeaderSection, HeaderVariant } from '../../types';

// 두 variant는 로고(상호명) 정렬만 다르다.
const ALIGN_CLASS: Record<HeaderVariant, string> = {
   horizontal: 'justify-start',
   centered: 'justify-center',
};

export function HeaderBlock({ section }: { section: HeaderSection }) {
   const { brandName, logo } = section.content;

   return (
      <header className={`flex px-6 py-5 ${ALIGN_CLASS[section.variant]}`}>
         {logo ? (
            // 사용자가 올린 이미지의 호스트를 미리 알 수 없어 next/image 대신 img를 쓴다.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo.url} alt={brandName} className="h-10 w-auto object-contain" />
         ) : (
            <span className="text-site-text text-xl font-bold">{brandName}</span>
         )}
      </header>
   );
}
