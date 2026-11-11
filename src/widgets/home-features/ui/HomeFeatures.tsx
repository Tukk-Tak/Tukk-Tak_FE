import { FeatureItem } from './FeatureItem';

const FEATURES = [
   {
      title: '업종 특화 블록 제공',
      description: '메뉴판, 영업시간, 오시는 길이 기본 구성으로 제공돼요.',
   },
   {
      title: '백그라운드에서 생성',
      description: 'AI가 만드는 동안 다른 작업을 자유롭게 할 수 있어요.',
   },
   {
      title: '배포 후에도 자유롭게 수정',
      description: '블록 단위로 언제든지 바로 고치고 반영할 수 있어요.',
   },
];

export function HomeFeatures() {
   return (
      <section className="border-brand-line mx-[4%] grid grid-cols-1 gap-6 border-t pt-8 pb-14 md:grid-cols-3">
         {FEATURES.map((feature) => (
            <FeatureItem key={feature.title} {...feature} />
         ))}
      </section>
   );
}
