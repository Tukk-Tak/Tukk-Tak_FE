import { LayoutGrid, List } from 'lucide-react';
import type { CommunityView } from '../model/useCommunityQuery';

const OPTIONS = [
   { value: 'card', label: '카드형으로 보기', Icon: LayoutGrid },
   { value: 'list', label: '목록형으로 보기', Icon: List },
] as const;

interface ViewToggleProps {
   value: CommunityView;
   disabled?: boolean;
   onChange: (view: CommunityView) => void;
}

// 카드형 / 목록형 전환. 둘 중 지금 보고 있는 쪽이 눌린 상태(aria-pressed)이다.
export function ViewToggle({ value, disabled = false, onChange }: ViewToggleProps) {
   return (
      <div className="flex shrink-0 overflow-hidden rounded-xl border border-brand-line bg-white">
         {OPTIONS.map(({ value: option, label, Icon }) => {
            const active = value === option;
            return (
               <button
                  key={option}
                  type="button"
                  aria-label={label}
                  aria-pressed={active}
                  disabled={disabled}
                  onClick={() => !active && onChange(option)}
                  className={`flex size-10 cursor-pointer items-center justify-center disabled:cursor-not-allowed ${
                     active
                        ? 'bg-black text-white disabled:bg-black/70'
                        : 'text-black/50 not-disabled:hover:bg-black/5 disabled:bg-field-disabled disabled:text-black/25'
                  }`}
               >
                  <Icon aria-hidden className="size-4" />
               </button>
            );
         })}
      </div>
   );
}
