import { HeroPreviewCard } from './HeroPreviewCard';
import { StartWithAiButton } from './StartWithAiButton';

export function HomeHero() {
   return (
      <section className="flex flex-1 flex-col items-start justify-between gap-12 px-[4%] py-16 lg:flex-row lg:items-center">
         <div>
            <h1 className="font-display text-4xl leading-[1.15] font-black tracking-tight break-keep text-black sm:text-5xl lg:text-[50px]">
               AI가 <span className="text-brand-orange">3초 만에</span>
               <br />
               가게 페이지 초안을
               <br />
               그려드려요
            </h1>
            <p className="mt-6 text-base leading-relaxed text-black/60">
               코드도, 디자인 지식도 필요 없어요.
               <br />
               분위기와 색상만 골라주시면 나머지는 저희가 뚝딱 만들어드립니다.
            </p>
            <StartWithAiButton />
         </div>
         <HeroPreviewCard />
      </section>
   );
}
