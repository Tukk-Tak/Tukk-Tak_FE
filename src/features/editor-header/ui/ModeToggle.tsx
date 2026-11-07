import type { EditorMode } from '../types';

const MODES: { value: EditorMode; label: string }[] = [
   { value: 'edit', label: '편집' },
   { value: 'preview', label: '미리보기' },
];

export function ModeToggle({
   mode,
   onModeChange,
}: {
   mode: EditorMode;
   onModeChange: (mode: EditorMode) => void;
}) {
   return (
      <div role="group" aria-label="보기 모드" className="bg-[#F5F5F4] flex rounded-md p-1">
         {MODES.map(({ value, label }) => (
            <button
               key={value}
               type="button"
               aria-pressed={mode === value}
               onClick={() => onModeChange(value)}
               className={`cursor-pointer rounded-md px-5 py-2 text-[15px] transition-colors ${
                  mode === value
                     ? 'bg-white font-medium text-black shadow-sm'
                     : 'font-medium text-[#A6A09B]'
               }`}
            >
               {label}
            </button>
         ))}
      </div>
   );
}
