// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import { HomeFeatures } from '@/widgets/home-features';
import { HomeHero } from '@/widgets/home-hero';

export default function Home() {
   return (
      // 헤더 높이(h-16)를 뺀 나머지를 채워, 특징 영역이 화면 아래쪽에 붙게 한다.
      <main className="bg-brand-cream flex min-h-[calc(100vh-4rem)] flex-col">
         <HomeHero />
         <HomeFeatures />
      </main>
   );
}
