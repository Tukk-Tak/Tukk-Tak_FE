'use client';

import { IMAGE_SCALE } from '@/entities/block';
import { useEditorSite } from '@/features/editor-site';

interface ScaleSliderProps {
   id: string;
   label: string;
   // 1이 사진 전체가 보이는 기본 상태이다.
   scale: number;
   onChange: (scale: number) => void;
}

// 사진 크기 슬라이더(100%~200%, 5% 단위). 한 장이 크게 보이는 사진에만 쓴다.
export function ScaleSlider({ id, label, scale, onChange }: ScaleSliderProps) {
   // 끄는 동안의 변경은 되돌리기 한 번으로 묶는다. (손을 떼거나 포커스가 벗어나면 끝)
   const beginBatch = useEditorSite((state) => state.beginBatch);
   const endBatch = useEditorSite((state) => state.endBatch);

   return (
      <div className="mt-4">
         <label
            htmlFor={id}
            className="flex items-center justify-between text-xs font-bold text-brand-brown"
         >
            {label}
            <span className="font-normal text-[#79716B]">{Math.round(scale * 100)}%</span>
         </label>
         <input
            id={id}
            type="range"
            min={IMAGE_SCALE.min * 100}
            max={IMAGE_SCALE.max * 100}
            step={IMAGE_SCALE.step * 100}
            value={Math.round(scale * 100)}
            onPointerDown={beginBatch}
            onPointerUp={endBatch}
            onKeyDown={beginBatch}
            onKeyUp={endBatch}
            onBlur={endBatch}
            onChange={(event) => onChange(Number(event.target.value) / 100)}
            className="mt-2 w-full cursor-pointer accent-brand-orange"
         />
      </div>
   );
}
