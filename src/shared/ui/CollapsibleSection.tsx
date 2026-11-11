'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';

interface CollapsibleSectionProps {
   title: string;
   description?: string;
   badge?: ReactNode;
   defaultOpen?: boolean;
   children: ReactNode;
}

export function CollapsibleSection({
   title,
   description,
   badge,
   defaultOpen = false,
   children,
}: CollapsibleSectionProps) {
   const [open, setOpen] = useState(defaultOpen);
   const panelId = useId();

   return (
      <section className="border-brand-line overflow-hidden rounded-xl border bg-white">
         <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((prev) => !prev)}
            className="flex w-full cursor-pointer flex-wrap items-center gap-x-2 gap-y-1 px-5 py-3 text-left"
         >
            <span className="text-sm font-bold text-black">{title}</span>
            {description && <span className="text-xs text-black/50">{description}</span>}
            {badge}
            <ChevronDown
               aria-hidden
               className={`ml-auto size-4 shrink-0 text-black/50 transition-transform ${open ? 'rotate-180' : ''}`}
            />
         </button>
         {/* 닫혀 있어도 입력한 값이 사라지지 않도록, 내용은 제거하지 않고 숨기기만 한다. */}
         <div
            id={panelId}
            hidden={!open}
            className="border-brand-line bg-field-readonly border-t p-5"
         >
            {children}
         </div>
      </section>
   );
}
