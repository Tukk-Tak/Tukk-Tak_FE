import type { GallerySection } from '../../types';
import { FeaturedGallery } from './FeaturedGallery';
import { GridGallery } from './GridGallery';
import { SingleGallery } from './SingleGallery';

// 세 variant 모두 반폭 가능. 같은 images 값을 공유하므로 variant를 바꿔도 사진이 사라지지 않는다.
export function GalleryBlock({ section }: { section: GallerySection }) {
   switch (section.variant) {
      case 'grid':
         return <GridGallery content={section.content} />;
      case 'featured':
         return <FeaturedGallery content={section.content} />;
      case 'single':
         return <SingleGallery content={section.content} />;
   }
}
