'use client';

import type { ReactNode } from 'react';
import { useImageLoad } from '../../model/useImageLoad';

// 로고 이미지. 주소가 비어 있거나 불러오지 못하면 fallback(상호명 글자)으로 대신한다.
// 로고 자리가 색 블록과 아이콘으로 바뀌면 가게 이름이 보이지 않게 되어서, 헤더는 이미지 대체 화면 대신 글자를 쓴다.
export function HeaderLogoImage({
   url,
   alt,
   fallback,
}: {
   url: string;
   alt: string;
   fallback: ReactNode;
}) {
   const { failed, imgRef, onError } = useImageLoad(url);

   if (failed) return fallback;

   return (
      // 사용자가 올린 이미지의 호스트를 미리 알 수 없어 next/image 대신 img를 쓴다.
      // eslint-disable-next-line @next/next/no-img-element
      <img
         ref={imgRef}
         src={url}
         alt={alt}
         onError={onError}
         className="h-10 w-auto object-contain"
      />
   );
}
