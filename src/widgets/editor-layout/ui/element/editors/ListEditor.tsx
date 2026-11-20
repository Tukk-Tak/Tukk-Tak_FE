'use client';

import {
   closestCenter,
   DndContext,
   KeyboardSensor,
   PointerSensor,
   useSensor,
   useSensors,
   type DragEndEvent,
} from '@dnd-kit/core';
import {
   arrayMove,
   SortableContext,
   sortableKeyboardCoordinates,
   useSortable,
   verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, ImageIcon, Plus, X } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import {
   BLOCK_IMAGE_TYPES,
   BLOCK_LIMITS,
   createListItem,
   type ListItem,
   type ListSection,
} from '@/entities/block';
import { useEditorSite } from '@/features/editor-site';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { EditorSection } from '../EditorSection';
import { TextField } from '../fields';
import { IMAGE_TYPE_ERROR, isAllowedImage, toBlockImage, toTranslate } from '../imageFiles';
import { StructureSection } from '../StructureSection';

interface ItemCardProps {
   item: ListItem;
   index: number;
   // 이 구조에서 항목 사진을 쓰는지. 쓰지 않으면 값은 남기고 흐리게 보여 준다.
   usesImage: boolean;
   onChange: (id: string, patch: Partial<ListItem>) => void;
   onRemove: (id: string) => void;
   onError: (message: string | null) => void;
}

// 목록 항목 하나. 핸들로 옮기고, 사진, 이름(필수), 가격, 설명을 입력하고, ✕로 지운다.
function ItemCard({ item, index, usesImage, onChange, onRemove, onError }: ItemCardProps) {
   const {
      attributes,
      listeners,
      setActivatorNodeRef,
      setNodeRef,
      transform,
      transition,
      isDragging,
   } = useSortable({ id: item.id });
   const fileRef = useRef<HTMLInputElement>(null);
   const hasImage = Boolean(item.image?.url);
   const number = index + 1;

   return (
      <li
         ref={setNodeRef}
         style={{ transform: toTranslate(transform), transition }}
         className={`rounded-xl bg-brand-cream p-3 ${isDragging ? 'relative z-10 opacity-70' : ''}`}
      >
         <div className="flex items-start gap-2">
            <button
               type="button"
               ref={setActivatorNodeRef}
               {...attributes}
               {...listeners}
               aria-label={`항목 ${number} 옮기기`}
               className="mt-1 flex size-6 shrink-0 cursor-grab touch-none items-center justify-center rounded text-[#A6A09B] hover:text-black/60"
            >
               <GripVertical className="size-4" aria-hidden />
            </button>

            <div className={`shrink-0 ${usesImage ? '' : 'opacity-50'}`} inert={!usesImage}>
               <input
                  ref={fileRef}
                  type="file"
                  accept={BLOCK_IMAGE_TYPES.join(',')}
                  className="hidden"
                  onChange={(event) => {
                     const file = event.target.files?.[0];
                     event.target.value = '';
                     if (!file) return;
                     if (!isAllowedImage(file)) {
                        onError(IMAGE_TYPE_ERROR);
                        return;
                     }
                     onError(null);
                     onChange(item.id, { image: toBlockImage(file, item.image?.scale) });
                  }}
               />
               <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  aria-label={`항목 ${number} 사진 ${hasImage ? '교체' : '추가'}`}
                  className="flex size-14 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-brand-line bg-white text-[#A6A09B] hover:border-brand-orange"
               >
                  {hasImage ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={item.image?.url} alt="" className="size-full object-cover" />
                  ) : (
                     <ImageIcon className="size-5" aria-hidden />
                  )}
               </button>
               {hasImage && (
                  <button
                     type="button"
                     onClick={() => onChange(item.id, { image: undefined })}
                     className="mt-1 w-full cursor-pointer text-center text-[11px] text-[#A6A09B] hover:text-black/70"
                  >
                     사진 삭제
                  </button>
               )}
            </div>

            <div className="grid min-w-0 flex-1 grid-cols-[1fr_5.5rem] gap-x-2 gap-y-3">
               <TextField
                  id={`${item.id}-name`}
                  label="이름"
                  required
                  value={item.name}
                  maxLength={BLOCK_LIMITS.itemName}
                  onChange={(value) => onChange(item.id, { name: value })}
               />
               <TextField
                  id={`${item.id}-price`}
                  label="가격"
                  optional
                  value={item.price}
                  maxLength={BLOCK_LIMITS.itemPrice}
                  onChange={(value) => onChange(item.id, { price: value || undefined })}
               />
               <div className="col-span-2">
                  <TextField
                     id={`${item.id}-description`}
                     label="설명"
                     optional
                     value={item.description}
                     maxLength={BLOCK_LIMITS.itemDescription}
                     onChange={(value) => onChange(item.id, { description: value || undefined })}
                  />
               </div>
            </div>

            <button
               type="button"
               onClick={() => onRemove(item.id)}
               aria-label={`항목 ${number} 삭제`}
               className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#A6A09B] hover:bg-black/5 hover:text-black/70"
            >
               <X className="size-4" aria-hidden />
            </button>
         </div>
      </li>
   );
}

// 목록 편집: 구조, 섹션 제목(선택), 항목(추가, 삭제, 끌어서 순서 변경).
// 항목은 최대 30개이고, 이름은 필수이며 가격과 설명은 선택이다.
// 항목 사진은 카드 그리드형, 리스트 행형, 좌우 교차형에서 쓰이고 컴팩트 타일형에서는 값을 남긴 채 흐리게 보여 준다.
export function ListEditor({ section }: { section: ListSection }) {
   const updateContent = useEditorSite((state) => state.updateContent);
   const { title, items } = section.content;
   const [error, setError] = useState<string | null>(null);
   // DndContext의 id를 직접 정한다. 정하지 않으면 서버와 브라우저가 따로 번호를 매겨 접근성 속성(aria-describedby)이 달라지고 하이드레이션 경고가 난다.
   const dndId = useId();

   const limit = BLOCK_LIMITS.listItemCount;
   const full = items.length >= limit;
   const usesImage = section.variant !== 'compact';
   const ids = items.map((item) => item.id);

   const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
   );

   const setItems = (next: ListItem[]) => updateContent(section.id, { items: next });

   const patchItem = (id: string, patch: Partial<ListItem>) =>
      setItems(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));

   const handleDragEnd = ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;
      setItems(arrayMove(items, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
   };

   return (
      <>
         <StructureSection section={section} />
         <EditorSection title="내용">
            <TextField
               id={`${section.id}-title`}
               label="섹션 제목"
               optional
               value={title}
               maxLength={BLOCK_LIMITS.listTitle}
               onChange={(value) => updateContent(section.id, { title: value || undefined })}
            />

            <div className="flex items-baseline justify-between text-xs">
               <span className="font-bold text-brand-brown">항목</span>
               <span className="text-[#A6A09B]">
                  {items.length}/{limit}
               </span>
            </div>

            {!usesImage && (
               <p className="rounded-lg bg-field-readonly px-3 py-2.5 text-xs break-keep text-[#79716B]">
                  이 구조에서는 항목 이미지를 쓰지 않아요. 입력한 사진은 다른 구조로 바꾸면 다시
                  보여요.
               </p>
            )}

            {items.length > 0 && (
               <DndContext
                  id={dndId}
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
               >
                  <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                     <ul className="space-y-2.5">
                        {items.map((item, index) => (
                           <ItemCard
                              key={item.id}
                              item={item}
                              index={index}
                              usesImage={usesImage}
                              onChange={patchItem}
                              onRemove={(id) => setItems(items.filter((entry) => entry.id !== id))}
                              onError={setError}
                           />
                        ))}
                     </ul>
                  </SortableContext>
               </DndContext>
            )}

            {error && <FieldMessage tone="error">{error}</FieldMessage>}

            {full ? (
               <FieldMessage>항목은 최대 {limit}개까지 추가할 수 있어요.</FieldMessage>
            ) : (
               <button
                  type="button"
                  onClick={() =>
                     setItems([...items, createListItem(`item-${crypto.randomUUID().slice(0, 8)}`)])
                  }
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-line bg-white text-sm text-brand-brown transition-colors hover:border-brand-orange hover:text-brand-orange"
               >
                  <Plus className="size-4" aria-hidden />
                  항목 추가
               </button>
            )}
         </EditorSection>
      </>
   );
}
