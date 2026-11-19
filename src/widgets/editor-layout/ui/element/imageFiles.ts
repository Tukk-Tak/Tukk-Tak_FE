import { BLOCK_IMAGE_TYPES, type BlockImage } from '@/entities/block';

export const IMAGE_TYPE_ERROR = '올릴 수 없는 파일이에요. png, jpg, jpeg 이미지만 올려 주세요.';

// 올릴 수 있는 사진 형식인지(png, jpg, jpeg).
export function isAllowedImage(file: File): boolean {
   return (BLOCK_IMAGE_TYPES as readonly string[]).includes(file.type);
}

// 올린 파일로 블록 사진 값을 만든다. 지금은 브라우저의 임시 주소를 쓰므로 새로고침하면 사라진다.
// TODO: 사진 업로드 API가 생기면 올린 뒤 받은 주소로 바꾸고, 쓰지 않는 임시 주소는 해제한다.
export function toBlockImage(file: File, scale?: number): BlockImage {
   return { url: URL.createObjectURL(file), scale };
}

// 드래그 중인 항목에 적용할 이동 값을 CSS transform 문자열로 바꾼다.
export function toTranslate(transform: { x: number; y: number } | null): string | undefined {
   return transform
      ? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)`
      : undefined;
}
