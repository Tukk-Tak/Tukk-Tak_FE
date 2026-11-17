import { Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { ButtonLink } from '@/shared/ui/ButtonLink';

interface StartCardProps {
   icon: ReactNode;
   title: string;
   description: string;
   // 카드 아래쪽의 보조 안내. (예: 걸리는 시간, AI 횟수)
   note: ReactNode;
   buttonLabel: string;
   href: string;
   // 추천하는 시작 방식(제목 옆에 "추천" 라벨을 붙이고, 버튼을 주황색으로 채운다)
   recommended?: boolean;
   selected: boolean;
   onSelect: () => void;
}

// 시작 방식 한 장. 카드를 누르면 선택(다시 누르면 해제)되고, 안쪽 버튼을 누르면 그 방식으로 이동한다.
export function StartCard({
   icon,
   title,
   description,
   note,
   buttonLabel,
   href,
   recommended = false,
   selected,
   onSelect,
}: StartCardProps) {
   return (
      <article
         className={`relative flex flex-col rounded-2xl border bg-white p-8 transition-colors ${
            selected
               ? 'border-brand-orange ring-1 ring-brand-orange'
               : 'border-brand-line hover:border-brand-orange/50'
         }`}
      >
         {/* 카드 전체를 덮는 선택 버튼. 내용은 그 위에 겹쳐 있고(pointer-events-none), 이동 버튼만 클릭을 받는다. */}
         <button
            type="button"
            aria-pressed={selected}
            aria-label={`${title} 선택`}
            onClick={onSelect}
            className="absolute inset-0 cursor-pointer rounded-2xl focus-visible:ring-2 focus-visible:ring-brand-orange/50 focus-visible:outline-none"
         />

         {selected && (
            <span
               aria-hidden
               className="pointer-events-none absolute top-4 right-4 flex size-6 items-center justify-center rounded-full bg-brand-orange text-white"
            >
               <Check className="size-3.5" strokeWidth={3} />
            </span>
         )}

         <div className="pointer-events-none relative flex flex-1 flex-col">
            <span
               aria-hidden
               className="bg-brand-orange-light flex size-14 items-center justify-center rounded-full text-brand-orange"
            >
               {icon}
            </span>

            <h2 className="mt-6 flex items-center gap-2 text-xl font-bold text-black">
               {title}
               {recommended && (
                  <span className="rounded-full bg-brand-orange px-2.5 py-0.5 text-xs font-bold text-white">
                     추천
                  </span>
               )}
            </h2>
            {/* description 안의 \n 위치에서 줄이 바뀐다. */}
            <p className="mt-2 text-sm whitespace-pre-line text-black/50">{description}</p>
            <p className="mt-5 text-sm font-bold text-brand-brown">{note}</p>

            <div className="mt-auto pt-8">
               <ButtonLink
                  href={href}
                  size="form"
                  variant={recommended ? 'solid' : 'outline'}
                  className="pointer-events-auto w-full"
               >
                  {buttonLabel}
               </ButtonLink>
            </div>
         </div>
      </article>
   );
}
