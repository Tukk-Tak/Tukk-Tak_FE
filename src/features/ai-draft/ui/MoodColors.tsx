'use client';

import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAiDraftForm } from '../model/AiDraftFormContext';
import { getCheckColor } from '../model/color';
import { MAX_MOOD_COLORS, PALETTE_COLORS } from '../model/options';
import { getCustomColors } from '../model/values';
import { ColorPickerModal } from './ColorPickerModal';

interface SwatchProps {
   hex: string;
   label: string;
   selected: boolean;
   disabled?: boolean;
   onClick: () => void;
}

// 색 원 하나. 선택하면 주황 테두리와 체크 표시가 생긴다. 흰색에 가까운 색도 보이도록 옅은 테두리를 둔다.
function Swatch({ hex, label, selected, disabled = false, onClick }: SwatchProps) {
   return (
      <button
         type="button"
         aria-pressed={selected}
         aria-label={label}
         title={label}
         disabled={disabled}
         onClick={onClick}
         className={`flex aspect-square w-full cursor-pointer items-center justify-center rounded-full border border-black/10 transition-opacity disabled:cursor-not-allowed disabled:opacity-35 ${
            selected ? 'ring-2 ring-brand-orange ring-offset-2' : ''
         }`}
         style={{ backgroundColor: hex }}
      >
         {selected && (
            <Check className="size-4" style={{ color: getCheckColor(hex) }} aria-hidden />
         )}
      </button>
   );
}

// 분위기에 맞는 색(필수). 팔레트와 직접 고른 색을 합쳐 최대 3개까지 고른다.
// 직접 고른 색은 팔레트 뒤에 쌓이고, 다시 누르면 해제되면서 목록에서 사라진다. 직접 고른 색이 3개가 되면 + 버튼은 사라진다.
export function MoodColors() {
   const { values, update } = useAiDraftForm();
   const [pickerOpen, setPickerOpen] = useState(false);

   const selected = values.moodColors;
   const customColors = getCustomColors(values);
   const full = selected.length >= MAX_MOOD_COLORS;

   const remove = (hex: string) => update({ moodColors: selected.filter((item) => item !== hex) });

   const togglePalette = (hex: string) => {
      if (selected.includes(hex)) remove(hex);
      else if (!full) update({ moodColors: [...selected, hex] });
   };

   const addCustom = (hex: string) => {
      if (!selected.includes(hex) && !full) update({ moodColors: [...selected, hex] });
      setPickerOpen(false);
   };

   return (
      <fieldset>
         <legend className="flex w-full items-center justify-between text-sm font-bold text-brand-brown">
            <span>
               분위기에 맞는 색을 최대 {MAX_MOOD_COLORS}개 골라 주세요
               <span aria-hidden className="ml-1 text-brand-orange">
                  *
               </span>
            </span>
            <span className="shrink-0 pl-3 font-semibold whitespace-nowrap text-[#A6A09B]">
               {selected.length} / {MAX_MOOD_COLORS}
            </span>
         </legend>
         <p className="mt-1.5 text-xs text-[#A6A09B]">
            고른 색은 AI가 사이트 초안을 그릴 때 분위기 참고용으로 사용돼요.
         </p>

         <div className="mt-5 grid max-w-80 grid-cols-6 gap-3.5">
            {PALETTE_COLORS.map(({ hex, name }) => {
               const isSelected = selected.includes(hex);
               return (
                  <Swatch
                     key={hex}
                     hex={hex}
                     label={name}
                     selected={isSelected}
                     disabled={full && !isSelected}
                     onClick={() => togglePalette(hex)}
                  />
               );
            })}

            {customColors.map((hex) => (
               <Swatch
                  key={hex}
                  hex={hex}
                  label={`직접 고른 색 ${hex} (누르면 해제돼요)`}
                  selected
                  onClick={() => remove(hex)}
               />
            ))}

            {customColors.length < MAX_MOOD_COLORS && (
               <button
                  type="button"
                  aria-label="색 직접 고르기"
                  title="색 직접 고르기"
                  disabled={full}
                  onClick={() => setPickerOpen(true)}
                  className="flex aspect-square w-full cursor-pointer items-center justify-center rounded-full border border-dashed border-brand-brown/40 text-brand-brown transition-colors not-disabled:hover:border-brand-orange not-disabled:hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-35"
               >
                  <Plus className="size-4" aria-hidden />
               </button>
            )}
         </div>

         {pickerOpen && (
            <ColorPickerModal
               selectedColors={selected}
               onConfirm={addCustom}
               onClose={() => setPickerOpen(false)}
            />
         )}
      </fieldset>
   );
}
