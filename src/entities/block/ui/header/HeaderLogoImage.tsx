'use client';

import { useImageLoad } from '../../model/useImageLoad';

// 로고 이미지. 상호명 글자 옆에 함께 놓이는 그림이라, 주소가 비어 있거나 불러오지 못하면 아무것도 그리지 않는다.
// (색 블록과 아이콘 같은 이미지 대체 화면은 쓰지 않는다. 이름 글자만 남는 편이 헤더에 더 자연스럽다.)
// scale은 로고의 크기 배율이다. 기본 높이(2.5rem)에 곱해서 높이를 정하고, 너비는 비율에 맞게 따라간다.
export function HeaderLogoImage({ url, scale = 1 }: { url: string; scale?: number }) {
   const { failed, imgRef, onError } = useImageLoad(url);
   const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;

   if (failed) return null;

   return (
      // 이름 글자가 바로 옆에 있어서 로고는 장식으로 보고 대체 글을 비운다.
      // 사용자가 올린 이미지의 호스트를 미리 알 수 없어 next/image 대신 img를 쓴다.
      // eslint-disable-next-line @next/next/no-img-element
      <img
         ref={imgRef}
         src={url}
         alt=""
         onError={onError}
         className="w-auto max-w-full object-contain"
         style={{ height: `${2.5 * safeScale}rem` }}
      />
   );
}
