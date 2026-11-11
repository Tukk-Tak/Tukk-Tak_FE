import { Check } from 'lucide-react';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { ShowcaseCard } from './ShowcaseCard';

const SHOWCASE_SHOPS = ['동네 분식집', '브런치 카페', '골목 이자카야'];

const BENEFITS = [
   '사업자 인증을 마친 사장님만 배포해요',
   '가입부터 첫 페이지까지 평균 3분이면 충분해요',
   '언제든 자유롭게 수정하고 다시 배포할 수 있어요',
];

// 회원가입과 로그인 페이지가 함께 쓰는 왼쪽 소개 패널. 좁은 화면에서는 폼에 집중하도록 숨긴다.
// 오른쪽 폼이 길어 스크롤되어도 이 패널은 움직이지 않고(스크롤은 오른쪽 main만 한다), 내용 전체가 한 화면에 보여야 한다.
// 높이는 부모 레이아웃이 주는 남은 높이를 그대로 쓰고, 세로 여백과 이미지 크기는 vh, 좌우 여백과 글자 크기는 vw 기준으로 줄어들게 했다.
// (패널 너비가 화면의 39%라 좁은 화면에서는 글이 들어갈 폭이 줄어 줄바꿈이 늘고 세로로 길어지기 때문)
// 패널 너비는 %가 아니라 vw로 정한다. (스크롤바가 자리를 차지하던 때의 흔적이지만, 화면 너비에 비례해 정하는 편이 단순해서 그대로 둔다.)
// 그래도 화면 높이가 560px 미만이면 가게 카드 영역을 숨기고, 스크롤 영역은 그보다 낮은 극단적인 화면을 위한 안전장치다.
export function AuthIntro() {
   return (
      <aside className="bg-brand-orange-light relative hidden overflow-hidden lg:block lg:w-[39vw] lg:shrink-0">
         {/* 패널 오른쪽 위 모서리에 걸친 장식 원. aside가 relative라서 패널을 기준으로 놓이고, overflow로 패널 밖은 잘린다. */}
         <span
            aria-hidden
            className="pointer-events-none absolute -top-[182px] -right-[182px] size-[364px] rounded-full border-[6px] border-white/40"
         />

         {/* 여백은 스크롤 영역 안쪽(내용)에 둔다. 끝까지 스크롤했을 때 아래 여백이 사라지지 않게 하려는 것이다. */}
         <ScrollArea
            className="size-full"
            contentClassName="flex min-h-full flex-col justify-between px-[clamp(1.5rem,5vw,5rem)] pt-[clamp(1.5rem,4.5vh,2.5rem)] pb-[clamp(1.5rem,9vh,5rem)]"
         >
            <div className="relative">
               <p className="inline-block rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-orange">
                  사장님을 위한 가장 쉬운 시작
               </p>
               <h2 className="mt-[clamp(0.75rem,2.5vh,1.25rem)] text-[clamp(1.5rem,min(4.2vh,2.6vw),2.125rem)] leading-[1.3] font-extrabold tracking-tight text-black">
                  방망이 한 번이면
                  <br />
                  가게 페이지가 완성돼요
               </h2>
               <p className="mt-3 text-[clamp(0.8125rem,1.05vw,0.875rem)] text-black/60">
                  디자인도 코딩도 몰라도 괜찮아요. 가게 이야기만 들려주세요.
               </p>

               {/* 화면 높이가 560px 미만이면 이 영역부터 숨겨서, 제목과 체크리스트가 스크롤 없이 보이게 한다. */}
               <div className="[@media(max-height:559px)]:hidden">
                  <h3 className="mt-[clamp(1rem,4vh,2.25rem)] text-xs font-bold text-black">
                     뚝딱으로 만든 가게들
                  </h3>
                  <ul className="mt-3 grid grid-cols-3 gap-2.5">
                     {SHOWCASE_SHOPS.map((name) => (
                        <ShowcaseCard key={name} name={name} />
                     ))}
                  </ul>
               </div>
            </div>

            <ul className="border-brand-line relative space-y-[clamp(0.5rem,1.6vh,0.875rem)] border-t pt-[clamp(1rem,3vh,1.75rem)]">
               {BENEFITS.map((benefit) => (
                  <li
                     key={benefit}
                     className="flex items-center gap-3 text-[clamp(0.75rem,1vw,0.8125rem)] text-black/80"
                  >
                     <span
                        aria-hidden
                        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-brand-orange"
                     >
                        <Check className="size-3.5" strokeWidth={3} />
                     </span>
                     {benefit}
                  </li>
               ))}
            </ul>
         </ScrollArea>
      </aside>
   );
}
