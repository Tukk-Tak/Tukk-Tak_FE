'use client';

import { Plus } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { BLOCK_IMAGE_TYPES, type BlockImage } from '@/entities/block';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { ScaleSlider } from './ScaleSlider';

interface ImageFieldProps {
   id: string;
   image: BlockImage | undefined;
   onChange: (image: BlockImage | undefined) => void;
   // 이 구조에서 쓰지 않는 사진이면 안내 문구를 준다. 값은 지우지 않고 흐리게 보여 주며, 다른 구조로 바꾸면 다시 쓰인다.
   unusedNotice?: string;
   // 사진 크기 슬라이더의 이름. 주면 슬라이더를 보여 준다. (한 장이 크게 보이는 사진에만 쓴다)
   scaleLabel?: string;
}

// 사진 한 장을 올리고 바꾸고 지우는 입력. 클릭해서 고르거나 끌어다 놓을 수 있다.
// 올린 사진은 지금은 브라우저의 임시 주소로 보여 주므로 새로고침하면 사라진다.
// TODO: 사진 업로드 API가 생기면 올린 뒤 받은 주소로 바꾼다. (임시 주소는 그때 해제한다)
export function ImageField({ id, image, onChange, unusedNotice, scaleLabel }: ImageFieldProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const [dragging, setDragging] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const hasImage = Boolean(image?.url);
   const scale = image?.scale ?? 1;
   const unused = Boolean(unusedNotice);

   const pick = (file: File | undefined) => {
      if (!file) return;
      if (!(BLOCK_IMAGE_TYPES as readonly string[]).includes(file.type)) {
         setError('올릴 수 없는 파일이에요. png, jpg, jpeg 이미지만 올려 주세요.');
         return;
      }
      setError(null);
      // 바꿀 때 사진 크기는 그대로 이어 간다.
      onChange({ url: URL.createObjectURL(file), scale: image?.scale });
   };

   const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setDragging(false);
      pick(event.dataTransfer.files[0]);
   };

   return (
      <div>
         {unusedNotice && (
            <p className="mb-3 rounded-lg bg-field-readonly px-3 py-2.5 text-xs break-keep text-[#79716B]">
               {unusedNotice}
            </p>
         )}

         {/* 쓰지 않는 구조에서는 흐리게 하고 누를 수도 없게 한다. (포커스도 들어가지 않는다) */}
         <div className={unused ? 'opacity-50' : undefined} inert={unused}>
            <input
               ref={inputRef}
               id={id}
               type="file"
               accept={BLOCK_IMAGE_TYPES.join(',')}
               className="hidden"
               onChange={(event) => {
                  pick(event.target.files?.[0]);
                  // 같은 파일을 지웠다가 다시 고를 수 있도록 선택값을 비운다.
                  event.target.value = '';
               }}
            />

            {hasImage ? (
               <div>
                  <div className="mx-auto flex h-36 w-48 items-center justify-center overflow-hidden rounded-xl bg-field-readonly">
                     {/* 사용자가 올린 파일의 임시 주소라 next/image로 최적화할 수 없다. */}
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={image?.url} alt="" className="size-full object-contain" />
                  </div>
                  <div className="mt-3 flex justify-center gap-2">
                     <Button variant="outline" size="md" onClick={() => inputRef.current?.click()}>
                        사진 교체
                     </Button>
                     <Button
                        variant="outline"
                        size="md"
                        onClick={() => {
                           setError(null);
                           onChange(undefined);
                        }}
                     >
                        사진 삭제
                     </Button>
                  </div>
               </div>
            ) : (
               <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(event) => {
                     event.preventDefault();
                     setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-8 text-center transition-colors ${
                     dragging
                        ? 'border-brand-orange bg-brand-orange-light'
                        : 'border-brand-line bg-brand-cream/50 hover:border-brand-orange'
                  }`}
               >
                  <span className="flex items-center gap-1 text-sm font-bold text-brand-brown">
                     <Plus className="size-4" aria-hidden />
                     사진 추가
                  </span>
                  <span className="text-xs text-[#A6A09B]">
                     눌러서 고르거나 끌어다 놓을 수 있어요 (png, jpg)
                  </span>
               </button>
            )}

            {scaleLabel && hasImage && (
               <ScaleSlider
                  id={`${id}-scale`}
                  label={scaleLabel}
                  scale={scale}
                  onChange={(next) => image && onChange({ ...image, scale: next })}
               />
            )}
         </div>

         {error && <FieldMessage tone="error">{error}</FieldMessage>}
      </div>
   );
}
