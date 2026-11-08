import type { BlockImage } from '../types';

// 프레임 크기는 className(비율, 너비)으로 정해 두고, 사진은 자르지 않고 그 안에 맞춰 넣는다.
// 사진 비율이 프레임과 다르면 빈 공간이 생기고(배경이 보임), scale 만큼 프레임 안에서 확대·축소한다.
export function BlockImageFrame({
   image,
   alt,
   className = '',
}: {
   image: BlockImage;
   alt: string;
   className?: string;
}) {
   const scale =
      image.scale !== undefined && Number.isFinite(image.scale) && image.scale > 0
         ? image.scale
         : 1;

   return (
      <div className={`overflow-hidden rounded-site ${className}`}>
         {/* 사용자가 올린 이미지의 호스트를 미리 알 수 없어 next/image 대신 img를 쓴다. */}
         {/* eslint-disable-next-line @next/next/no-img-element */}
         <img
            src={image.url}
            alt={alt}
            className="size-full object-contain"
            style={{ transform: `scale(${scale})` }}
         />
      </div>
   );
}
