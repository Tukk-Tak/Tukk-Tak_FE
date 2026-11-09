import type { GalleryContent } from '../../types';
import { BlockImageFrame } from '../BlockImageFrame';
import { GalleryTiles, orPlaceholder } from './GalleryTiles';

// 대표+썸네일형: 첫 번째 사진을 가로 3 : 세로 2 프레임으로 크게, 나머지를 아래에 정사각 썸네일로 놓는다.
// 클릭 동작은 없고, 사진이 한 장이면 대표만 보인다.
export function FeaturedGallery({ content }: { content: GalleryContent }) {
   const [main, ...thumbnails] = orPlaceholder(content.images);

   return (
      <div className="flex flex-col gap-2">
         <BlockImageFrame image={main} alt="" className="aspect-3/2 w-full" />
         {thumbnails.length > 0 && <GalleryTiles images={thumbnails} />}
      </div>
   );
}
