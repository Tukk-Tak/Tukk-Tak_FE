import type { GalleryContent } from '../../types';
import { BlockImageFrame } from '../BlockImageFrame';
import { orPlaceholder } from './GalleryTiles';

// 단일 액자형: 첫 번째 사진만 액자처럼 가운데에 놓는다. (나머지 사진 값은 보존하고 표시하지 않는다)
// 프레임은 가로 3 : 세로 2 고정이고, 최대 폭은 블록 폭의 62%로 제한한다.
export function SingleGallery({ content }: { content: GalleryContent }) {
   const [image] = orPlaceholder(content.images);

   return (
      <div className="mx-auto w-full max-w-[62%] rounded-site border border-site-border bg-site-surface p-2">
         <BlockImageFrame image={image} alt="" className="aspect-[3/2] w-full" />
      </div>
   );
}
