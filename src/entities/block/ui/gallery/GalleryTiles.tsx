import type { BlockImage } from '../../types';
import { BlockImageFrame } from '../BlockImageFrame';

// 사진이 한 장도 없으면 자리를 지키도록 빈 주소 하나를 대신 둔다. (이미지 대체 화면으로 그려진다)
export const orPlaceholder = (images: BlockImage[]): BlockImage[] =>
   images.length > 0 ? images : [{ url: '' }];

// 정사각 썸네일 칸 모음. 한 칸의 크기는 항상 "4열(좁으면 2열)로 놓았을 때의 크기"로 고정하고,
// 사진이 모자라거나 마지막 줄이 남아도 칸을 늘리지 않고 가운데 정렬한다.
// 열 수는 블록 폭(컨테이너)이 기준이라 반폭이나 모바일에서는 자동으로 2열이 된다.
// 사진은 캡션이 없는 장식이라 alt를 비운다.
export function GalleryTiles({ images }: { images: BlockImage[] }) {
   return (
      <div className="flex flex-wrap justify-center gap-2">
         {images.map((image, index) => (
            <BlockImageFrame
               key={index}
               image={image}
               alt=""
               className="aspect-square w-[calc((100%-0.5rem)/2)] @2xl:w-[calc((100%-1.5rem)/4)]"
            />
         ))}
      </div>
   );
}
