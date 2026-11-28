'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { EditorHeader, type EditorMode } from '@/features/editor-header';
import { EditorSelectionProvider } from '@/features/editor-selection';
import { useEditorSite } from '@/features/editor-site';
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
   // 처음 불러온 내용과 다르면 저장하지 않은 변경이 있는 것이다. (되돌려서 처음 내용으로 돌아오면 변경 없음)
   const isDirty = useEditorSite((state) => state.site !== state.initialSite);
   const canUndo = useEditorSite((state) => state.past.length > 0);
   const canRedo = useEditorSite((state) => state.future.length > 0);
   const undo = useEditorSite((state) => state.undo);
   const redo = useEditorSite((state) => state.redo);

   // 단축키: Ctrl(Cmd)+Z 되돌리기, Ctrl(Cmd)+Shift+Z 또는 Ctrl+Y 다시하기. 편집 모드에서만 동작한다.
   // 입력칸 안에서도 브라우저 기본 되돌리기 대신 이 기능을 쓴다. (입력값을 사이트 내용이 들고 있어서 기본 되돌리기와 어긋난다)
   // 색 고르기 같은 모달이 열려 있을 때는 모달 안의 입력을 방해하지 않도록 동작하지 않는다.
   useEffect(() => {
      if (mode !== 'edit') return;
      const handleKeyDown = (event: KeyboardEvent) => {
         if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
         if (document.querySelector('[role="dialog"]')) return;
         const key = event.key.toLowerCase();
         const isUndo = key === 'z' && !event.shiftKey;
         const isRedo = (key === 'z' && event.shiftKey) || key === 'y';
         if (!isUndo && !isRedo) return;
         event.preventDefault();
         if (isUndo) undo();
         else redo();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [mode, undo, redo]);

   return (
      // 블록을 선택하면 오른쪽 패널을 요소 편집 탭으로 옮긴다. 미리보기에서는 선택 기능을 끈다.
      <EditorSelectionProvider enabled={mode === 'edit'} onSelect={() => setTab('element')}>
         <div className="flex h-full flex-col">
            <EditorHeader
               mode={mode}
               onModeChange={setMode}
               isDirty={isDirty}
               canUndo={canUndo}
               canRedo={canRedo}
               onUndo={undo}
               onRedo={redo}
            />
            <div className="flex min-h-0 flex-1">
               <EditorCanvas device={device} onDeviceChange={setDevice} siteName={siteName}>
                  {children}
               </EditorCanvas>
               {/* 미리보기에서는 패널을 없애지 않고 폭만 0으로 줄인다. 캔버스가 그만큼 서서히 넓어진다. */}
               {/* 안쪽 패널은 폭이 고정이라 줄어드는 동안 내용이 다시 배치되지 않고 오른쪽으로 밀려난다. inert: 숨긴 동안 포커스가 들어가지 않게 한다. */}
               <div
                  inert={mode !== 'edit'}
                  className={`flex shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out motion-reduce:transition-none ${
                     mode === 'edit' ? 'w-92.5' : 'w-0'
                  }`}
               >
                  <EditorPanel tab={tab} onTabChange={setTab} />
               </div>
            </div>
         </div>
      </EditorSelectionProvider>
   );
}
