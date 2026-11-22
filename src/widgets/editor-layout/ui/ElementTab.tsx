'use client';

import { useMemo } from 'react';
import { BLOCK_TYPE_LABEL, getVariantLabel } from '@/entities/block';
import { useEditorSelection } from '@/features/editor-selection';
import { useEditorSite } from '@/features/editor-site';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { ElementEditor } from './element/ElementEditor';

// "요소 편집" 탭. 위쪽에 선택한 블록의 종류와 구조를 보여 주고 선택을 해제하는 버튼을 둔다.
// 그 아래는 블록 종류에 맞는 편집 화면(구조 선택, 내용, 이미지 등)이고, 고친 내용은 캔버스에 바로 반영된다.
export function ElementTab() {
   const { selectedId, clear } = useEditorSelection();
   const rows = useEditorSite((state) => state.site.rows);
   // 선택한 블록이 지워졌거나 찾을 수 없으면 선택하지 않은 것으로 본다.
   const selected = useMemo(
      () =>
         selectedId
            ? (rows.flatMap((row) => row.sections).find((section) => section.id === selectedId) ??
              null)
            : null,
      [rows, selectedId],
   );

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
            <ScrollArea className="h-full" contentClassName="px-6 py-4">
               {selected ? (
                  <>
                     <ElementEditor section={selected} />
                     <p className="mt-2 text-center text-[11px] text-[#A6A09B]">
                        변경 내용은 캔버스에 바로 보여요.
                     </p>
                  </>
               ) : (
                  <p className="text-sm text-black/40">
                     캔버스에서 블록을 선택하면 여기서 편집할 수 있어요.
                  </p>
               )}
            </ScrollArea>
         </div>
      </div>
   );
}
