import type { BlockType, Section } from '../types';

type VariantOf<T extends BlockType> = Extract<Section, { type: T }>['variant'];

interface VariantMeta<T extends BlockType> {
   value: VariantOf<T>;
   // 화면에 보이는 구조 이름
   label: string;
   // 반폭(한 줄에 두 개를 50:50으로 나란히)에 놓을 수 있는지. false이면 전체 폭 전용이다.
   half: boolean;
}

// 블록 종류별 구조(variant) 목록. 이름, 반폭 가능 여부의 기준이 되는 곳이다.
// 반폭 가능: 줄글 단일 컬럼형, 목록(좌우 교차형 제외), 갤러리 전체. 나머지는 전체 폭 전용이다.
export const BLOCK_VARIANTS: { [T in BlockType]: readonly VariantMeta<T>[] } = {
   header: [
      { value: 'horizontal', label: '가로형', half: false },
      { value: 'centered', label: '중앙형', half: false },
   ],
   hero: [
      { value: 'fullImage', label: '전면 이미지형', half: false },
      { value: 'split', label: '좌우 분할형', half: false },
      { value: 'textOnly', label: '텍스트형', half: false },
   ],
   text: [
      { value: 'single', label: '단일 컬럼형', half: true },
      { value: 'withImage', label: '이미지 병행형', half: false },
   ],
   list: [
      { value: 'card', label: '카드 그리드형', half: true },
      { value: 'row', label: '리스트 행형', half: true },
      { value: 'compact', label: '컴팩트 타일형', half: true },
      { value: 'zigzag', label: '좌우 교차형', half: false },
   ],
   gallery: [
      { value: 'grid', label: '균일 그리드형', half: true },
      { value: 'featured', label: '대표+썸네일형', half: true },
      { value: 'single', label: '단일 액자형', half: true },
   ],
   footer: [
      { value: 'simple', label: '심플형', half: false },
      { value: 'info', label: '정보형', half: false },
   ],
};

interface AnyVariantMeta {
   value: string;
   label: string;
   half: boolean;
}

export function getBlockVariants(type: BlockType): readonly AnyVariantMeta[] {
   return BLOCK_VARIANTS[type];
}

// 이 구조가 반폭에 놓일 수 있는지. 알 수 없는 값은 전체 폭 전용으로 본다.
export function isHalfWidthCapable(type: BlockType, variant: string): boolean {
   return getBlockVariants(type).some((meta) => meta.value === variant && meta.half);
}
