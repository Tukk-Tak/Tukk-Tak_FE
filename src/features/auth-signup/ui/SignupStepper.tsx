import { Check } from 'lucide-react';

const STEPS = [
   { step: 1, label: '계정 정보' },
   { step: 2, label: '가게 정보' },
];

export function SignupStepper({ currentStep }: { currentStep: number }) {
   return (
      <ol className="flex items-center gap-3 px-19">
         {STEPS.map(({ step, label }, index) => {
            const done = step < currentStep;
            const active = step === currentStep;
            const reached = done || active;

            return (
               <li key={step} className="contents">
                  {/* 단계 사이를 잇는 선 */}
                  {index > 0 && <span aria-hidden className="bg-brand-line h-px flex-1" />}
                  <span
                     aria-current={active ? 'step' : undefined}
                     className={`flex items-center gap-2 text-xs font-bold ${reached ? 'text-black' : 'text-black/40'}`}
                  >
                     <span
                        className={`flex size-7 items-center justify-center rounded-full border text-xs ${reached ? 'bg-brand-orange border-brand-orange text-white' : 'border-brand-line bg-white text-black/40'}`}
                     >
                        {done ? <Check aria-hidden className="size-3.5" strokeWidth={3} /> : step}
                        {done && <span className="sr-only">완료</span>}
                     </span>
                     {label}
                  </span>
               </li>
            );
         })}
      </ol>
   );
}
