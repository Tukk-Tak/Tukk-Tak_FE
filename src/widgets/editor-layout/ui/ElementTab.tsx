'use client';

import { BLOCK_TYPE_LABEL, getVariantLabel } from '@/entities/block';
import { useEditorSelection } from '@/features/editor-selection';
import { ScrollArea } from '@/shared/ui/ScrollArea';

// "요소 편집" 탭. 위쪽에 선택한 블록의 종류와 구조를 보여 주고, 선택을 해제하는 버튼을 둔다.
// TODO: 구조 선택과 블록별 편집 항목(#33)은 이 아래 본문에 만든다. 지금은 선택 정보만 있다.
export function ElementTab() {
   const { selected, clear } = useEditorSelection();

   return (
      <div className="flex h-full flex-col">
         {selected && (
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-brand-line px-6 py-4">
               <div>
                  <p className="text-[11px] font-bold text-brand-orange">선택한 블록</p>
                  <p className="mt-0.5 flex items-baseline gap-2">
                     <span className="text-xl font-bold text-brand-brown">
                        {BLOCK_TYPE_LABEL[selected.type]}
                     </span>
                     <span className="text-xs text-[#A6A09B]">
                        · {getVariantLabel(selected.type, selected.variant)}
                     </span>
                  </p>
               </div>
               <button
                  type="button"
                  onClick={clear}
                  className="cursor-pointer text-sm text-[#A6A09B] hover:text-black/70"
               >
                  선택 해제
               </button>
            </div>
         )}
         <div className="min-h-0 flex-1">
            {/* 탭 본문이 길면 이 안에서만 스크롤된다. 여백(p-6)은 끝까지 스크롤했을 때 사라지지 않게 안쪽에 둔다. */}
            <ScrollArea className="h-full" contentClassName="p-6">
               <p className="text-sm text-black/40">
                  {selected
                     ? '요소 편집은 준비 중이에요.'
                     : '캔버스에서 블록을 선택하면 여기서 편집할 수 있어요.'}
               </p>
            </ScrollArea>
         </div>
      </div>
   );
}
