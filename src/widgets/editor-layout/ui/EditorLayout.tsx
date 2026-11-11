'use client';

import { useState, type ReactNode } from 'react';
import { EditorHeader, type EditorMode } from '@/features/editor-header';
import type { DeviceKind, PanelTab } from '../types';
import { EditorCanvas } from './EditorCanvas';
import { EditorPanel } from './EditorPanel';

interface EditorLayoutProps {
   siteName: string;
   children: ReactNode; // 캔버스에 들어갈 사이트 렌더러. widget끼리는 import할 수 없어서 페이지가 끼워 준다.
}

// 에디터 화면의 틀. 상단 바, 왼쪽 캔버스, 오른쪽 패널을 배치하고 화면 상태(모드, 기기, 탭)를 갖는다.
// 미리보기에서는 오른쪽 패널을 숨겨 캔버스가 화면 전체를 쓴다.
export function EditorLayout({ siteName, children }: EditorLayoutProps) {
   const [mode, setMode] = useState<EditorMode>('edit');
   const [device, setDevice] = useState<DeviceKind>('pc');
   const [tab, setTab] = useState<PanelTab>('structure');
   // TODO: 편집 기능이 생기면 실제 변경 여부로 바꾼다. 지금은 화면 확인용 고정값이다.
   const isDirty = true;

   return (
      <div className="flex h-full flex-col">
         <EditorHeader mode={mode} onModeChange={setMode} isDirty={isDirty} />
         <div className="flex min-h-0 flex-1">
            <EditorCanvas device={device} onDeviceChange={setDevice} siteName={siteName}>
               {children}
            </EditorCanvas>
            {/* 미리보기에서는 패널을 없애지 않고 폭만 0으로 줄인다. 캔버스가 그만큼 서서히 넓어진다. */}
            {/* 안쪽 패널은 폭이 고정이라 줄어드는 동안 내용이 다시 배치되지 않고 오른쪽으로 밀려난다. inert: 숨긴 동안 포커스가 들어가지 않게 한다. */}
            <div
               inert={mode !== 'edit'}
               className={`flex shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out motion-reduce:transition-none ${
                  mode === 'edit' ? 'w-[370px]' : 'w-0'
               }`}
            >
               <EditorPanel tab={tab} onTabChange={setTab} />
            </div>
         </div>
      </div>
   );
}
