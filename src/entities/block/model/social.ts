// SNS 주소에서 종류(kind)를 알아낸다. 푸터의 SNS 링크는 주소만 입력받고, 종류는 도메인으로 정한다.
// 목록에 없는 도메인은 빈 값으로 두며, 푸터는 이 경우 주소의 도메인 이름을 링크 이름으로 보여 준다.
// TODO: kind 목록은 백엔드와 합의 전 임시값이다. (footer.ts의 SOCIAL_LABEL과 같은 종류)
const DOMAIN_KIND: [RegExp, string][] = [
   [/(^|\.)instagram\.com$/, 'instagram'],
   [/(^|\.)facebook\.com$|(^|\.)fb\.com$/, 'facebook'],
   [/(^|\.)youtube\.com$|(^|\.)youtu\.be$/, 'youtube'],
   [/(^|\.)blog\.naver\.com$|(^|\.)tistory\.com$/, 'blog'],
   [/(^|\.)kakao\.com$/, 'kakao'],
   [/(^|\.)x\.com$|(^|\.)twitter\.com$/, 'X(트위터)'],
];

// http 또는 https 주소인지. 푸터는 이 두 가지만 링크로 보여 준다.
export function isHttpUrl(value: string): boolean {
   try {
      const url = new URL(value.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
   } catch {
      return false;
   }
}

export function inferSocialKind(value: string): string {
   if (!isHttpUrl(value)) return '';
   const hostname = new URL(value.trim()).hostname.toLowerCase();
   return DOMAIN_KIND.find(([pattern]) => pattern.test(hostname))?.[1] ?? '';
}
