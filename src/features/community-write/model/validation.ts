export const TITLE_MAX_LENGTH = 25;
export const CONTENT_MAX_LENGTH = 500;
export const TAG_MAX_COUNT = 5;
// 태그 하나의 최대 글자 수
export const TAG_MAX_LENGTH = 10;
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

const PHOTO_MIME_TYPES = ['image/jpeg', 'image/png'];
const PHOTO_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

export type PhotoErrorCode = 'type' | 'size';

// 사진이 올릴 수 있는 파일인지 확인한다. 형식은 MIME과 확장자를 모두 본다.
// TODO: 브라우저에서 보는 검사는 우회할 수 있다. 실제 연동에서는 서버가 파일 내용과 크기를 다시 검사해야 한다.
export function validatePhoto(file: File): PhotoErrorCode | null {
   const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? '';
   if (!PHOTO_MIME_TYPES.includes(file.type) || !PHOTO_EXTENSIONS.includes(extension)) {
      return 'type';
   }
   if (file.size > PHOTO_MAX_BYTES) return 'size';
   return null;
}
