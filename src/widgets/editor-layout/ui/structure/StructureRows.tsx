'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { GripVertical, Trash2 } from 'lucide-react';
import type { Ref } from 'react';
import { BLOCK_TYPE_LABEL, getVariantLabel, type Section } from '@/entities/block';
import type { Row } from '@/entities/site';
import { getPairStatus, isPinnedType, type PairStatus } from '@/features/editor-site';
import { dndId, type Drop } from './dropResolution';

// 끄는 동안 줄 오른쪽에 보여 주는 "옆에 놓기" 자리의 문구. 'self'(끌고 있는 블록의 줄)와 'targetFull'은 자리를 보여 주지 않는다.
const ZONE_TEXT: Partial<Record<PairStatus, string>> = {
   ok: '옆에 놓기',
   targetFullOnly: '이 구조는 전체 폭 전용',
   activeFullOnly: '전체 폭 전용 블록이에요',
};

const PINNED_NOTICE = {
   header: '헤더는 맨 위에 고정돼요',
   footer: '푸터는 맨 아래에 고정돼요',
} as const;

export interface RowsProps {
   rows: Row[];
   selectedId: string | null;
   // 끌고 있는 블록. 없으면 끄는 중이 아니다.
   activeId: string | null;
   drop: Drop | null;
   // 줄 사이에 주황 선을 보여 줄 위치
   hint: { rowId: string; position: 'before' | 'after' } | null;
   onSelect: (sectionId: string) => void;
   onRemove: (sectionId: string) => void;
   onUnpair: (rowId: string) => void;
}

function mergeRefs<T>(...refs: Ref<T>[]) {
   return (node: T | null) => {
      refs.forEach((ref) => {
         if (typeof ref === 'function') ref(node);
         else if (ref) (ref as { current: T | null }).current = node;
      });
   };
}

interface ItemProps {
   section: Section;
   row: Row;
   selected: boolean;
   isActive: boolean;
   dragging: boolean;
   inGroup: boolean;
   // 이 블록 줄 오른쪽에 보여 줄 "옆에 놓기" 자리의 상태. 보여 주지 않으면 null이다.
   zone: { status: PairStatus; isOver: boolean } | null;
   onSelect: (sectionId: string) => void;
   onRemove: (sectionId: string) => void;
}

// 블록 하나. 핸들, 이름과 구조, 삭제 버튼이 있고, 끄는 동안에는 삭제 버튼 자리에 "옆에 놓기" 자리가 나온다.
function SectionItem({
   section,
   row,
   selected,
   isActive,
   dragging,
   inGroup,
   zone,
   onSelect,
   onRemove,
}: ItemProps) {
   const pinned = isPinnedType(section.type);
   const label = BLOCK_TYPE_LABEL[section.type];
   const drag = useDraggable({ id: dndId.section(section.id), disabled: pinned });
   // 나란한 줄 안의 블록은 같은 줄의 다른 블록 위에 놓아 좌우를 바꿀 수 있다.
   const item = useDroppable({
      id: dndId.item(section.id),
      disabled: !(inGroup && dragging && !isActive),
   });

   return (
      <div
         ref={mergeRefs(drag.setNodeRef, item.setNodeRef)}
         className={`flex items-center gap-1 border-l-[3px] py-2 pr-1 pl-2 ${
            selected ? 'border-brand-orange' : 'border-transparent'
         } ${isActive ? 'opacity-40' : ''}`}
      >
         <button
            type="button"
            ref={drag.setActivatorNodeRef}
            {...(pinned ? {} : { ...drag.attributes, ...drag.listeners })}
            disabled={pinned}
            title={
               pinned ? PINNED_NOTICE[section.type as keyof typeof PINNED_NOTICE] : '끌어서 옮기기'
            }
            aria-label={
               pinned
                  ? `${label} (${PINNED_NOTICE[section.type as keyof typeof PINNED_NOTICE]})`
                  : `${label} 블록 옮기기`
            }
            className={`flex size-6 shrink-0 touch-none items-center justify-center rounded text-[#A6A09B] ${
               pinned ? 'cursor-not-allowed opacity-40' : 'cursor-grab hover:text-black/60'
            }`}
         >
            <GripVertical className="size-4" aria-hidden />
         </button>

         <button
            type="button"
            onClick={() => onSelect(section.id)}
            aria-current={selected ? 'true' : undefined}
            className="flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-1 rounded px-1 py-0.5 text-left"
         >
            <span className="text-sm font-bold text-brand-brown">{label}</span>
            <span className="rounded bg-field-disabled px-1.5 py-0.5 text-[11px] text-[#79716B]">
               {getVariantLabel(section.type, section.variant)}
            </span>
         </button>

         {zone && ZONE_TEXT[zone.status] ? (
            <PairZone rowId={row.id} status={zone.status} isOver={zone.isOver} />
         ) : (
            !dragging && (
               <button
                  type="button"
                  onClick={() => onRemove(section.id)}
                  aria-label={`${label} 블록 삭제`}
                  title="삭제"
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#A6A09B] hover:bg-black/5 hover:text-black/70"
               >
                  <Trash2 className="size-4" aria-hidden />
               </button>
            )
         )}
      </div>
   );
}

// 그 줄 옆에 놓아 나란히 만드는 자리. 놓을 수 있으면 주황, 없으면 이유가 적힌 빨강이다.
function PairZone({
   rowId,
   status,
   isOver,
}: {
   rowId: string;
   status: PairStatus;
   isOver: boolean;
}) {
   const { setNodeRef } = useDroppable({ id: dndId.pair(rowId) });
   const ok = status === 'ok';

   return (
      <div
         ref={setNodeRef}
         className={`flex h-12 w-44 shrink-0 items-center justify-center rounded-md border border-dashed px-2 text-center text-xs font-bold ${
            ok
               ? `border-brand-orange text-brand-orange ${isOver ? 'bg-brand-orange/15' : 'bg-brand-orange-light/60'}`
               : 'border-[#E5484D] bg-[#FFF2F2] text-[#E5484D]'
         }`}
      >
         {ZONE_TEXT[status]}
      </div>
   );
}

// 한 줄. 줄 단위로 놓을 곳이 되고, 끄는 동안 앞이나 뒤에 들어갈 자리를 주황 선으로 보여 준다.
function RowBlock({
   row,
   hint,
   children,
}: {
   row: Row;
   hint: RowsProps['hint'];
   children: React.ReactNode;
}) {
   const { setNodeRef } = useDroppable({ id: dndId.row(row.id) });
   const line = hint?.rowId === row.id ? hint.position : null;

   return (
      <li ref={setNodeRef} className="relative">
         {line === 'before' && (
            <span className="absolute inset-x-0 -top-px z-10 h-0.5 rounded bg-brand-orange" />
         )}
         {children}
         {line === 'after' && (
            <span className="absolute inset-x-0 -bottom-px z-10 h-0.5 rounded bg-brand-orange" />
         )}
      </li>
   );
}

// 페이지 구성 목록. 혼자 있는 줄은 그대로, 나란히 놓인 줄은 "나란히 (50:50)" 상자로 묶어 보여 준다.
export function StructureRows({
   rows,
   selectedId,
   activeId,
   drop,
   hint,
   onSelect,
   onRemove,
   onUnpair,
}: RowsProps) {
   const dragging = activeId !== null;
   const overPairRowId = drop?.kind === 'pair' ? drop.rowId : null;

   return (
      <ul className="space-y-1">
         {rows.map((row) => {
            if (row.sections.length === 2) {
               return (
                  <RowBlock key={row.id} row={row} hint={hint}>
                     <div className="my-1 rounded-xl bg-brand-orange-light px-2 py-2">
                        <div className="flex items-center justify-between px-2 pb-1">
                           <span className="text-[11px] text-[#79716B]">나란히 (50:50)</span>
                           {!dragging && (
                              <button
                                 type="button"
                                 onClick={() => onUnpair(row.id)}
                                 className="cursor-pointer text-sm text-[#A6A09B] hover:text-black/70"
                              >
                                 나란히 해제
                              </button>
                           )}
                        </div>
                        {row.sections.map((section) => (
                           <SectionItem
                              key={section.id}
                              section={section}
                              row={row}
                              selected={selectedId === section.id}
                              isActive={activeId === section.id}
                              dragging={dragging}
                              inGroup
                              zone={null}
                              onSelect={onSelect}
                              onRemove={onRemove}
                           />
                        ))}
                     </div>
                  </RowBlock>
               );
            }

            const [section] = row.sections;
            const isActive = activeId === section.id;
            // 끌고 있는 블록을 이 줄 옆에 놓을 수 있는지. 놓을 수 없는 이유가 있으면 그 문구를 보여 준다.
            const status = activeId && !isActive ? getPairStatus(rows, activeId, row.id) : null;
            return (
               <RowBlock key={row.id} row={row} hint={hint}>
                  <SectionItem
                     section={section}
                     row={row}
                     selected={selectedId === section.id}
                     isActive={isActive}
                     dragging={dragging}
                     inGroup={false}
                     zone={status ? { status, isOver: overPairRowId === row.id } : null}
                     onSelect={onSelect}
                     onRemove={onRemove}
                  />
               </RowBlock>
            );
         })}
      </ul>
   );
}
