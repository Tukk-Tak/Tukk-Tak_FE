import type { FooterContent } from '../types';

// SNS 종류(kind)를 화면에 보일 이름으로 바꾼다. kind 목록은 백엔드와 합의 전이라 임시이고, 목록에 없는 값은 입력한 그대로 보인다.
const SOCIAL_LABEL: Record<string, string> = {
   instagram: 'Instagram',
   facebook: 'Facebook',
   youtube: 'YouTube',
   blog: '블로그',
   kakao: '카카오톡',
   x: 'X',
};

export interface SocialLink {
   label: string;
   href: string;
}

// 사용자가 입력한 주소가 http, https일 때만 링크로 쓴다. (javascript: 같은 주소가 링크에 들어가는 것을 막는다)
function toSafeHref(value: string): string | null {
   try {
      const url = new URL(value.trim());
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
   } catch {
      return null;
   }
}

// 화면에 보일 SNS 링크 목록. 주소가 올바르지 않은 항목은 뺀다.
export function getSocialLinks(social: FooterContent['social']): SocialLink[] {
   const links: SocialLink[] = [];
   for (const { kind, url } of social ?? []) {
      const href = toSafeHref(url);
      if (!href) continue;
      const key = kind.trim();
      links.push({
         label: SOCIAL_LABEL[key.toLowerCase()] ?? (key || new URL(href).hostname),
         href,
      });
   }
   return links;
}

// 저작권 문구가 비어 있으면 상호명으로 만든다.
export function getCopyrightText({ copyright, brandName }: FooterContent): string {
   return copyright?.trim() || `© ${new Date().getFullYear()} ${brandName}`;
}

// 앞뒤 공백을 뺀 값이 비어 있으면 undefined를 돌려줘서, 값이 없는 줄을 화면에서 숨기기 쉽게 한다.
export function textOrUndefined(value: string | undefined): string | undefined {
   return value?.trim() || undefined;
}
