'use client';

import type { KeyboardEvent, ReactNode } from 'react';
import { BLOCK_TYPE_LABEL, type Section } from '@/entities/block';
import { useOptionalEditorSelection } from '../model/EditorSelectionContext';

interface EditableBlockProps {
   section: Section;
   children: ReactNode;
}

// 캔버스에서 블록 하나를 감싸는 편집용 틀.
// - 편집 모드: 블록 위에 종류 라벨이 보이고, 누르면 선택된다. 선택하면 주황 테두리와 [선택됨] 라벨이 나온다.
//   블록 안의 링크와 버튼은 눌리지 않게 막는다. (inert: 클릭과 키보드 포커스를 모두 막는다.)
// - 미리보기: 표시를 모두 없애 완성된 모습 그대로 보여 준다. (틀 자체는 남겨 블록이 다시 그려지지 않게 한다.)
// 라벨과 테두리를 놓을 자리는 음수 여백으로 블록 사이의 빈 공간에서 빌려 와서, 편집 모드와 미리보기의 배치가 같다.
export function EditableBlock({ section, children }: EditableBlockProps) {
   const selection = useOptionalEditorSelection();
   const enabled = selection?.enabled ?? false;
   const selected = enabled && selection?.selected?.id === section.id;
   const label = BLOCK_TYPE_LABEL[section.type];

   const select = () =>
      selection?.toggle({ id: section.id, type: section.type, variant: section.variant });

   const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      // 안쪽 요소가 아니라 틀 자체에 포커스가 있을 때만 반응한다.
      if (event.target !== event.currentTarget) return;
      if (event.key === 'Enter' || event.key === ' ') {
         event.preventDefault();
         select();
      }
   };

   return (
      <div
         data-editable-block
         role={enabled ? 'button' : undefined}
         tabIndex={enabled ? 0 : undefined}
         aria-pressed={enabled ? selected : undefined}
         aria-label={enabled ? `${label} 블록 ${selected ? '선택 해제' : '선택'}` : undefined}
         onClick={enabled ? select : undefined}
         onKeyDown={enabled ? handleKeyDown : undefined}
         className={
            enabled
               ? 'relative -mx-4 -mt-9 -mb-4 cursor-pointer px-4 pt-9 pb-4 outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40'
               : undefined
         }
      >
         {enabled && (
            <span
               aria-hidden
               className="pointer-events-none absolute top-4.5 left-4 text-[14px] leading-none font-bold text-brand-orange"
            >
               {label}
            </span>
         )}
         {selected && (
            <>
               <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-lg border-[3.5px] border-brand-orange"
               />
               <span
                  aria-hidden
                  className="pointer-events-none absolute -top-3.5 left-5 rounded-md bg-brand-orange px-3 py-1.5 text-sm leading-none font-bold text-white"
               >
                  선택됨
               </span>
            </>
         )}
         <div inert={enabled}>{children}</div>
      </div>
   );
}
