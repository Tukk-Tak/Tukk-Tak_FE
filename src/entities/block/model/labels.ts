import type { BlockType } from '../types';
import { getBlockVariants } from './variants';

// 편집 화면에 보이는 블록 종류 이름. (캔버스의 블록 라벨, 요소 편집 탭의 제목, 블록 추가 목록)
export const BLOCK_TYPE_LABEL: Record<BlockType, string> = {
   header: '헤더',
   hero: '히어로',
   text: '줄글',
   list: '목록',
   gallery: '갤러리',
   footer: '푸터',
};

// 블록 추가 목록에서 종류 이름 아래에 보여 주는 한 줄 설명.
export const BLOCK_TYPE_DESCRIPTION: Record<BlockType, string> = {
   header: '가게 이름과 로고를 보여줘요',
   hero: '첫 화면에서 한마디로 소개해요',
   text: '가게 이야기를 담아요',
   list: '메뉴나 상품을 나열해요',
   gallery: '사진을 다양한 구조로 보여줘요',
   footer: '주소와 연락처, 영업시간을 담아요',
};

// 구조(variant) 이름. 이름이 없는 값은 key를 그대로 돌려준다.
export function getVariantLabel(type: BlockType, variant: string): string {
   return getBlockVariants(type).find((meta) => meta.value === variant)?.label ?? variant;
}
