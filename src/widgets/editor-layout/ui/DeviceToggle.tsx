import { Monitor, Smartphone } from 'lucide-react';
import type { DeviceKind } from '../types';

const DEVICES = [
   { value: 'pc', label: 'PC', Icon: Monitor },
   { value: 'mobile', label: '모바일', Icon: Smartphone },
] as const;

// 캔버스 오른쪽 아래에 떠 있는 기기 전환. 같은 사이트를 PC 폭과 모바일 폭으로 번갈아 확인한다.
export function DeviceToggle({
   device,
   onDeviceChange,
}: {
   device: DeviceKind;
   onDeviceChange: (device: DeviceKind) => void;
}) {
   return (
      <div
         role="group"
         aria-label="미리보기 기기"
         className="absolute right-6 bottom-6 flex rounded-full bg-white p-1 shadow-card"
      >
         {DEVICES.map(({ value, label, Icon }) => (
            <button
               key={value}
               type="button"
               aria-pressed={device === value}
               onClick={() => onDeviceChange(value)}
               className={`flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-colors ${
                  device === value ? 'bg-brand-brown font-medium text-white' : 'text-black/50'
               }`}
            >
               <Icon aria-hidden className="size-4" />
               {label}
            </button>
         ))}
      </div>
   );
}
