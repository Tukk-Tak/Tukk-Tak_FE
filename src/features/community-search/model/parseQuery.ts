export const MAX_QUERY_LENGTH = 50;

export type ParsedQuery =
   | { kind: 'none' }
   // 제목·닉네임·태그에서 부분 일치로 찾는다.
   | { kind: 'text'; text: string }
   // 태그에서만 부분 일치로 찾는다.
   | { kind: 'tag'; tag: string };

// 입력값을 검색에 쓰기 좋게 다듬는다. 한글 조합 방식을 통일하고, 연속 공백을 하나로 줄이고, 앞뒤 공백을 없애고, 길이를 제한한다.
export function normalizeQueryInput(raw: string): string {
   return raw.normalize('NFC').replace(/\s+/g, ' ').trim().slice(0, MAX_QUERY_LENGTH).trim();
}

// 검색어의 종류를 정한다.
// - '#맛집'처럼 #으로 시작하면 태그 검색이다. 서버도 #으로 시작하면 #을 떼고 태그에서만 찾으므로 같은 기준을 쓴다. (앞의 #은 몇 개든 하나로 본다.)
// - '#맛집 분식'처럼 공백이 섞여도 서버는 그대로 태그로 찾으므로 태그 검색으로 본다.
// - '#'만 입력했거나 태그 이름이 비어 있으면 검색하지 않는다. (none, 서버도 전체 조회로 처리한다.)
export function parseQuery(raw: string): ParsedQuery {
   const input = normalizeQueryInput(raw);
   if (!input) return { kind: 'none' };

   if (input.startsWith('#')) {
      const tag = input.replace(/^#+/, '').trim();
      return tag ? { kind: 'tag', tag } : { kind: 'none' };
   }

   return { kind: 'text', text: input };
}
