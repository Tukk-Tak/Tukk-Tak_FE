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
   rectSortingStrategy,
   SortableContext,
   sortableKeyboardCoordinates,
   useSortable,
} from '@dnd-kit/sortable';
import { GripVertical, Plus, X } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import {
   BLOCK_IMAGE_TYPES,
   BLOCK_LIMITS,
   type BlockImage,
   type GallerySection,
} from '@/entities/block';
import { useEditorSite } from '@/features/editor-site';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { EditorSection } from '../EditorSection';
import { IMAGE_TYPE_ERROR, isAllowedImage, toBlockImage, toTranslate } from '../imageFiles';
import { ImageField } from '../ImageField';
import { ScaleSlider } from '../ScaleSlider';
import { StructureSection } from '../StructureSection';

// 대표+썸네일형은 첫 번째 사진이 크게 보인다는 안내. 균일 그리드형은 모든 사진이 같은 크기라 안내가 없다.
// (단일 액자형은 사진을 한 장만 쓰므로 SinglePhotoSection이 따로 맡는다)
const COVER_NOTICE: Partial<Record<GallerySection['variant'], string>> = {
   featured: '첫 번째 사진이 크게 보여요. 끌어서 순서를 바꿀 수 있어요.',
};

interface PhotoTileProps {
   id: string;
   index: number;
   image: BlockImage;
   // 첫 번째 사진이 대표로 쓰이는 구조인지. 맞으면 첫 사진에 "대표" 표시를 붙인다.
   showCover: boolean;
   onPick: (index: number) => void;
   onRemove: (index: number) => void;
}

// 사진 한 칸. 위쪽에 옮기기 핸들과 삭제 버튼이 있고, 비어 있는 칸은 눌러서 사진을 고른다.
function PhotoTile({ id, index, image, showCover, onPick, onRemove }: PhotoTileProps) {
   const {
      attributes,
      listeners,
      setActivatorNodeRef,
      setNodeRef,
      transform,
      transition,
      isDragging,
   } = useSortable({ id });
   const hasImage = Boolean(image.url);

   return (
      <li
         ref={setNodeRef}
         style={{ transform: toTranslate(transform), transition }}
         className={`relative aspect-square ${isDragging ? 'z-10 opacity-70' : ''}`}
      >
         {hasImage ? (
            <div className="size-full overflow-hidden rounded-lg bg-field-readonly">
               {/* 사용자가 올린 파일의 임시 주소라 next/image로 최적화할 수 없다. */}
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={image.url} alt="" draggable={false} className="size-full object-cover" />
            </div>
         ) : (
            <button
               type="button"
               onClick={() => onPick(index)}
               aria-label={`사진 ${index + 1} 추가`}
               className="flex size-full cursor-pointer items-center justify-center rounded-lg border border-dashed border-brand-line bg-brand-cream/50 text-[#A6A09B] hover:border-brand-orange hover:text-brand-orange"
            >
               <Plus className="size-5" aria-hidden />
            </button>
         )}

         <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-label={`사진 ${index + 1} 옮기기`}
            className="absolute top-1 left-1 flex size-6 cursor-grab touch-none items-center justify-center rounded-full bg-white/90 text-[#79716B] shadow-sm"
         >
            <GripVertical className="size-3.5" aria-hidden />
         </button>
         <button
            type="button"
            onClick={() => onRemove(index)}
            aria-label={`사진 ${index + 1} 삭제`}
            className="absolute top-1 right-1 flex size-6 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#79716B] shadow-sm hover:text-black"
         >
            <X className="size-3.5" aria-hidden />
         </button>
         {showCover && index === 0 && (
            <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-brand-orange px-1.5 py-0.5 text-[10px] leading-none font-bold text-white">
               대표
            </span>
         )}
      </li>
   );
}

interface SinglePhotoSectionProps {
   id: string;
   images: BlockImage[];
   onChange: (next: BlockImage[]) => void;
}

// 단일 액자형의 사진 영역. 사진은 한 장만 올릴 수 있고(첫 번째 칸), 올리고 교체하고 지우고 크기를 조절한다.
// 이미 올려 둔 다른 사진은 지우지 않고 남겨 두며(다른 구조로 바꾸면 다시 쓰인다), 쓰이지 않는다고 안내만 한다.
function SinglePhotoSection({ id, images, onChange }: SinglePhotoSectionProps) {
   const [first, ...rest] = images;
   const kept = rest.filter((image) => image.url);

   return (
      <EditorSection title="사진">
         <ImageField
            id={`${id}-single`}
            image={first}
            scaleLabel="사진 크기"
            // 지우면 비어 있는 칸으로 남겨서 뒤의 사진들의 순서가 바뀌지 않게 한다.
            onChange={(next) => onChange(next ? [next, ...rest] : [{ url: '' }, ...rest])}
         />
         <FieldMessage>단일 액자형은 사진을 한 장만 보여줘요.</FieldMessage>
         {kept.length > 0 && (
            <div>
               <p className="rounded-lg bg-field-readonly px-3 py-2.5 text-xs break-keep text-[#79716B]">
                  나머지 사진 {kept.length}장은 이 구조에서 쓰지 않아요. 다른 구조로 바꾸면 다시
                  보여요.
               </p>
               <ul className="mt-2 grid grid-cols-6 gap-1.5 opacity-50" inert>
                  {kept.map((image, index) => (
                     <li
                        key={index}
                        className="aspect-square overflow-hidden rounded bg-field-readonly"
                     >
                        {/* 사용자가 올린 파일의 임시 주소라 next/image로 최적화할 수 없다. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.url} alt="" className="size-full object-cover" />
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </EditorSection>
   );
}

// 갤러리 편집: 구조, 사진 목록(추가, 삭제, 끌어서 순서 변경), 대표 사진 크기.
// - 사진은 최대 12장이고, 구조를 고를 때 들어 있는 비어 있는 칸은 눌러서 채운다.
// - [사진 추가]로 여러 장을 한꺼번에 올리면 비어 있는 칸부터 채우고, 남는 것은 뒤에 붙는다.
// - 대표+썸네일형은 첫 번째 사진이 크게 보이므로, 그 사진에만 크기 슬라이더를 둔다.
// - 단일 액자형은 사진을 한 장만 올릴 수 있다. (SinglePhotoSection)
export function GalleryEditor({ section }: { section: GallerySection }) {
   const updateContent = useEditorSite((state) => state.updateContent);
   const { images } = section.content;
   const addInputRef = useRef<HTMLInputElement>(null);
   // DndContext의 id를 직접 정한다. 정하지 않으면 서버와 브라우저가 따로 번호를 매겨 접근성 속성(aria-describedby)이 달라지고 하이드레이션 경고가 난다.
   const dndId = useId();
   const slotInputRef = useRef<HTMLInputElement>(null);
   const slotIndexRef = useRef(0);
   const [error, setError] = useState<string | null>(null);

   const limit = BLOCK_LIMITS.galleryImageCount;
   const full = images.length >= limit;
   // 사진마다 정해진 고유 id. 사진 값에는 id가 없어서 이 화면에서 따로 들고 있는다.
   // 배열 순서(인덱스)를 id로 쓰면 순서를 바꾼 뒤에도 같은 자리의 핸들에 포커스가 남아서, 키보드로 이어서 옮길 때 다른 사진이 움직인다.
   // 순서를 바꾸거나 지우거나 추가할 때 id도 사진과 함께 옮긴다. 사진 수가 밖에서 바뀌어 어긋나면 모자란 자리는 임시 id로 채운다.
   const idPrefix = useId();
   const keySeq = useRef(0);
   const [keys, setKeys] = useState<string[]>(() =>
      images.map((_, index) => `${idPrefix}-init-${index}`),
   );
   const ids =
      keys.length === images.length
         ? keys
         : images.map((_, index) => keys[index] ?? `${idPrefix}-extra-${index}`);
   const newKey = () => `${idPrefix}-new-${keySeq.current++}`;
   const coverNotice = COVER_NOTICE[section.variant];
   const showCover = coverNotice !== undefined;
   const cover = images[0];

   const sensors = useSensors(
      useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
      useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
   );

   const setImages = (next: BlockImage[]) => updateContent(section.id, { images: next });
   // 사진과 id를 함께 바꾼다. (순서 변경, 삭제, 추가)
   const setImagesWithKeys = (nextImages: BlockImage[], nextKeys: string[]) => {
      setKeys(nextKeys);
      setImages(nextImages);
   };

   const handleDragEnd = ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return;
      const from = ids.indexOf(String(active.id));
      const to = ids.indexOf(String(over.id));
      setImagesWithKeys(arrayMove(images, from, to), arrayMove(ids, from, to));
   };

   // 여러 장을 올린다. 비어 있는 칸부터 채우고, 남는 것은 한도(12장)까지 뒤에 붙인다.
   const addFiles = (files: File[]) => {
      const valid = files.filter(isAllowedImage);
      const empty = images.filter((image) => !image.url).length;
      const accepted = valid.slice(0, empty + (limit - images.length));

      if (valid.length < files.length) setError(IMAGE_TYPE_ERROR);
      else if (valid.length > accepted.length)
         setError(`사진은 최대 ${limit}장까지 올릴 수 있어요.`);
      else setError(null);
      if (accepted.length === 0) return;

      const queue = [...accepted];
      const filled = images.map((image) =>
         !image.url && queue.length > 0 ? toBlockImage(queue.shift() as File) : image,
      );
      // 비어 있던 칸을 채운 사진은 그 칸의 id를 그대로 쓰고, 뒤에 붙는 사진에만 새 id를 준다.
      setImagesWithKeys(
         [...filled, ...queue.map((file) => toBlockImage(file))],
         [...ids, ...queue.map(() => newKey())],
      );
   };

   // 비어 있는 한 칸에 사진 한 장을 넣는다.
   const fillSlot = (file: File | undefined) => {
      if (!file) return;
      if (!isAllowedImage(file)) {
         setError(IMAGE_TYPE_ERROR);
         return;
      }
      setError(null);
      setImages(
         images.map((image, i) => (i === slotIndexRef.current ? toBlockImage(file) : image)),
      );
   };

   const accept = BLOCK_IMAGE_TYPES.join(',');

   return (
      <>
         <StructureSection section={section} />
         {section.variant === 'single' ? (
            <SinglePhotoSection id={section.id} images={images} onChange={setImages} />
         ) : (
            <EditorSection title="사진">
               <input
                  ref={addInputRef}
                  type="file"
                  accept={accept}
                  multiple
                  className="hidden"
                  onChange={(event) => {
                     addFiles([...(event.target.files ?? [])]);
                     event.target.value = '';
                  }}
               />
               <input
                  ref={slotInputRef}
                  type="file"
                  accept={accept}
                  className="hidden"
                  onChange={(event) => {
                     fillSlot(event.target.files?.[0]);
                     event.target.value = '';
                  }}
               />

               <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-brand-brown">사진 목록</span>
                  <span className="text-[#A6A09B]">
                     {images.length}/{limit}
                  </span>
               </div>

               {images.length > 0 && (
                  <DndContext
                     id={dndId}
                     sensors={sensors}
                     collisionDetection={closestCenter}
                     onDragEnd={handleDragEnd}
                  >
                     <SortableContext items={ids} strategy={rectSortingStrategy}>
                        <ul className="grid grid-cols-3 gap-2">
                           {images.map((image, index) => (
                              <PhotoTile
                                 key={ids[index]}
                                 id={ids[index]}
                                 index={index}
                                 image={image}
                                 showCover={showCover}
                                 onPick={(slot) => {
                                    slotIndexRef.current = slot;
                                    slotInputRef.current?.click();
                                 }}
                                 onRemove={(slot) =>
                                    setImagesWithKeys(
                                       images.filter((_, i) => i !== slot),
                                       ids.filter((_, i) => i !== slot),
                                    )
                                 }
                              />
                           ))}
                        </ul>
                     </SortableContext>
                  </DndContext>
               )}

               {!full && (
                  <button
                     type="button"
                     onClick={() => addInputRef.current?.click()}
                     className="flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-line bg-white text-sm text-brand-brown transition-colors hover:border-brand-orange hover:text-brand-orange"
                  >
                     <Plus className="size-4" aria-hidden />
                     사진 추가
                  </button>
               )}
               {error && <FieldMessage tone="error">{error}</FieldMessage>}
               {coverNotice && <FieldMessage>{coverNotice}</FieldMessage>}

               {showCover && cover?.url && (
                  <ScaleSlider
                     id={`${section.id}-cover-scale`}
                     label="대표 사진 크기"
                     scale={cover.scale ?? 1}
                     onChange={(scale) =>
                        setImages(images.map((image, i) => (i === 0 ? { ...image, scale } : image)))
                     }
                  />
               )}
            </EditorSection>
         )}
      </>
   );
}
