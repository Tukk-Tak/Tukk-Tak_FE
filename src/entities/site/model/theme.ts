import type { CSSProperties } from 'react';
import type { ThemeConfig } from '../types';

// 테마를 고르기 전의 기본 모습. 흰 바탕에 회색 테두리, 강조색은 진한 회색이다.
export const DEFAULT_THEME: Required<ThemeConfig> = {
   bg: '#ffffff',
   text: '#1f2937',
   textMuted: '#6b7280',
   border: '#d1d5db',
   primary: '#374151',
   onPrimary: '#ffffff',
};

// 저장 형태(의미 키)와 CSS 변수 이름의 대응. 변수 이름을 바꿀 때는 여기만 고친다.
const CSS_VAR_NAME: Record<keyof ThemeConfig, string> = {
   bg: '--site-bg',
   text: '--site-text',
   textMuted: '--site-text-muted',
   border: '--site-border',
   primary: '--site-primary',
   onPrimary: '--site-on-primary',
};

// 사이트 래퍼의 style에 넣을 CSS 변수들. 빠진 키는 기본값으로 채운다.
export function themeToCssVars(theme: ThemeConfig): CSSProperties {
   const vars: Record<string, string> = {};
   for (const key of Object.keys(CSS_VAR_NAME) as (keyof ThemeConfig)[]) {
      vars[CSS_VAR_NAME[key]] = theme[key] ?? DEFAULT_THEME[key];
   }
   return vars as CSSProperties;
}
