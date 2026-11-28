// 사이트 글꼴 6종. 사이트 전체에 한 가지만 적용한다.
// 실제 글꼴 파일은 src/app/layout.tsx 에서 next/font 로 불러오고, cssVar 는 그때 만든 변수 이름이다.
// (같은 서버에서 내려주는 글꼴이라 Chrome, Edge, 웨일에서 똑같이 보인다)
export const SITE_FONTS = [
   {
      id: 'noto-sans',
      label: 'Noto Sans KR',
      description: '고딕 · 기본',
      cssVar: '--font-noto-sans-kr',
      fallback: "'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
   },
   {
      id: 'noto-serif',
      label: 'Noto Serif KR',
      description: '명조 · 정갈함',
      cssVar: '--font-noto-serif-kr',
      fallback: "'Noto Serif KR', 'Batang', serif",
   },
   {
      id: 'gowun-dodum',
      label: 'Gowun Dodum',
      description: '부드러운 둥근 고딕',
      cssVar: '--font-gowun-dodum',
      fallback: "'Gowun Dodum', 'Malgun Gothic', sans-serif",
   },
   {
      id: 'gaegu',
      label: 'Gaegu',
      description: '손글씨',
      cssVar: '--font-gaegu',
      fallback: "'Gaegu', 'Malgun Gothic', cursive",
   },
   {
      id: 'jua',
      label: 'Jua',
      description: '굵고 둥근 제목체',
      cssVar: '--font-jua',
      fallback: "'Jua', 'Malgun Gothic', sans-serif",
   },
   {
      id: 'do-hyeon',
      label: 'Do Hyeon',
      description: '두껍고 힘 있는 고딕',
      cssVar: '--font-do-hyeon',
      fallback: "'Do Hyeon', 'Malgun Gothic', sans-serif",
   },
] as const;

export type SiteFont = (typeof SITE_FONTS)[number];
export type SiteFontId = SiteFont['id'];

export const DEFAULT_FONT_ID: SiteFontId = 'noto-sans';

export function findSiteFont(id: string | undefined): SiteFont | undefined {
   return SITE_FONTS.find((font) => font.id === id);
}

// font-family 에 넣을 값. 모르는 id 이면 undefined.
export function siteFontFamily(id: string | undefined): string | undefined {
   const font = findSiteFont(id);
   return font ? `var(${font.cssVar}), ${font.fallback}` : undefined;
}
