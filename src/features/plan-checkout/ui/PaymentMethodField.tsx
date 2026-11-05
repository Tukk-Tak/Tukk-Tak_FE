import { Check } from 'lucide-react';
import type { PaymentMethod } from '../types';

const METHODS: { value: PaymentMethod; label: string }[] = [
   { value: 'TOSS', label: '토스' },
   { value: 'KAKAOPAY', label: '카카오페이' },
];

interface PaymentMethodFieldProps {
   value: PaymentMethod | null;
   disabled: boolean;
   onChange: (method: PaymentMethod) => void;
}

// 결제수단을 하나 고른다. 실제 라디오 입력을 쓰므로 키보드(방향키)와 스크린 리더가 그대로 동작한다.
export function PaymentMethodField({ value, disabled, onChange }: PaymentMethodFieldProps) {
   return (
      <fieldset disabled={disabled} className="min-w-0">
         <legend className="mb-2.5 text-xs font-bold text-black">결제수단</legend>
         <div className="grid grid-cols-2 gap-3">
            {METHODS.map((method) => {
               const selected = value === method.value;
               return (
                  <label
                     key={method.value}
                     className={`flex h-14 cursor-pointer items-center justify-between rounded-xl border px-4 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-orange/40 ${
                        selected
                           ? 'border-brand-orange text-brand-orange'
                           : 'border-brand-line text-black'
                     } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                  >
                     <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={selected}
                        onChange={() => onChange(method.value)}
                        className="sr-only"
                     />
                     {method.label}
                     <span
                        aria-hidden
                        className={`flex size-5 items-center justify-center rounded-full border ${
                           selected ? 'border-brand-orange bg-brand-orange' : 'border-brand-line'
                        }`}
                     >
                        {selected && <Check className="size-3 text-white" strokeWidth={3} />}
                     </span>
                  </label>
               );
            })}
         </div>
      </fieldset>
   );
}
