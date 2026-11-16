import { FLOW_STEPS } from '../model/steps';

// 화면 위쪽의 큰 흐름 표시(AI 초안 → 직접 수정). 이 화면은 항상 1번째 단계이다.
export function FlowProgress() {
   return (
      <ol
         aria-label="사이트 만들기 진행 단계"
         className="flex shrink-0 items-center justify-center gap-4 px-[4%] pt-8 pb-5"
      >
         {FLOW_STEPS.map((label, index) => {
            const active = index === 0;
            return (
               <li key={label} className="flex items-center gap-4">
                  {index > 0 && <span aria-hidden className="h-px w-24 bg-brand-line md:w-44" />}
                  <span
                     aria-current={active ? 'step' : undefined}
                     className="flex items-center gap-2.5"
                  >
                     <span
                        className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                           active
                              ? 'bg-brand-orange text-white'
                              : 'border border-brand-line text-black/40'
                        }`}
                     >
                        {index + 1}
                     </span>
                     <span
                        className={`text-sm font-semibold ${active ? 'text-brand-brown' : 'text-black/40'}`}
                     >
                        {label}
                     </span>
                  </span>
               </li>
            );
         })}
      </ol>
   );
}
