'use client';

import { useRef, type KeyboardEvent } from 'react';
import type { PanelTab } from '../types';

const TABS: { value: PanelTab; label: string }[] = [
   { value: 'theme', label: '사이트 테마' },
   { value: 'structure', label: '섹션 구조' },
   { value: 'element', label: '요소 편집' },
];

interface EditorPanelProps {
   tab: PanelTab;
   onTabChange: (tab: PanelTab) => void;
}

// 오른쪽 패널의 틀. 탭 본문은 아직 비어 있고, 각 탭의 기능을 만들 때 채운다.
// 키보드: 선택된 탭에만 Tab으로 멈추고, ← → 로 탭을 옮기며 Home/End 로 처음과 끝 탭으로 간다.
// 패널 세 개를 모두 두고 선택되지 않은 것만 숨겨서, 모든 탭의 aria-controls 가 실제 패널을 가리키게 한다.
export function EditorPanel({ tab, onTabChange }: EditorPanelProps) {
   const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

   const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = TABS.length - 1;
      let next: number;
      if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
      else if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = last;
      else return;

      event.preventDefault();
      onTabChange(TABS[next].value);
      tabRefs.current[next]?.focus();
   };

   return (
      <aside className="flex w-[370px] shrink-0 flex-col border-l border-brand-line bg-white">
         <div role="tablist" aria-label="에디터 패널" className="flex border-b border-brand-line">
            {TABS.map(({ value, label }, index) => (
               <button
                  key={value}
                  ref={(element) => {
                     tabRefs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`editor-tab-${value}`}
                  aria-selected={tab === value}
                  aria-controls={`editor-tabpanel-${value}`}
                  tabIndex={tab === value ? 0 : -1}
                  onClick={() => onTabChange(value)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={`-mb-px flex-1 cursor-pointer border-b-2 py-4 text-sm font-medium transition-colors ${
                     tab === value
                        ? 'border-brand-orange text-black'
                        : 'border-transparent text-black/40 hover:text-black/70'
                  }`}
               >
                  {label}
               </button>
            ))}
         </div>
         {TABS.map(({ value }) => (
            <div
               key={value}
               role="tabpanel"
               id={`editor-tabpanel-${value}`}
               aria-labelledby={`editor-tab-${value}`}
               hidden={tab !== value}
               className="min-h-0 flex-1 overflow-y-auto p-6"
            >
               <p className="text-sm text-black/40">준비 중이에요.</p>
            </div>
         ))}
      </aside>
   );
}
