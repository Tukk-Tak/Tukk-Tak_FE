'use client';

import { BlockThumbnail, getBlockVariants, type Section } from '@/entities/block';
import { useEditorSite } from '@/features/editor-site';
import { useToast } from '@/shared/ui/toastContext';

// 구조(variant) 선택. 구조마다 썸네일, 이름, "반폭 가능"과 "전체 폭 전용" 태그가 있다.
// 구조를 바꿔도 입력한 내용은 지우지 않는다. 전체 폭 전용 구조로 바꾸면 나란히 놓인 상태가 풀리고 토스트로 알린다.
export function VariantPicker({ section }: { section: Section }) {
   const setVariant = useEditorSite((state) => state.setVariant);
   const toast = useToast();
   const variants = getBlockVariants(section.type);
   // 반폭 가능한 구조와 전체 폭 전용 구조가 함께 있는 블록에서만 나란히 풀림을 미리 안내한다.
   const mixed = variants.some((meta) => meta.half) && variants.some((meta) => !meta.half);

   const choose = (variant: string) => {
      if (variant === section.variant) return;
      if (setVariant(section.id, variant)) {
         toast.show('전체 폭 전용 구조라 나란히 놓은 상태가 풀렸어요');
      }
   };

   return (
      <div>
         <div role="group" aria-label="구조 선택" className="grid grid-cols-2 gap-2.5">
            {variants.map((variant) => {
               const selected = variant.value === section.variant;
               return (
                  <button
                     key={variant.value}
                     type="button"
                     aria-pressed={selected}
                     onClick={() => choose(variant.value)}
                     className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-2 text-left transition-colors ${
                        selected
                           ? 'border-brand-orange bg-brand-cream'
                           : 'border-brand-line bg-white hover:border-brand-orange'
                     }`}
                  >
                     <BlockThumbnail
                        type={section.type}
                        variant={variant.value}
                        className="w-full"
                     />
                     <span className="px-0.5 pb-0.5">
                        <span className="block text-xs font-bold text-brand-brown">
                           {variant.label}
                        </span>
                        <span className="block text-[11px] text-[#A6A09B]">
                           {variant.half ? '반폭 가능' : '전체 폭 전용'}
                        </span>
                     </span>
                  </button>
               );
            })}
         </div>
         {mixed && (
            <p className="mt-3 text-[11px] break-keep text-[#A6A09B]">
               전체 폭 전용 구조를 고르면 나란히 놓인 상태가 풀려요.
            </p>
         )}
      </div>
   );
}
