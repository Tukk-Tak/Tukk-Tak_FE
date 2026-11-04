// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import { HomeFeatures } from '@/widgets/home-features';
import { HomeHero } from '@/widgets/home-hero';

export default function Home() {
   return (
      // 헤더 높이(h-16)를 뺀 높이로 고정해, 특징 영역이 화면 아래쪽에 붙게 한다.
      // 페이지 전체가 아니라 이 main만 스크롤되고(내용이 길 때), relative는 absolute 요소가 밖으로 새지 않게 한다.
      <main className="bg-brand-cream relative flex h-[calc(100dvh-4rem)] flex-col overflow-y-auto">
         <HomeHero />
         <HomeFeatures />
      </main>
   );
}
