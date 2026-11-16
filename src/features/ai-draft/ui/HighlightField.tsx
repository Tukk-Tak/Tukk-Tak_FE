'use client';

import { X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { Input } from '@/shared/ui/Input';
import { useAiDraftForm } from '../model/AiDraftFormContext';
import {
   HIGHLIGHT_CUSTOM_MAX,
   HIGHLIGHT_PRESETS,
   MAX_HIGHLIGHTS,
   type HighlightKey,
} from '../model/options';

const CHIP_BASE =
   'h-10 cursor-pointer rounded-full border px-5 text-sm transition-colors disabled:cursor-not-allowed';
const CHIP_SELECTED = 'border-brand-orange bg-brand-orange-light font-semibold text-brand-orange';
const CHIP_IDLE =
   'border-brand-line bg-white text-[#79716B] hover:border-brand-orange hover:text-brand-orange';
const CHIP_BLOCKED = 'border-transparent bg-field-disabled text-black/30';

// 강조 특징(선택). 프리셋과 직접 입력한 특징을 합쳐 최대 3개까지 고른다.
// 직접 입력한 특징은 칩으로 쌓이고, 다시 누르면 목록에서 사라진다.
export function HighlightField() {
   const { values, update } = useAiDraftForm();
   const [adding, setAdding] = useState(false);
   const [draft, setDraft] = useState('');
   const [error, setError] = useState<string | null>(null);

   const { highlightKeys, highlightCustoms } = values;
   const total = highlightKeys.length + highlightCustoms.length;
   const full = total >= MAX_HIGHLIGHTS;

   const togglePreset = (key: HighlightKey) => {
      if (highlightKeys.includes(key)) {
         update({ highlightKeys: highlightKeys.filter((item) => item !== key) });
      } else if (!full) {
         update({ highlightKeys: [...highlightKeys, key] });
      }
   };

   const addCustom = (event: FormEvent) => {
      event.preventDefault();
      const text = draft.trim();
      if (text === '') return;

      const lower = text.toLowerCase();
      const exists =
         HIGHLIGHT_PRESETS.some((preset) => preset.label === text) ||
         highlightCustoms.some((item) => item.toLowerCase() === lower);
      if (exists) {
         setError('이미 있는 특징이에요.');
         return;
      }

      update({ highlightCustoms: [...highlightCustoms, text] });
      setDraft('');
      setError(null);
      setAdding(false);
   };

   return (
      <fieldset>
         <legend className="flex w-full items-center justify-between text-sm font-bold text-brand-brown">
            <span>
               강조 특징
               <span className="ml-1 font-normal text-[#A6A09B]">(선택)</span>
            </span>
            <span className="shrink-0 pl-3 font-semibold whitespace-nowrap text-[#A6A09B]">
               {total} / {MAX_HIGHLIGHTS}
            </span>
         </legend>

         <div className="mt-3 flex flex-wrap gap-2.5">
            {HIGHLIGHT_PRESETS.map(({ key, label }) => {
               const selected = highlightKeys.includes(key);
               const blocked = full && !selected;
               return (
                  <button
                     key={key}
                     type="button"
                     aria-pressed={selected}
                     disabled={blocked}
                     onClick={() => togglePreset(key)}
                     className={`${CHIP_BASE} ${selected ? CHIP_SELECTED : blocked ? CHIP_BLOCKED : CHIP_IDLE}`}
                  >
                     {label}
                  </button>
               );
            })}

            {highlightCustoms.map((text) => (
               <button
                  key={text}
                  type="button"
                  aria-pressed
                  aria-label={`${text} (누르면 해제돼요)`}
                  onClick={() =>
                     update({ highlightCustoms: highlightCustoms.filter((i) => i !== text) })
                  }
                  className={`${CHIP_BASE} ${CHIP_SELECTED} flex items-center gap-1.5`}
               >
                  {text}
                  <X className="size-3.5" aria-hidden />
               </button>
            ))}

            <button
               type="button"
               aria-pressed={adding}
               disabled={full}
               onClick={() => {
                  setAdding((open) => !open);
                  setError(null);
               }}
               className={`${CHIP_BASE} ${full ? CHIP_BLOCKED : adding ? CHIP_SELECTED : CHIP_IDLE}`}
            >
               직접 입력
            </button>
         </div>

         {adding && !full && (
            <form onSubmit={addCustom} className="mt-3 flex gap-2">
               <Input
                  tone="brown"
                  aria-label="강조 특징 직접 입력"
                  placeholder="예: 심야 영업"
                  maxLength={HIGHLIGHT_CUSTOM_MAX}
                  value={draft}
                  autoFocus
                  invalid={Boolean(error)}
                  onChange={(event) => {
                     setDraft(event.target.value);
                     setError(null);
                  }}
               />
               <Button type="submit" size="field" disabled={draft.trim() === ''}>
                  추가
               </Button>
            </form>
         )}
         {error && <FieldMessage tone="error">{error}</FieldMessage>}

         <p className="mt-4 rounded-lg bg-[#F7F0E8] px-4 py-3 text-xs text-[#79716B]">
            강조 특징은 히어로 블럭에서 뱃지로 보여줘요
         </p>
      </fieldset>
   );
}
