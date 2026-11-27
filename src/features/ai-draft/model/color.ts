import { PALETTE_COLORS } from './options';

const PALETTE_HEXES: readonly string[] = PALETTE_COLORS.map((color) => color.hex);

export function isPaletteColor(hex: string) {
   return PALETTE_HEXES.includes(hex);
}
