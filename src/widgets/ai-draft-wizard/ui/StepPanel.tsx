import type { ReactNode } from 'react';
import { AI_DRAFT_STEP_COUNT, AI_DRAFT_STEPS } from '../model/steps';

interface StepPanelProps {
   current: number;
   children?: ReactNode;
}

// 단계별 입력 내용이 들어가는 카드. 위쪽에 '입력 n / 5'와 단계 제목을 보여 준다.
export function StepPanel({ current, children }: StepPanelProps) {
   const step = AI_DRAFT_STEPS[current];

   return (
      <section
         aria-labelledby="ai-draft-step-title"
         className="rounded-2xl border border-brand-line bg-white p-6 md:p-8"
      >
         <p className="text-xs font-bold text-brand-orange">
            입력 {current + 1} / {AI_DRAFT_STEP_COUNT}
         </p>
         <h1 id="ai-draft-step-title" className="mt-1 text-xl font-bold text-black md:text-2xl">
            {step.title ?? step.label}
         </h1>
         <hr className="mt-4 border-brand-line" />
         <div className="mt-6 min-h-64">{children}</div>
      </section>
   );
}
