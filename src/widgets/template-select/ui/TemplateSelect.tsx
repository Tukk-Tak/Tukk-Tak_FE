'use client';

import { useState } from 'react';
import { TEMPLATES, type TemplateId } from '@/entities/template';
import { getEditorPathWithTemplate } from '@/shared/config/routes';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { TemplateCard } from './TemplateCard';
import { TemplateSelectBar } from './TemplateSelectBar';

// 템플릿 선택 화면. 허브에서 "템플릿으로 시작하기"를 고르고 들어온 화면이라, 템플릿을 고르고 진행한다.
// 선택 상태는 이 화면 안에서만 들고 있다. (새로고침하면 사라진다.)
export function TemplateSelect() {
   const [selectedId, setSelectedId] = useState<TemplateId | null>(null);

   const selected = TEMPLATES.find((template) => template.id === selectedId) ?? null;

   return (
      <div className="flex h-full flex-col">
         <ScrollArea className="min-h-0 flex-1">
            <section className="mx-auto w-full max-w-7xl px-[4%] py-10 md:py-14">
               <header className="text-center">
                  <h1 className="text-2xl font-bold text-black md:text-3xl">
                     어떤 템플릿으로 시작할까요?
                  </h1>
                  <p className="mt-3 text-sm text-black/50">
                     템플릿을 고르면 해당 템플릿을 기반으로 시작할 수 있어요.
                  </p>
               </header>

               <div
                  role="group"
                  aria-label="템플릿 목록"
                  className="mt-10 grid grid-cols-2 gap-4 md:mt-12 lg:grid-cols-4 lg:gap-6"
               >
                  {TEMPLATES.map((template) => (
                     <TemplateCard
                        key={template.id}
                        template={template}
                        selected={template.id === selectedId}
                        onToggle={(id) => setSelectedId((current) => (current === id ? null : id))}
                     />
                  ))}
               </div>
            </section>
         </ScrollArea>

         <TemplateSelectBar
            selectedName={selected?.name ?? null}
            href={selected ? getEditorPathWithTemplate(selected.id) : null}
         />
      </div>
   );
}
