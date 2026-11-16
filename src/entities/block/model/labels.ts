import type { BlockType, Section } from '../types';

// 편집 화면에 보이는 블록 종류 이름. (캔버스의 블록 라벨, 요소 편집 탭의 제목)
export const BLOCK_TYPE_LABEL: Record<BlockType, string> = {
   header: '헤더',
   hero: '히어로',
   text: '줄글',
   list: '목록',
   gallery: '갤러리',
   footer: '푸터',
};

// 블록 종류별 구조(variant)의 이름. 저장하는 값(key)은 영문이고, 화면에는 이 이름을 보여 준다.
const VARIANT_LABEL: {
   [T in BlockType]: Record<Extract<Section, { type: T }>['variant'], string>;
} = {
   header: { horizontal: '가로형', centered: '중앙형' },
   hero: { fullImage: '전면 이미지형', split: '좌우 분할형', textOnly: '텍스트형' },
   text: { single: '단일 컬럼형', withImage: '이미지 병행형' },
   list: {
      card: '카드 그리드형',
      row: '리스트 행형',
      compact: '컴팩트 타일형',
      zigzag: '좌우 교차형',
   },
   gallery: { grid: '균일 그리드형', featured: '대표+썸네일형', single: '단일 액자형' },
   footer: { simple: '심플형', info: '정보형' },
};

// 구조(variant) 이름. 이름이 없는 값은 key를 그대로 돌려준다.
export function getVariantLabel(type: BlockType, variant: string): string {
   return (VARIANT_LABEL[type] as Record<string, string>)[variant] ?? variant;
}
