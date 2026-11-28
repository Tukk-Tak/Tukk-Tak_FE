'use client';

import { useId, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import { normalizeHex } from '../lib/color';
import { Button } from './Button';
import { FieldMessage } from './FieldMessage';
import { Modal } from './Modal';

interface ColorPickerModalProps {
   title: string;
   // 처음 보여 줄 색
   initialColor: string;
   // 이미 쓰고 있어서 다시 고를 수 없는 색(대문자 hex). 같은 색을 고르면 안내가 뜨고 [선택]이 막힌다.
   takenColors?: string[];
   // 눌러서 바로 고를 수 있는 색(대문자 hex). 있으면 아래에 "이 사이트에서 쓰는 색"으로 보여 준다.
   suggestions?: string[];
   onConfirm: (hex: string) => void;
   onClose: () => void;
}

// 색을 직접 고르는 작은 모달. [선택]을 눌러야 색이 적용된다.
// (드래그하는 동안 바로 반영하면 색이 계속 쌓이거나 화면이 계속 바뀐다.)
export function ColorPickerModal({
   title,
   initialColor,
   takenColors = [],
   suggestions = [],
   onConfirm,
   onClose,
}: ColorPickerModalProps) {
   const titleId = useId();
   const [color, setColor] = useState(initialColor);

   const hex = normalizeHex(color) ?? initialColor.toUpperCase();
   const alreadySelected = takenColors.includes(hex);

   return (
      <Modal titleId={titleId} onClose={onClose} className="max-w-xs">
         <div className="px-6 py-7">
            <h2 id={titleId} className="text-lg font-bold text-brand-brown">
               {title}
            </h2>

            <div className="mt-5 [&_.react-colorful]:h-44! [&_.react-colorful]:w-full!">
               <HexColorPicker color={color} onChange={setColor} />
            </div>

            <div className="mt-4 flex items-center gap-3">
               <span
                  aria-hidden
                  className="size-10 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: hex }}
               />
               <HexColorInput
                  color={color}
                  onChange={setColor}
                  prefixed
                  aria-label="색상 코드(HEX)"
                  className="h-10 w-full rounded-xl border border-brand-line bg-white px-4 text-sm text-brand-brown uppercase outline-none focus:border-brand-orange"
               />
            </div>
            {alreadySelected && <FieldMessage tone="error">이미 고른 색이에요.</FieldMessage>}

            {suggestions.length > 0 && (
               <div className="mt-4">
                  <p className="text-[11px] text-[#A6A09B]">이 사이트에서 쓰는 색</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                     {suggestions.map((suggestion) => (
                        <li key={suggestion}>
                           <button
                              type="button"
                              aria-label={`${suggestion} 선택`}
                              title={suggestion}
                              onClick={() => setColor(suggestion)}
                              className="size-6 cursor-pointer rounded-full border border-black/10 hover:outline-2 hover:outline-offset-1 hover:outline-brand-orange"
                              style={{ backgroundColor: suggestion }}
                           />
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-2">
               <Button variant="outline" size="form" onClick={onClose} className="w-full">
                  취소
               </Button>
               <Button
                  size="form"
                  disabled={alreadySelected}
                  onClick={() => onConfirm(hex)}
                  className="w-full"
               >
                  선택
               </Button>
            </div>
         </div>
      </Modal>
   );
}
