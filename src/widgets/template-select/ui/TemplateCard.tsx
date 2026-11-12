import { Check } from 'lucide-react';
import { TemplateThumbnail, type Template } from '@/entities/template';

interface TemplateCardProps {
   template: Template;
   selected: boolean;
   onToggle: (id: Template['id']) => void;
}

// 템플릿 한 장. 누르면 선택되고, 선택된 카드를 다시 누르면 선택이 풀린다.
export function TemplateCard({ template, selected, onToggle }: TemplateCardProps) {
   return (
      <button
         type="button"
         aria-pressed={selected}
         onClick={() => onToggle(template.id)}
         className={`rounded-card flex cursor-pointer flex-col overflow-hidden border bg-white text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand-orange/50 focus-visible:outline-none ${
            selected
               ? 'border-brand-orange ring-1 ring-brand-orange'
               : 'border-brand-line hover:border-brand-orange/50'
         }`}
      >
         <div className="relative aspect-10/9 w-full bg-brand-orange-light/60 p-[6%]">
            <TemplateThumbnail id={template.id} />
            {selected && (
               <span
                  aria-hidden
                  className="absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-full bg-brand-orange text-white"
               >
                  <Check className="size-3.5" strokeWidth={3} />
               </span>
            )}
         </div>
         <div className="border-t border-brand-line px-4 py-3.5 md:px-5 md:py-4">
            <p className="text-sm font-bold text-black md:text-base">{template.name}</p>
            <p className="mt-1 text-xs text-[#A6A09B] md:text-sm">{template.description}</p>
         </div>
      </button>
   );
}
