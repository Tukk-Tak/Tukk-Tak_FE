'use client';

import { useAiDraftForm } from '../model/AiDraftFormContext';
import { MAX_MOOD_KEYWORDS, MOOD_KEYWORDS, type MoodKeyword } from '../model/options';
import { FieldMessage } from '@/shared/ui/FieldMessage';

// 분위기 키워드(필수). 최대 3개까지 고르고, 다 고르면 나머지는 눌러도 선택되지 않는다.
export function MoodKeywords() {
   const { values, update } = useAiDraftForm();
   const selected = values.moodKeywords;
   const full = selected.length >= MAX_MOOD_KEYWORDS;

   const toggle = (key: MoodKeyword) => {
      if (selected.includes(key)) {
         update({ moodKeywords: selected.filter((item) => item !== key) });
      } else if (!full) {
         update({ moodKeywords: [...selected, key] });
      }
   };

   return (
      <fieldset>
         <legend className="flex w-full items-center justify-between text-sm font-bold text-brand-brown">
            <span>
               분위기 키워드
               <span aria-hidden className="ml-1 text-brand-orange">
                  *
               </span>
            </span>
            <span className="shrink-0 pl-3 font-semibold whitespace-nowrap text-[#A6A09B]">
               {selected.length} / {MAX_MOOD_KEYWORDS}
            </span>
         </legend>

         <div className="mt-3 flex flex-wrap gap-2.5">
            {MOOD_KEYWORDS.map(({ key, label }) => {
               const isSelected = selected.includes(key);
               const blocked = full && !isSelected;
               return (
                  <button
                     key={key}
                     type="button"
                     aria-pressed={isSelected}
                     disabled={blocked}
                     onClick={() => toggle(key)}
                     className={`h-10 cursor-pointer rounded-full border px-5 text-sm transition-colors disabled:cursor-not-allowed ${
                        isSelected
                           ? 'border-brand-orange bg-brand-orange-light font-semibold text-brand-orange'
                           : blocked
                             ? 'border-transparent bg-field-disabled text-black/30'
                             : 'border-brand-line bg-white text-[#79716B] hover:border-brand-orange hover:text-brand-orange'
                     }`}
                  >
                     {label}
                  </button>
               );
            })}
         </div>

         <FieldMessage className="mt-3">
            최대 {MAX_MOOD_KEYWORDS}개까지 고를 수 있어요. 다른 걸 고르려면 하나를 먼저 해제해
            주세요.
         </FieldMessage>
      </fieldset>
   );
}
