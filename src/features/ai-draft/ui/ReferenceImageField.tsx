'use client';

import { Plus, X } from 'lucide-react';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useAiDraftForm } from '../model/AiDraftFormContext';
import { MAX_REFERENCE_IMAGES, REFERENCE_IMAGE_TYPES } from '../model/options';
import { FieldMessage } from '@/shared/ui/FieldMessage';

// 올린 이미지 한 장의 미리보기. 미리보기 주소는 메모리를 잡고 있으므로 바뀌거나 사라질 때 해제한다.
function ReferenceImagePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
   const [url, setUrl] = useState<string | null>(null);

   useEffect(() => {
      const objectUrl = URL.createObjectURL(file);
      setUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
   }, [file]);

   return (
      <li className="flex items-center gap-4 rounded-xl border border-brand-line p-3">
         <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-field-readonly">
            {url && (
               // 사용자가 올린 파일의 임시 주소라 next/image로 최적화할 수 없다.
               // eslint-disable-next-line @next/next/no-img-element
               <img src={url} alt="" className="size-full object-cover" />
            )}
         </div>
         <p className="min-w-0 flex-1 truncate text-sm text-brand-brown">{file.name}</p>
         <button
            type="button"
            aria-label={`${file.name} 삭제`}
            onClick={onRemove}
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-black/50 hover:bg-black/5 hover:text-black"
         >
            <X className="size-4" aria-hidden />
         </button>
      </li>
   );
}

// 참고 이미지(선택). 영역을 눌러 파일을 고르거나 끌어다 놓는다. 한도(MAX_REFERENCE_IMAGES)가 차면 올리는 영역은 사라진다.
export function ReferenceImageField() {
   const { values, update } = useAiDraftForm();
   const inputRef = useRef<HTMLInputElement>(null);
   const [dragging, setDragging] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const files = values.referenceImages;
   const full = files.length >= MAX_REFERENCE_IMAGES;

   const addFiles = (picked: File[]) => {
      const valid = picked.filter((file) => REFERENCE_IMAGE_TYPES.includes(file.type));
      const accepted = valid.slice(0, MAX_REFERENCE_IMAGES - files.length);

      if (valid.length < picked.length) {
         setError('올릴 수 없는 파일이에요. png, jpg, jpeg 이미지만 올려 주세요.');
      } else if (valid.length > accepted.length) {
         setError(`참고 이미지는 ${MAX_REFERENCE_IMAGES}개까지 올릴 수 있어요.`);
      } else {
         setError(null);
      }
      if (accepted.length > 0) update({ referenceImages: [...files, ...accepted] });
   };

   const handleDrop = (event: DragEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setDragging(false);
      addFiles([...event.dataTransfer.files]);
   };

   return (
      <div>
         <p className="text-sm font-bold text-brand-brown">
            참고 이미지
            <span className="ml-1 font-normal text-[#A6A09B]">(선택)</span>
         </p>

         {files.length > 0 && (
            <ul className="mt-3 space-y-2">
               {files.map((file, index) => (
                  <ReferenceImagePreview
                     key={`${file.name}-${file.lastModified}-${index}`}
                     file={file}
                     onRemove={() => {
                        setError(null);
                        update({ referenceImages: files.filter((_, i) => i !== index) });
                     }}
                  />
               ))}
            </ul>
         )}

         {!full && (
            <>
               <input
                  ref={inputRef}
                  type="file"
                  accept={REFERENCE_IMAGE_TYPES.join(',')}
                  multiple={MAX_REFERENCE_IMAGES > 1}
                  className="hidden"
                  onChange={(event) => {
                     addFiles([...(event.target.files ?? [])]);
                     // 같은 파일을 지웠다가 다시 고를 수 있도록 선택값을 비운다.
                     event.target.value = '';
                  }}
               />
               <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(event) => {
                     event.preventDefault();
                     setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`mt-3 flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-4 py-9 text-center transition-colors ${
                     dragging
                        ? 'border-brand-orange bg-brand-orange-light'
                        : 'border-brand-line bg-brand-cream/50 hover:border-brand-orange'
                  }`}
               >
                  <span className="flex items-center gap-1 text-sm font-bold text-brand-brown">
                     <Plus className="size-4" aria-hidden />
                     참고 이미지 올리기
                  </span>
                  <span className="text-xs text-[#A6A09B]">대표색을 뽑아 팔레트 참고로 써요</span>
                  <span className="text-xs text-[#A6A09B]">
                     눌러서 고르거나 끌어다 놓을 수 있어요 (png, jpg)
                  </span>
               </button>
            </>
         )}

         {error && <FieldMessage tone="error">{error}</FieldMessage>}
      </div>
   );
}
