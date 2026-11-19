import type {
   BlockType,
   FooterVariant,
   GalleryVariant,
   HeaderVariant,
   HeroVariant,
   ListVariant,
   Section,
   TextVariant,
} from '../types';

// 새로 추가한 블록이 처음에 담는 내용. 무엇을 입력할 자리인지 알 수 있는 안내 문구로 채운다.
// 한두 단어 자리는 짧은 이름, 문장 자리는 "~를 입력해 주세요" 말투이다.
// 사용자가 고치지 않고 배포하면 이 문구가 그대로 보이므로, 배포 기능을 만들 때 경고를 함께 둔다.
// TODO: 푸터 대체 문구는 AI 초안의 FOOTER_PLACEHOLDERS(features/ai-draft)와 같은 문구이다. 하나로 모을지 정한다.
const PLACEHOLDER = {
   brandName: '사이트 이름',
   heroTitle: '제목을 입력해 주세요',
   heroSubtitle: '소개 문구를 입력해 주세요',
   textTitle: '제목',
   textBody: '내용을 입력해 주세요',
   listTitle: '섹션 제목',
   itemName: '메뉴 이름',
   itemDescription: '설명',
   itemPrice: '가격',
   address: '가게 주소를 입력해 주세요',
   phone: '전화번호를 입력해 주세요',
   hours: '영업시간을 입력해 주세요',
} as const;

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
               items: [1, 2, 3].map((number) => ({
                  id: `${id}-item-${number}`,
                  name: PLACEHOLDER.itemName,
                  description: PLACEHOLDER.itemDescription,
                  price: PLACEHOLDER.itemPrice,
                  image: { url: '' },
               })),
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
