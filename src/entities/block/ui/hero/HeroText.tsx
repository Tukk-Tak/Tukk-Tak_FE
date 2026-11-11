// 히어로의 글 영역(제목, 부제, 뱃지). 세 variant가 함께 쓴다.
// - align: 전면 이미지형과 텍스트형은 가운데, 분할형은 왼쪽 정렬
// - tone: 사진 위에 올라갈 때(onImage)는 흰 글자, 그 외에는 사이트 테마 색
// 뱃지 개수는 여기서 제한하지 않는다. (최대 개수는 에디터와 서버가 검증한다)
export function HeroText({
   title,
   subtitle,
   badges,
   align,
   tone = 'default',
}: {
   title: string;
   subtitle?: string;
   badges?: string[];
   align: 'left' | 'center';
   tone?: 'default' | 'onImage';
}) {
   const onImage = tone === 'onImage';
   const visibleBadges = (badges ?? []).filter((badge) => badge.trim() !== '');
   const hasSubtitle = Boolean(subtitle?.trim());

   const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';
   const badgeAlignClass = align === 'center' ? 'justify-center' : 'justify-start';

   return (
      <div className={`relative flex max-w-3xl flex-col gap-4 ${alignClass}`}>
         <h2
            className={`text-3xl leading-tight font-bold @2xl:text-5xl ${onImage ? 'text-white' : 'text-site-text'}`}
         >
            {title}
         </h2>
         {hasSubtitle && (
            <p
               className={`text-lg whitespace-pre-line @2xl:text-xl ${onImage ? 'text-white/85' : 'text-site-text-muted'}`}
            >
               {subtitle}
            </p>
         )}
         {visibleBadges.length > 0 && (
            <ul className={`flex flex-wrap gap-2 ${badgeAlignClass}`}>
               {visibleBadges.map((badge, index) => (
                  <li
                     key={`${badge}-${index}`}
                     className={`rounded-full border px-3 py-1 text-sm font-medium ${
                        onImage
                           ? 'border-white/70 bg-white/15 text-white'
                           : 'border-site-primary bg-site-primary/10 text-site-primary'
                     }`}
                  >
                     {badge}
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
