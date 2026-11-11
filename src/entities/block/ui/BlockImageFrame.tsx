'use client';

import { useImageLoad } from '../model/useImageLoad';
import type { BlockImage } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';

// 프레임 크기는 className(비율, 너비)으로 정해 두고, 사진은 자르지 않고 그 안에 맞춰 넣는다.
// 사진 비율이 프레임과 다르면 빈 공간이 생기고(배경이 보임), scale 만큼 프레임 안에서 확대·축소한다.
// 주소가 비어 있거나 사진을 불러오지 못하면 같은 크기의 대체 화면(ImagePlaceholder)을 보여 준다.
export function BlockImageFrame({
   image,
   alt,
   className = '',
}: {
   image: BlockImage;
   alt: string;
   className?: string;
}) {
   const { failed, imgRef, onError } = useImageLoad(image.url);
   const scale =
      image.scale !== undefined && Number.isFinite(image.scale) && image.scale > 0
         ? image.scale
         : 1;

   return (
      <div className={`overflow-hidden rounded-site ${className}`}>
         {failed ? (
            <ImagePlaceholder />
         ) : (
            <>
               {/* 사용자가 올린 이미지의 호스트를 미리 알 수 없어 next/image 대신 img를 쓴다. */}
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
                  ref={imgRef}
                  src={image.url}
                  alt={alt}
                  onError={onError}
                  className="size-full object-contain"
                  style={{ transform: `scale(${scale})` }}
               />
            </>
         )}
      </div>
   );
}
