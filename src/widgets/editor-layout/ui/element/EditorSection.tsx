'use client';

import { ChevronUp } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

interface EditorSectionProps {
   title: string;
   // 제목 바로 옆에 작게 붙는 안내
   note?: string;
   defaultOpen?: boolean;
   children: ReactNode;
}

// 요소 편집 탭의 섹션(구조, 내용, 이미지 등). 제목을 누르면 접고 펼 수 있다.
// 접어 둬도 안의 입력 상태가 사라지지 않도록 내용은 숨기기만 한다. 접힘 상태는 저장하지 않는다.
export function EditorSection({ title, note, defaultOpen = true, children }: EditorSectionProps) {
   const [open, setOpen] = useState(defaultOpen);
   const panelId = useId();

   return (
      <section className="border-b border-brand-line py-4 first:pt-0 last:border-b-0">
         <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((current) => !current)}
            className="flex w-full cursor-pointer items-center text-left"
         >
            <h3 className="shrink-0 text-sm font-bold text-brand-brown">{title}</h3>
            {note && (
               <span className="mr-2 ml-2 min-w-0 flex-1 text-[11px] font-normal break-keep text-[#A6A09B]">
                  {note}
               </span>
            )}
            <ChevronUp
               aria-hidden
               className={`ml-auto size-4 shrink-0 text-[#A6A09B] transition-transform ${open ? '' : 'rotate-180'}`}
            />
         </button>
         <div id={panelId} hidden={!open} className="mt-3 space-y-4">
            {children}
         </div>
      </section>
   );
}
