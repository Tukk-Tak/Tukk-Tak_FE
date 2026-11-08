import { Monitor, Smartphone } from 'lucide-react';
import type { DeviceKind } from '../types';

const DEVICE_LABEL: Record<DeviceKind, string> = {
   pc: '데스크톱 · 1440px',
   mobile: '모바일 · 390px',
};

const PILL_CLASS = 'rounded-full bg-white/80 px-3 py-1.5 text-xs text-black/60 shadow-sm';

// 캔버스 위쪽에 떠 있는 안내. 왼쪽은 지금 보는 기기와 폭, 오른쪽은 현재 위치이다.
export function CanvasInfoBar({ device, siteName }: { device: DeviceKind; siteName: string }) {
   const DeviceIcon = device === 'pc' ? Monitor : Smartphone;

   return (
      <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between">
         <div className={`${PILL_CLASS} flex items-center gap-1.5`}>
            <DeviceIcon aria-hidden className="size-3.5" />
            {DEVICE_LABEL[device]}
         </div>
         <div className={PILL_CLASS}>
            내 사이트 › <strong className="font-bold text-black">{siteName}</strong>
         </div>
      </div>
   );
}
