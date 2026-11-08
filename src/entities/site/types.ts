import type { Section } from '@/entities/block';

// 사이트 테마. 키는 모두 선택이고, 빠진 값은 DEFAULT_THEME으로 채운다.
// 키 목록은 백엔드와 합의 전 임시값이다. (글꼴은 선택 가능한 목록이 정해진 뒤 추가)
export interface ThemeConfig {
   bg?: string;
   text?: string;
   textMuted?: string;
   border?: string;
   surface?: string; // 카드처럼 배경 위에 올라가는 면의 색
   primary?: string;
   onPrimary?: string; // primary 위에 올리는 글자색
   radius?: string; // 이미지와 카드의 모서리 둥글기. "6px"처럼 숫자와 px로 쓴다.
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
