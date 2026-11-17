import { Check } from 'lucide-react';

interface Option<T extends string> {
   key: T;
   label: string;
   description: string;
}

interface OptionCardGroupProps<T extends string> {
   // 질문 문구. 필수 표시(*)가 함께 붙는다.
   legend: string;
   options: readonly Option<T>[];
   value: T | null;
   // 같은 카드를 다시 누르면 선택이 해제되어 null이 넘어온다.
   onChange: (value: T | null) => void;
   // 큰 화면에서 한 줄에 놓을 카드 수. 작은 화면은 항상 한 줄에 하나씩 놓는다.
   columns: 3 | 4;
}

const COLUMNS_CLASS = {
   3: 'sm:grid-cols-3',
   4: 'sm:grid-cols-2 lg:grid-cols-4',
} as const;

// 질문 하나에 카드형 선택지를 보여 주고 하나만 고르게 한다. 고른 카드는 주황 테두리와 체크로 표시한다.
export function OptionCardGroup<T extends string>({
   legend,
   options,
   value,
   onChange,
   columns,
}: OptionCardGroupProps<T>) {
   return (
      <fieldset>
         <legend className="text-sm font-bold text-brand-brown">
            {legend}
            <span aria-hidden className="ml-1 text-brand-orange">
               *
            </span>
         </legend>

         <div className={`mt-3 grid grid-cols-1 gap-3.5 ${COLUMNS_CLASS[columns]}`}>
            {options.map(({ key, label, description }) => {
               const selected = value === key;
               return (
                  <button
                     key={key}
                     type="button"
                     aria-pressed={selected}
                     onClick={() => onChange(selected ? null : key)}
                     className={`relative flex min-h-28 cursor-pointer flex-col justify-center gap-2 rounded-xl border px-5 py-5 text-left transition-colors ${
                        selected
                           ? 'border-brand-orange bg-brand-cream'
                           : 'border-brand-line bg-white hover:border-brand-orange'
                     }`}
                  >
                     <span className="text-sm font-bold text-brand-brown">{label}</span>
                     <span className="text-xs break-keep text-[#A6A09B]">{description}</span>
                     {selected && (
                        <span
                           aria-hidden
                           className="absolute top-3.5 right-3.5 flex size-6 items-center justify-center rounded-full bg-brand-orange text-white"
                        >
                           <Check className="size-3.5" strokeWidth={3} />
                        </span>
                     )}
                  </button>
               );
            })}
         </div>
      </fieldset>
   );
}
