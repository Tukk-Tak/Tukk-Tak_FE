import type { ListItem } from '@/entities/block';

// 템플릿에 들어가는 샘플 문구. 업종과 상관없이 쓸 수 있는 중립 문구이고, 사용자가 에디터에서 바꿔 쓴다.
// 사진 주소는 비워 두어서, 사진 자리는 이미지 대체 화면으로 보인다.
export const SAMPLE = {
   brandName: '우리 가게 이름',
   heroTitle: '우리 가게를 소개하는 한 줄',
   heroSubtitle: '가게의 특징과 분위기를 짧게 적어 주세요',
   heroBadges: ['대표 특징 1', '대표 특징 2'],
   storyTitle: '우리 가게 이야기',
   storyBody: '가게를 시작한 이유와 소개하고 싶은 이야기를 적어 주세요.',
   address: '주소를 입력해 주세요',
   phone: '연락처를 입력해 주세요',
   hours: '영업시간을 입력해 주세요',
} as const;

// 목록 샘플 항목. 이름만 번호를 붙여 구분한다. withImage가 true이면 사진 자리도 함께 둔다.
export function sampleItems(count: number, withImage: boolean): ListItem[] {
   return Array.from({ length: count }, (_, index) => ({
      id: `item-${index + 1}`,
      name: `메뉴 이름 ${index + 1}`,
      description: '메뉴 설명을 적어 주세요',
      price: '0,000원',
      ...(withImage ? { image: { url: '' } } : {}),
   }));
}

// 사진 자리만 있는 갤러리 샘플.
export function sampleImages(count: number) {
   return Array.from({ length: count }, () => ({ url: '' }));
}
