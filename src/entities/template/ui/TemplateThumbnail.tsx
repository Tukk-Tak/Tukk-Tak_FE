import type { TemplateId } from '../types';
import { BlankThumbnail } from './BlankThumbnail';
import { CozyThumbnail } from './thumbnails/CozyThumbnail';
import { MenuThumbnail } from './thumbnails/MenuThumbnail';
import { PhotoThumbnail } from './thumbnails/PhotoThumbnail';

// 템플릿마다 코드로 그린 미리보기 그림. 템플릿을 추가할 때 case를 하나씩 추가한다.
export function TemplateThumbnail({ id }: { id: TemplateId }) {
   switch (id) {
      case 'cozy':
         return <CozyThumbnail />;
      case 'menu':
         return <MenuThumbnail />;
      case 'photo':
         return <PhotoThumbnail />;
      case 'blank':
         return <BlankThumbnail />;
   }
}
