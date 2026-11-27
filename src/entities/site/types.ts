import type { Section } from '@/entities/block';

// 사이트 테마. 키는 모두 선택이고, 빠진 값은 DEFAULT_THEME으로 채운다.
// 색 6개(bg, text, textMuted, border, surface, primary), 둥글기(radius), 글꼴(font) 8개가 사이트 디자인 값의 전부이다.
// primary 위에 올리는 글자색처럼 다른 값에서 계산할 수 있는 값은 저장하지 않는다.
export interface ThemeConfig {
   bg?: string;
   text?: string;
   textMuted?: string;
   border?: string;
   surface?: string; // 카드처럼 배경 위에 올라가는 면의 색
   primary?: string;
   radius?: string; // 이미지와 카드의 모서리 둥글기. "6px"처럼 숫자와 px로 쓴다. (편집 화면에서는 0~24px)
   font?: string; // 사이트 전체 글꼴의 id. 목록은 SITE_FONTS 에 있고, 모르는 값이면 기본 글꼴을 쓴다.
}

// 한 줄. 블록 1개(전체 폭) 또는 2개(50:50)
export interface Row {
   id: string;
   sections: [Section] | [Section, Section];
}

export interface SiteContent {
   theme: ThemeConfig;
   rows: Row[];
}
