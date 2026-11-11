export const MAX_QUERY_LENGTH = 50;

export type ParsedQuery =
   | { kind: 'none' }
   // 제목·닉네임·태그에서 부분 일치로 찾는다.
   | { kind: 'text'; text: string }
   // 태그 이름이 정확히 같은 글만 찾는다.
   | { kind: 'tag'; tag: string };

// 입력값을 검색에 쓰기 좋게 다듬는다. 한글 조합 방식을 통일하고, 연속 공백을 하나로 줄이고, 앞뒤 공백을 없애고, 길이를 제한한다.
export function normalizeQueryInput(raw: string): string {
   return raw.normalize('NFC').replace(/\s+/g, ' ').trim().slice(0, MAX_QUERY_LENGTH).trim();
}

// 검색어의 종류를 정한다.
// - '#맛집'처럼 #으로 시작하고 공백이 없으면 태그 검색이다. (앞의 #은 몇 개든 하나로 본다.)
// - '#'만 입력했거나 태그 이름이 비어 있으면 검색하지 않는다. (none)
// - '#맛집 분식'처럼 #으로 시작해도 공백이 섞이면 태그가 아니라 글자 검색으로 본다.
export function parseQuery(raw: string): ParsedQuery {
   const input = normalizeQueryInput(raw);
   if (!input) return { kind: 'none' };

   if (input.startsWith('#')) {
      const tag = input.replace(/^#+/, '');
      if (!tag) return { kind: 'none' };
      if (!/\s/.test(tag)) return { kind: 'tag', tag };
   }

   return { kind: 'text', text: input };
}
