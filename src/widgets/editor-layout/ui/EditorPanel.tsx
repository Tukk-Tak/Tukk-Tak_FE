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
export function EditorPanel({ tab, onTabChange }: EditorPanelProps) {
   return (
      <aside className="flex w-[370px] shrink-0 flex-col border-l border-brand-line bg-white">
         <div role="tablist" aria-label="에디터 패널" className="flex border-b border-brand-line">
            {TABS.map(({ value, label }) => (
               <button
                  key={value}
                  type="button"
                  role="tab"
                  id={`editor-tab-${value}`}
                  aria-selected={tab === value}
                  aria-controls={`editor-tabpanel-${value}`}
                  onClick={() => onTabChange(value)}
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
         <div
            role="tabpanel"
            id={`editor-tabpanel-${tab}`}
            aria-labelledby={`editor-tab-${tab}`}
            className="min-h-0 flex-1 overflow-y-auto p-6"
         >
            <p className="text-sm text-black/40">준비 중이에요.</p>
         </div>
      </aside>
   );
}
