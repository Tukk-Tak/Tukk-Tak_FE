'use client';

import {
   DndContext,
   DragOverlay,
   KeyboardSensor,
   PointerSensor,
   useSensor,
   useSensors,
   type DragEndEvent,
   type DragMoveEvent,
   type DragOverEvent,
   type DragStartEvent,
} from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BLOCK_TYPE_LABEL, getVariantLabel, type BlockType } from '@/entities/block';
import { useEditorSelection } from '@/features/editor-selection';
import { findSection, useEditorSite } from '@/features/editor-site';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { AddBlockSheet } from './AddBlockSheet';
import {
   collisionDetection,
   getInsertionHint,
   isSameDrop,
   resolveDrop,
   type Drop,
} from './dropResolution';
import { StructureRows } from './StructureRows';

// 캔버스에서 해당 블록이 보이도록 스크롤한다. 목록에서 누르거나 블록을 새로 추가한 직후에 쓴다.
function scrollBlockIntoView(sectionId: string) {
   window.setTimeout(() => {
      document
         .querySelector(`[data-block-id="${sectionId}"]`)
         ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
   }, 50);
}

// "섹션 구조" 탭. 사이트의 블록 구성(페이지 구성)을 보여 주고, 블록을 추가·삭제하고,
// 끌어서 순서를 바꾸거나 두 블록을 50:50으로 나란히 놓는다.
// - 줄 사이로 끌면 그 자리로 옮겨진다. (헤더는 맨 위, 푸터는 맨 아래에 고정이라 끌 수 없고 그 밖으로도 갈 수 없다)
// - 반폭 가능한 블록끼리는 줄 오른쪽의 "옆에 놓기" 자리에 놓아 나란히 만든다.
// - 나란히 놓인 줄 안에서 한 블록을 다른 블록 위에 놓으면 좌우가 바뀐다.
interface StructureTabProps {
   // 지금 이 탭이 열려 있는지. 다른 탭으로 옮겨 가면 블록 추가 시트를 닫는다.
   active: boolean;
}

export function StructureTab({ active }: StructureTabProps) {
   const rows = useEditorSite((state) => state.site.rows);
   const addSection = useEditorSite((state) => state.addSection);
   const removeSection = useEditorSite((state) => state.removeSection);
   const moveSectionToRow = useEditorSite((state) => state.moveSectionToRow);
   const pairSection = useEditorSite((state) => state.pairSection);
   const swapRow = useEditorSite((state) => state.swapRow);
   const unpairRow = useEditorSite((state) => state.unpairRow);
   const { selectedId, select, clear } = useEditorSelection();

   const [sheetOpen, setSheetOpen] = useState(false);
   const addButtonRef = useRef<HTMLButtonElement>(null);

   // 다른 탭으로 옮겨 가면 시트를 닫는다. 시트는 화면 전체 위에 띄워서, 이 탭이 숨겨져도 따라서 숨겨지지 않는다.
   useEffect(() => {
      if (!active) setSheetOpen(false);
   }, [active]);
   const [activeId, setActiveId] = useState<string | null>(null);
   const [drop, setDrop] = useState<Drop | null>(null);

   const sensors = useSensors(
      // 핸들을 눌렀다 떼는 클릭과 구분하려고 조금 움직였을 때부터 끌기로 본다.
      useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
      useSensor(KeyboardSensor),
   );

   const blockCount = useMemo(
      () => rows.reduce((sum, row) => sum + row.sections.length, 0),
      [rows],
   );
   const existingTypes = useMemo(
      () => new Set<BlockType>(rows.flatMap((row) => row.sections.map((section) => section.type))),
      [rows],
   );
   const hint = getInsertionHint(drop, rows, activeId);
   const activeSection = activeId ? (findSection(rows, activeId)?.section ?? null) : null;

   const sectionIdOf = (dndId: string | number) => String(dndId).replace(/^section:/, '');
   const resetDrag = () => {
      setActiveId(null);
      setDrop(null);
   };

   const handleDragStart = (event: DragStartEvent) => {
      setSheetOpen(false);
      setActiveId(sectionIdOf(event.active.id));
   };

   // 같은 대상 위에서 움직일 때도(예: 줄의 위쪽 절반에서 아래쪽 절반으로) 놓일 자리가 바뀌므로 움직일 때마다 다시 계산한다.
   // onDragOver는 대상이 바뀔 때만 불려서, 이것만으로는 표시와 실제 놓이는 자리가 어긋날 수 있다.
   const updateDrop = (event: DragMoveEvent | DragOverEvent) => {
      const next = resolveDrop(event, rows);
      setDrop((current) => (isSameDrop(current, next) ? current : next));
   };

   const handleDragEnd = (event: DragEndEvent) => {
      const result = resolveDrop(event, rows);
      const sectionId = sectionIdOf(event.active.id);
      resetDrag();
      if (!result) return;

      if (result.kind === 'pair') {
         if (result.status === 'ok') pairSection(sectionId, result.rowId);
      } else if (result.kind === 'swap') {
         swapRow(result.rowId);
      } else {
         moveSectionToRow(sectionId, result.rowId, result.position);
      }
   };

   // 목록에서 블록을 누르면 선택하고(패널은 요소 편집 탭으로 이동), 캔버스에서 그 블록이 보이게 한다.
   const handleSelect = (sectionId: string) => {
      select(sectionId);
      scrollBlockIntoView(sectionId);
   };

   const handleRemove = (sectionId: string) => {
      if (selectedId === sectionId) clear();
      removeSection(sectionId);
   };

   const handleAdd = (type: BlockType, variant: string) => {
      const id = addSection(type, variant);
      setSheetOpen(false);
      if (id) {
         select(id);
         scrollBlockIntoView(id);
      }
   };

   const announcements = {
      onDragStart: ({ active }: DragStartEvent) =>
         `${nameOf(sectionIdOf(active.id))}을(를) 집었어요.`,
      onDragOver: ({ active, over }: DragOverEvent) =>
         over ? `${nameOf(sectionIdOf(active.id))}을(를) 옮기는 중이에요.` : undefined,
      onDragEnd: ({ active }: DragEndEvent) => `${nameOf(sectionIdOf(active.id))}을(를) 놓았어요.`,
      onDragCancel: ({ active }: { active: { id: string | number } }) =>
         `${nameOf(sectionIdOf(active.id))} 옮기기를 취소했어요.`,
   };

   function nameOf(sectionId: string) {
      const section = findSection(rows, sectionId)?.section;
      return section
         ? `${BLOCK_TYPE_LABEL[section.type]}(${getVariantLabel(section.type, section.variant)})`
         : '블록';
   }

   return (
      <div className="relative h-full">
         <ScrollArea className="h-full" contentClassName="p-6">
            <div className="mb-4 flex items-baseline justify-between">
               <h2 className="text-lg font-bold text-brand-brown">페이지 구성</h2>
               <span className="text-sm text-[#A6A09B]">블록 {blockCount}개</span>
            </div>

            <DndContext
               sensors={sensors}
               collisionDetection={collisionDetection}
               onDragStart={handleDragStart}
               onDragOver={updateDrop}
               onDragMove={updateDrop}
               onDragEnd={handleDragEnd}
               onDragCancel={resetDrag}
               accessibility={{
                  announcements,
                  screenReaderInstructions: {
                     draggable:
                        '핸들에서 스페이스 키로 블록을 집고, 방향키로 옮긴 뒤 스페이스 키로 놓아요. Esc 키로 취소해요.',
                  },
               }}
            >
               <StructureRows
                  rows={rows}
                  selectedId={selectedId}
                  activeId={activeId}
                  drop={drop}
                  hint={hint}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                  onUnpair={unpairRow}
               />
               <DragOverlay>
                  {activeSection && (
                     <div className="flex w-64 flex-col items-start gap-1 rounded-lg border border-brand-orange bg-white px-4 py-2.5 shadow-card">
                        <span className="text-sm font-bold text-brand-brown">
                           {BLOCK_TYPE_LABEL[activeSection.type]}
                        </span>
                        <span className="rounded bg-field-disabled px-1.5 py-0.5 text-[11px] text-[#79716B]">
                           {getVariantLabel(activeSection.type, activeSection.variant)}
                        </span>
                     </div>
                  )}
               </DragOverlay>
            </DndContext>

            <button
               type="button"
               ref={addButtonRef}
               onClick={() => setSheetOpen((open) => !open)}
               aria-haspopup="dialog"
               aria-expanded={sheetOpen}
               className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-line bg-white text-sm font-medium text-brand-brown transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
               <Plus className="size-4" aria-hidden />
               블록 추가
            </button>
         </ScrollArea>

         {sheetOpen && active && (
            <AddBlockSheet
               existingTypes={existingTypes}
               onAdd={handleAdd}
               triggerRef={addButtonRef}
               onClose={(reason) => {
                  setSheetOpen(false);
                  // Esc로 닫았을 때만 포커스를 버튼으로 돌려 준다. 다른 곳을 눌러 닫을 때는 누른 곳의 포커스를 뺏지 않는다.
                  if (reason === 'escape') addButtonRef.current?.focus();
               }}
            />
         )}
      </div>
   );
}
