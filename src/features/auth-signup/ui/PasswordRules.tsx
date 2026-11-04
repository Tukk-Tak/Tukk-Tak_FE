import { Check } from 'lucide-react';
import type { PasswordRuleResult } from '../model/validation';

interface PasswordRulesProps {
   results: PasswordRuleResult[];
   // true면 충족하지 못한 조건을 오류(빨강)로 보여준다. 입력하는 동안에는 false로 두어 재촉하지 않는다.
   showFailures: boolean;
   listId?: string;
}

export function PasswordRules({ results, showFailures, listId }: PasswordRulesProps) {
   return (
      <ul id={listId} className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
         {results.map(({ id, label, passed }) => {
            const failed = showFailures && !passed;
            const textClass = passed
               ? 'text-state-success'
               : failed
                 ? 'text-state-error'
                 : 'text-black/50';
            const markClass = passed
               ? 'bg-state-success border-state-success text-white'
               : failed
                 ? 'border-state-error bg-white'
                 : 'border-brand-line bg-white';

            return (
               <li key={id} className={`flex items-center gap-2 text-[13px] ${textClass}`}>
                  <span
                     aria-hidden
                     className={`flex size-4 items-center justify-center rounded-full border text-[10px] leading-none font-bold ${markClass}`}
                  >
                     {passed ? <Check className="size-2.5" strokeWidth={4} /> : failed ? '!' : null}
                  </span>
                  {label}
                  <span className="sr-only">{passed ? ' (충족)' : ' (미충족)'}</span>
               </li>
            );
         })}
      </ul>
   );
}
