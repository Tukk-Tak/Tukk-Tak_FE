import type { ThemeConfig } from '@/entities/site';

export type ColorKey = 'bg' | 'text' | 'textMuted' | 'border' | 'surface' | 'primary';

// 색상 항목. hint 는 그 색이 사이트 어디에 쓰이는지 알려 준다.
export const COLOR_FIELDS: { key: ColorKey; label: string; hint: string }[] = [
   { key: 'bg', label: '배경색', hint: '사이트 전체 배경' },
   { key: 'text', label: '글자색', hint: '제목과 본문' },
   { key: 'textMuted', label: '보조 글자색', hint: '설명, 푸터 정보, 저작권' },
   { key: 'border', label: '테두리색', hint: '카드 테두리, 푸터 구분선' },
   { key: 'surface', label: '카드 배경색', hint: '카드와 타일의 배경' },
   { key: 'primary', label: '포인트 색', hint: '강조 특징 뱃지, 메뉴 가격, 푸터 링크 마우스 오버' },
];

export const RADIUS_RANGE = { min: 0, max: 24, step: 1 } as const;

// "12px" → 12. 형식이 맞지 않으면 null.
export function parseRadius(value: string | undefined): number | null {
   const match = /^(\d{1,3})px$/.exec(value ?? '');
   return match ? Number(match[1]) : null;
}

// 값이 없는 키를 채워 화면에 보여 줄 색 6개를 만든다.
export function pickColors(theme: ThemeConfig, fallback: Required<ThemeConfig>) {
   return Object.fromEntries(
      COLOR_FIELDS.map(({ key }) => [key, theme[key] ?? fallback[key]]),
   ) as Record<ColorKey, string>;
}
