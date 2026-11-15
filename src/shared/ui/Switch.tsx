interface SwitchProps {
   checked: boolean;
   onChange: (checked: boolean) => void;
   // 스위치가 무엇을 켜고 끄는지 알려 주는 이름. 보이는 제목이 있으면 그 요소의 id를 labelledBy로 준다.
   labelledBy?: string;
   label?: string;
}

// 켜고 끄는 스위치. 스크린 리더에는 on/off 상태가 있는 스위치로 읽힌다.
export function Switch({ checked, onChange, labelledBy, label }: SwitchProps) {
   return (
      <button
         type="button"
         role="switch"
         aria-checked={checked}
         aria-labelledby={labelledBy}
         aria-label={label}
         onClick={() => onChange(!checked)}
         className={`relative h-6 w-10 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:outline-none ${
            checked ? 'bg-brand-orange' : 'bg-[#D6D3D1]'
         }`}
      >
         <span
            aria-hidden
            className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${
               checked ? 'translate-x-4' : 'translate-x-0'
            }`}
         />
      </button>
   );
}
