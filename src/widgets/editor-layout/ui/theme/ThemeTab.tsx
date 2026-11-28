'use client';

import { useState } from 'react';
import { DEFAULT_THEME, SITE_FONTS, siteFontFamily, type SiteFontId } from '@/entities/site';
import { useEditorSite } from '@/features/editor-site';
import { normalizeHex } from '@/shared/lib/color';
import { ColorPickerModal } from '@/shared/ui/ColorPickerModal';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { EditorSection } from '../element/EditorSection';
import { useSliderBatch } from '../useSliderBatch';
import { COLOR_FIELDS, RADIUS_RANGE, parseRadius, pickColors, type ColorKey } from './themeFields';

// 사이트 테마 탭: 색 6개, 모서리 둥글기, 글꼴. 바꾸면 모든 블록에 한 번에 적용되고 캔버스에 바로 보인다.
// 되돌리기는 상단의 되돌리기/다시하기(예정)로 한다. 템플릿 없이 시작하거나 저장된 사이트를 여는 경우가 있어 "원래 색"이 없기 때문이다.
export function ThemeTab() {
   const theme = useEditorSite((state) => state.site.theme);
   const updateTheme = useEditorSite((state) => state.updateTheme);
   // 둥글기 슬라이더를 끄는 동안의 변경은 되돌리기 한 번으로 묶는다.
   const batchHandlers = useSliderBatch();
   const [picking, setPicking] = useState<ColorKey | null>(null);

   const colors = pickColors(theme, DEFAULT_THEME);
   const radius = parseRadius(theme.radius) ?? parseRadius(DEFAULT_THEME.radius) ?? 0;
   const fontId = (SITE_FONTS.find((font) => font.id === theme.font)?.id ??
      DEFAULT_THEME.font) as SiteFontId;

   const pickingField = COLOR_FIELDS.find((field) => field.key === picking);
   const usedColors = [
      ...new Set(
         COLOR_FIELDS.map(({ key }) => normalizeHex(colors[key])).filter(
            (hex): hex is string => hex !== null,
         ),
      ),
   ];

   return (
      <ScrollArea className="h-full" contentClassName="p-6">
         <EditorSection title="사이트 색상" note="원을 눌러 색을 골라요">
            <ul className="-mt-1">
               {COLOR_FIELDS.map(({ key, label, hint }) => (
                  <li
                     key={key}
                     className="flex items-center gap-3 border-t border-[#F3EBE0] py-3 first:border-t-0"
                  >
                     <button
                        type="button"
                        aria-label={`${label} 고르기`}
                        onClick={() => setPicking(key)}
                        className="size-9 shrink-0 cursor-pointer rounded-full border border-black/10 hover:outline-2 hover:outline-offset-2 hover:outline-brand-orange"
                        style={{ backgroundColor: colors[key] }}
                     />
                     <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold text-brand-brown">{label}</p>
                        <p className="text-[11px] break-keep text-[#A6A09B]">{hint}</p>
                        <p className="font-mono text-[11px] text-[#79716B] uppercase">
                           {colors[key]}
                        </p>
                     </div>
                  </li>
               ))}
            </ul>
         </EditorSection>

         <EditorSection title="모양">
            <div>
               <label
                  htmlFor="theme-radius"
                  className="flex items-center justify-between text-xs font-bold text-brand-brown"
               >
                  둥글기
                  <span className="font-normal text-[#79716B]">{radius}px</span>
               </label>
               <input
                  id="theme-radius"
                  type="range"
                  min={RADIUS_RANGE.min}
                  max={RADIUS_RANGE.max}
                  step={RADIUS_RANGE.step}
                  value={radius}
                  {...batchHandlers}
                  onChange={(event) => updateTheme({ radius: `${event.target.value}px` })}
                  className="mt-2 w-full cursor-pointer accent-brand-orange"
               />
               <p className="mt-1 text-[11px] text-[#A6A09B]">카드와 사진의 모서리에 적용돼요.</p>
            </div>
         </EditorSection>

         <EditorSection title="글꼴" note="사이트 전체에 적용돼요">
            <div role="group" aria-label="글꼴" className="grid gap-2.5">
               {SITE_FONTS.map((font) => {
                  const selected = font.id === fontId;
                  return (
                     <button
                        key={font.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => updateTheme({ font: font.id })}
                        className={`cursor-pointer rounded-xl border px-4 py-3 text-left transition-colors ${
                           selected
                              ? 'border-brand-orange bg-[#FFFAF5]'
                              : 'border-brand-line bg-white hover:border-brand-orange'
                        }`}
                     >
                        <span className="flex items-baseline justify-between text-xs font-bold text-brand-brown">
                           {font.label}
                           <span className="text-[11px] font-normal text-[#A6A09B]">
                              {font.description}
                           </span>
                        </span>
                        <span
                           className="mt-1.5 block text-lg text-[#2B2420]"
                           style={{ fontFamily: siteFontFamily(font.id) }}
                        >
                           우리 가게 이야기 Aa
                        </span>
                     </button>
                  );
               })}
            </div>
         </EditorSection>

         <p className="mt-2 text-center text-[11px] text-[#A6A09B]">
            변경 내용은 캔버스에 바로 보여요.
         </p>

         {pickingField && (
            <ColorPickerModal
               key={pickingField.key}
               title={`${pickingField.label} 고르기`}
               initialColor={normalizeHex(colors[pickingField.key]) ?? '#E8622C'}
               suggestions={usedColors}
               onConfirm={(hex) => {
                  updateTheme({ [pickingField.key]: hex.toLowerCase() });
                  setPicking(null);
               }}
               onClose={() => setPicking(null)}
            />
         )}
      </ScrollArea>
   );
}
