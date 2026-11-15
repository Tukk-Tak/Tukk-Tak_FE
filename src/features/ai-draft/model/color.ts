import { PALETTE_COLORS } from './options';

const PALETTE_HEXES: readonly string[] = PALETTE_COLORS.map((color) => color.hex);

// '#abc' 같은 줄임 표기도 '#AABBCC'로 맞춘다. 올바른 색이 아니면 null.
export function normalizeHex(value: string): string | null {
   const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
   if (!match) return null;
   const digits = match[1].length === 3 ? [...match[1]].map((c) => c + c).join('') : match[1];
   return `#${digits.toUpperCase()}`;
}

export function isPaletteColor(hex: string) {
   return PALETTE_HEXES.includes(hex);
}

// 배경색 위에 올릴 체크 표시 색. 밝은 색이면 어두운 글자, 어두운 색이면 흰 글자를 쓴다.
export function getCheckColor(hex: string) {
   const value = hex.slice(1);
   const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
   return (r * 299 + g * 587 + b * 114) / 1000 > 160 ? '#1E1E1E' : '#FFFFFF';
}
