import type { CSSProperties } from 'react';
import type { ThemeConfig } from '../types';

// 테마를 고르기 전의 기본 모습. 흰 바탕에 회색 테두리, 강조색은 진한 회색이다.
export const DEFAULT_THEME: Required<ThemeConfig> = {
   bg: '#ffffff',
   text: '#1f2937',
   textMuted: '#6b7280',
   border: '#d1d5db',
   surface: '#ffffff',
   primary: '#374151',
   onPrimary: '#ffffff',
   radius: '6px',
};

// 저장 형태(의미 키)와 CSS 변수 이름의 대응. 변수 이름을 바꿀 때는 여기만 고친다.
const CSS_VAR_NAME: Record<keyof ThemeConfig, string> = {
   bg: '--site-bg',
   text: '--site-text',
   textMuted: '--site-text-muted',
   border: '--site-border',
   surface: '--site-surface',
   primary: '--site-primary',
   onPrimary: '--site-on-primary',
   radius: '--site-radius',
};

// 허용하는 값의 형식. 서버 렌더링 때 값이 style 속성에 그대로 들어가므로,
// 세미콜론 등이 섞인 값으로 다른 CSS가 끼어드는 것을 막기 위해 정해진 형식만 통과시킨다.
// 색은 #rgb, #rgba, #rrggbb, #rrggbbaa, 길이는 "6px"처럼 숫자(최대 세 자리)와 px이다.
const HEX_COLOR = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const PX_LENGTH = /^\d{1,3}px$/;

const VALUE_PATTERN: Record<keyof ThemeConfig, RegExp> = {
   bg: HEX_COLOR,
   text: HEX_COLOR,
   textMuted: HEX_COLOR,
   border: HEX_COLOR,
   surface: HEX_COLOR,
   primary: HEX_COLOR,
   onPrimary: HEX_COLOR,
   radius: PX_LENGTH,
};

// 사이트 래퍼의 style에 넣을 CSS 변수들. 빠졌거나 형식이 맞지 않는 값은 기본값으로 채운다.
export function themeToCssVars(theme: ThemeConfig): CSSProperties {
   const vars: Record<string, string> = {};
   for (const key of Object.keys(CSS_VAR_NAME) as (keyof ThemeConfig)[]) {
      const value = theme[key];
      vars[CSS_VAR_NAME[key]] =
         value !== undefined && VALUE_PATTERN[key].test(value) ? value : DEFAULT_THEME[key];
   }
   return vars as CSSProperties;
}
