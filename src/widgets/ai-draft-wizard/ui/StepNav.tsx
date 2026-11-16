import { Check } from 'lucide-react';
import { AI_DRAFT_STEPS } from '../model/steps';

interface StepNavProps {
   current: number;
   // 단계별로 필수 항목을 모두 채웠는지. 채웠고 현재 단계가 아니면 숫자 대신 체크를 보여 준다.
   completed: boolean[];
   onSelect: (index: number) => void;
   // list: 큰 화면의 세로 목록(사이드바) / tabs: 작은 화면의 가로 목록
   variant: 'list' | 'tabs';
}

// 입력 5단계 목록. 눌러서 원하는 단계로 이동한다.
export function StepNav({ current, completed, onSelect, variant }: StepNavProps) {
   const isList = variant === 'list';

   return (
      <nav aria-label="입력 단계">
         <ul className={isList ? 'space-y-1.5' : 'flex gap-1 px-[4%] pb-3'}>
            {AI_DRAFT_STEPS.map((step, index) => {
               const active = index === current;
               const done = completed[index] && !active;
               return (
                  <li key={step.id} className={isList ? undefined : 'shrink-0'}>
                     <button
                        type="button"
                        aria-current={active ? 'step' : undefined}
                        onClick={() => onSelect(index)}
                        className={
                           isList
                              ? `flex w-full cursor-pointer items-center gap-3 rounded-r-lg border-l-4 px-4 py-3.5 text-left text-[14px] ${
                                   active
                                      ? 'border-brand-orange bg-brand-orange-light font-bold text-brand-brown'
                                      : 'border-transparent font-medium text-[#79716B] hover:bg-brand-orange-light/50'
                                }`
                              : `flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-sm whitespace-nowrap ${
                                   active
                                      ? 'bg-brand-orange-light font-bold text-brand-orange'
                                      : 'font-medium text-black/70 hover:text-brand-orange'
                                }`
                        }
                     >
                        <span
                           className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-[12px] ${
                              done
                                 ? 'border-brand-orange bg-brand-orange text-white'
                                 : active
                                   ? 'border-brand-orange text-brand-orange'
                                   : 'border-brand-line text-[#A6A09B]'
                           }`}
                        >
                           {done ? (
                              <Check className="size-3" strokeWidth={3} aria-label="입력 완료" />
                           ) : (
                              index + 1
                           )}
                        </span>
                        {step.label}
                     </button>
                  </li>
               );
            })}
         </ul>
      </nav>
   );
}
