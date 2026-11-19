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

// 값이 템플릿의 샘플 문구 그대로인지. 템플릿으로 시작한 사이트에서 고치지 않은 문구를 알려 주는 데 쓴다.
const SAMPLE_TEXTS: ReadonlySet<string> = new Set(
   Object.values(SAMPLE).filter((v) => typeof v === 'string'),
);
// 번호가 붙는 목록 샘플("메뉴 이름 1" 등)은 패턴으로 판단한다.
const NUMBERED_SAMPLE = /^(메뉴 이름 \d+)$/;

export function isTemplateSampleText(value: string | undefined): boolean {
   if (value === undefined) return false;
   const text = value.trim();
   return (
      SAMPLE_TEXTS.has(text) ||
      NUMBERED_SAMPLE.test(text) ||
      text === '메뉴 설명을 적어 주세요' ||
      text === '0,000원' ||
      SAMPLE.heroBadges.includes(text as (typeof SAMPLE.heroBadges)[number])
   );
}
