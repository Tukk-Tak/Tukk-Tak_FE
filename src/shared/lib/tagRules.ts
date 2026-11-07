export type TagError = 'DUPLICATE' | 'INVALID_CHARS' | 'TOO_LONG' | 'MAX_COUNT';

export interface TagLimits {
   maxTags: number;
   maxLength: number;
}

// 칩으로 확정할 때는 완성된 한글(가-힣), 영문, 숫자만 허용한다. (자음·모음만 있는 'ㅋㅋ'는 막는다.)
const COMMIT_PATTERN = /^[가-힣a-zA-Z0-9]+$/;
// 입력하는 도중에는 한글 조합 중인 자음·모음 조각(ㅁ, ㅏ 등)도 오류로 보지 않는다.
const TYPING_PATTERN = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/;
// 칩을 나누는 글자: 공백(스페이스·줄바꿈 등)과 쉼표
export const TAG_SEPARATOR = /[\s,]/;

// 한글 조합 방식을 통일하고, 앞뒤 공백과 앞쪽의 '#'을 지운다. ('#맛집', '##맛집' → '맛집', '#' → '')
export function normalizeTag(raw: string): string {
   return raw.normalize('NFC').trim().replace(/^#+/, '');
}

// 붙여넣은 글처럼 여러 태그가 섞인 글을 공백·쉼표·줄바꿈 기준으로 나눈다.
export function splitTags(raw: string): string[] {
   return raw.split(/[\s,]+/).filter(Boolean);
}

// 입력하는 도중에 허용되지 않는 문자가 들어 있는지.
export function hasInvalidTypingChars(draft: string): boolean {
   return !TYPING_PATTERN.test(draft);
}

export interface AddTagsResult {
   tags: string[];
   // 추가하지 못한 이유. 여러 개가 막혔으면 처음 만난 이유만 담는다.
   error: TagError | null;
   // 추가하지 못한 원래 입력들
   rejected: string[];
}

// 토큰들을 순서대로 태그로 추가한다. 규칙에 맞는 것만 추가하고, 막힌 것은 rejected로 돌려준다.
// 확인 순서: 문자 → 길이 → 중복 → 개수. ('#'만 입력한 토큰은 오류 없이 무시한다.)
export function addTagTokens(
   current: string[],
   tokens: string[],
   { maxTags, maxLength }: TagLimits,
): AddTagsResult {
   const tags = [...current];
   const rejected: string[] = [];
   let error: TagError | null = null;

   for (const token of tokens) {
      const tag = normalizeTag(token);
      if (!tag) continue;

      let reason: TagError | null = null;
      if (!COMMIT_PATTERN.test(tag)) reason = 'INVALID_CHARS';
      else if (tag.length > maxLength) reason = 'TOO_LONG';
      // 영문 대소문자는 같은 태그로 본다.
      else if (tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
         reason = 'DUPLICATE';
      } else if (tags.length >= maxTags) reason = 'MAX_COUNT';

      if (reason) {
         error ??= reason;
         rejected.push(token);
         continue;
      }
      tags.push(tag);
   }

   return { tags, error, rejected };
}
