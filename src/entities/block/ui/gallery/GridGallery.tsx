import type { GalleryContent } from '../../types';
import { GalleryTiles, orPlaceholder } from './GalleryTiles';

// 균일 그리드형: 정사각 썸네일을 모두 같은 크기로 놓는다.
export function GridGallery({ content }: { content: GalleryContent }) {
   return <GalleryTiles images={orPlaceholder(content.images)} />;
}
