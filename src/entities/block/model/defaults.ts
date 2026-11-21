import type {
   BlockType,
   FooterVariant,
   GalleryVariant,
   HeaderVariant,
   HeroVariant,
   ListItem,
   ListVariant,
   Section,
   TextVariant,
} from '../types';
import { PLACEHOLDER } from './placeholders';

// 새로 추가한 블록이 처음에 담는 내용. 기본 문구는 placeholders.ts에 있다.

// 갤러리는 구조가 드러나도록 구조마다 비어 있는 사진 자리를 이 개수만큼 둔다.
const GALLERY_SLOTS: Record<GalleryVariant, number> = { grid: 6, featured: 4, single: 1 };

// 블록 한 개를 만든다. id는 호출하는 쪽에서 정한다.
export function createSection(type: BlockType, variant: string, id: string): Section {
   switch (type) {
      case 'header':
         return {
            id,
            type,
            variant: variant as HeaderVariant,
            content: { brandName: PLACEHOLDER.brandName },
         };
      case 'hero':
         return {
            id,
            type,
            variant: variant as HeroVariant,
            content: {
               title: PLACEHOLDER.heroTitle,
               subtitle: PLACEHOLDER.heroSubtitle,
               image: variant === 'textOnly' ? undefined : { url: '' },
            },
         };
      case 'text':
         return {
            id,
            type,
            variant: variant as TextVariant,
            content: {
               title: PLACEHOLDER.textTitle,
               body: PLACEHOLDER.textBody,
               image: variant === 'withImage' ? { url: '' } : undefined,
            },
         };
      case 'list':
         return {
            id,
            type,
            variant: variant as ListVariant,
            content: {
               title: PLACEHOLDER.listTitle,
               items: [1, 2, 3].map((number) => createListItem(`${id}-item-${number}`)),
            },
         };
      case 'gallery':
         return {
            id,
            type,
            variant: variant as GalleryVariant,
            content: {
               images: Array.from(
                  { length: GALLERY_SLOTS[variant as GalleryVariant] ?? 1 },
                  () => ({
                     url: '',
                  }),
               ),
            },
         };
      case 'footer':
         return {
            id,
            type,
            variant: variant as FooterVariant,
            content: {
               brandName: PLACEHOLDER.brandName,
               address: PLACEHOLDER.address,
               phone: PLACEHOLDER.phone,
               hours: PLACEHOLDER.hours,
            },
         };
   }
}

// 목록에 새로 추가하는 항목. 블록을 추가할 때 들어가는 항목과 같은 기본 문구와 비어 있는 사진 자리를 가진다.
export function createListItem(id: string): ListItem {
   return {
      id,
      name: PLACEHOLDER.itemName,
      description: PLACEHOLDER.itemDescription,
      price: PLACEHOLDER.itemPrice,
      image: { url: '' },
   };
}
