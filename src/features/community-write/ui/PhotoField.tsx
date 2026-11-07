'use client';

import { TriangleAlert, Upload } from 'lucide-react';
import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { formatFileSize } from '@/shared/lib/formatFileSize';
import { Button } from '@/shared/ui/Button';
import { FormField } from '@/shared/ui/FormField';
import type { usePhotoPicker } from '../model/usePhotoPicker';
import { PHOTO_MAX_BYTES } from '../model/validation';

interface PhotoFieldProps {
   photo: ReturnType<typeof usePhotoPicker>;
   disabled: boolean;
}

const MAX_MB = PHOTO_MAX_BYTES / (1024 * 1024);

// 대표 사진 한 장을 올리는 영역. 비어 있음 / 미리보기 / 올릴 수 없는 파일(경고) 세 가지 상태가 있다.
// 영역을 누르거나 파일을 끌어다 놓아서 고를 수 있다.
export function PhotoField({ photo, disabled }: PhotoFieldProps) {
   const inputId = useId();
   const inputRef = useRef<HTMLInputElement>(null);
   const [dragging, setDragging] = useState(false);

   const openPicker = () => inputRef.current?.click();

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) photo.select(file);
      // 같은 파일을 다시 골라도 변경으로 인식되게 비운다.
      event.target.value = '';
   };

   const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);
      if (disabled) return;
      // 한 장만 올릴 수 있으므로 여러 장을 놓아도 첫 번째만 쓴다.
      const file = event.dataTransfer.files[0];
      if (file) photo.select(file);
   };

   return (
      <FormField label="사진" htmlFor={inputId} required>
         <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png"
            disabled={disabled}
            onChange={handleChange}
            className="sr-only"
         />

         <div
            onDragOver={(event) => {
               event.preventDefault();
               if (!disabled) setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
         >
            {photo.error ? (
               <div
                  role="alert"
                  className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-state-error bg-brand-orange-light/60 px-4 py-6 text-center"
               >
                  <TriangleAlert aria-hidden className="size-6 text-state-error" />
                  <p className="mt-1 text-xs font-bold text-brand-brown">
                     {photo.error.code === 'size'
                        ? `파일이 너무 커요. ${MAX_MB}MB 이하의 사진을 올려주세요.`
                        : 'JPG, PNG 파일만 올릴 수 있어요.'}
                  </p>
                  <p className="max-w-full truncate text-xs text-black/50">
                     선택한 파일{' '}
                     {photo.error.code === 'size'
                        ? formatFileSize(photo.error.size)
                        : photo.error.name}
                  </p>
                  <Button
                     variant="outline"
                     size="field"
                     disabled={disabled}
                     onClick={openPicker}
                     className="mt-2"
                  >
                     다른 사진 선택
                  </Button>
               </div>
            ) : photo.previewUrl ? (
               <div className="flex flex-col gap-4 rounded-xl border border-brand-line p-4 sm:flex-row sm:items-center">
                  {/* 내 컴퓨터의 파일을 가리키는 임시 주소(blob)라 next/image를 쓰지 않는다. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                     src={photo.previewUrl}
                     alt="선택한 대표 사진 미리보기"
                     className="aspect-3/2 w-full rounded-lg object-cover sm:w-48"
                  />
                  <div>
                     <p className="text-xs font-bold text-black">대표 사진</p>
                     <p className="mt-1 text-xs text-black/50">제목 아래 가장 위에 보여요.</p>
                     <div className="mt-3 flex items-center gap-3">
                        <Button
                           variant="outline"
                           size="field"
                           disabled={disabled}
                           onClick={openPicker}
                        >
                           사진 교체
                        </Button>
                        <button
                           type="button"
                           disabled={disabled}
                           onClick={photo.remove}
                           className="cursor-pointer text-sm text-black/40 hover:text-black hover:underline disabled:cursor-not-allowed"
                        >
                           사진 삭제
                        </button>
                     </div>
                  </div>
               </div>
            ) : (
               <button
                  type="button"
                  disabled={disabled}
                  onClick={openPicker}
                  className={`flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-10 text-center transition-colors disabled:cursor-not-allowed ${
                     dragging
                        ? 'border-brand-orange bg-brand-orange-light/60'
                        : 'border-brand-line hover:bg-brand-orange-light/30'
                  }`}
               >
                  <span className="flex items-center gap-1.5 text-xs font-bold text-brand-brown">
                     <Upload aria-hidden className="size-3.5" />
                     사진 1장을 올려주세요
                  </span>
                  <span className="text-xs text-black/40">
                     제목 아래 가장 위에 보여요 · JPG·PNG, 최대 {MAX_MB}MB
                  </span>
               </button>
            )}
         </div>
      </FormField>
   );
}
