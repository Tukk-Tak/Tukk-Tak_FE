import type { ReactNode } from 'react';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import type { DeviceKind } from '../types';
import { CanvasInfoBar } from './CanvasInfoBar';
import { DeviceToggle } from './DeviceToggle';
import { ScaledFrame } from './ScaledFrame';

const DEVICE_WIDTH: Record<DeviceKind, number> = { pc: 1440, mobile: 390 };

// 격자 배경. 32px 칸마다 얇은 선(1px)을 긋고, 5칸(160px)마다 조금 굵은 선(1.5px)을 겹친다.
// 선 색은 tokens.css 의 --color-brand-grid 이다. 위의 두 줄이 굵은 선, 아래 두 줄이 얇은 선이다.
const GRID_CLASS =
   'bg-[linear-gradient(var(--color-brand-grid)_1.5px,transparent_1.5px),linear-gradient(90deg,var(--color-brand-grid)_1.5px,transparent_1.5px),linear-gradient(var(--color-brand-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-brand-grid)_1px,transparent_1px)] bg-[length:160px_160px,160px_160px,32px_32px,32px_32px]';

interface EditorCanvasProps {
   device: DeviceKind;
   onDeviceChange: (device: DeviceKind) => void;
   siteName: string;
   children: ReactNode;
}

// 왼쪽 캔버스. 사이트 길이가 길면 이 영역 안에서만 세로로 스크롤되고, 안내와 기기 전환은 그 위에 떠 있다.
export function EditorCanvas({ device, onDeviceChange, siteName, children }: EditorCanvasProps) {
   return (
      <div className="relative min-w-0 flex-1 bg-brand-orange-light">
         {/* 격자는 스크롤되지 않고 영역에 고정된다. (스크롤 영역은 안쪽에 둔다.) */}
         <div className={`absolute inset-0 ${GRID_CLASS}`}>
            <ScrollArea className="size-full">
               <div className="px-8 pt-16 pb-28">
                  <ScaledFrame width={DEVICE_WIDTH[device]}>{children}</ScaledFrame>
               </div>
            </ScrollArea>
         </div>
         <CanvasInfoBar device={device} siteName={siteName} />
         <DeviceToggle device={device} onDeviceChange={onDeviceChange} />
      </div>
   );
}
