'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Section } from '@/entities/block';

// 선택한 블록을 가리키는 값. 블록의 내용 전체가 아니라 무엇을 골랐는지만 담는다.
// TODO: 에디터 상태 저장소(사이트 내용)가 생기면 id만 들고 있고 나머지는 저장소에서 읽는다. (구조를 바꿔도 이 값이 낡지 않게)
export interface SelectedBlock {
   id: string;
   type: Section['type'];
   variant: string;
}

interface EditorSelectionContextValue {
   // 편집 모드인지. 미리보기에서는 블록 라벨과 선택 표시가 사라지고 선택할 수 없다.
   enabled: boolean;
   selected: SelectedBlock | null;
   // 같은 블록을 다시 누르면 선택이 해제된다.
   toggle: (block: SelectedBlock) => void;
   clear: () => void;
}

const EditorSelectionContext = createContext<EditorSelectionContextValue | null>(null);

interface EditorSelectionProviderProps {
   enabled: boolean;
   // 블록을 새로 선택했을 때 부른다. (해제할 때는 부르지 않는다.) 오른쪽 패널을 요소 편집 탭으로 옮기는 데 쓴다.
   onSelect?: (block: SelectedBlock) => void;
   children: ReactNode;
}

// 에디터에서 선택한 블록 하나를 들고 있는다. 캔버스(블록 클릭)와 오른쪽 패널(선택 정보)이 함께 읽는다.
export function EditorSelectionProvider({
   enabled,
   onSelect,
   children,
}: EditorSelectionProviderProps) {
   const [selected, setSelected] = useState<SelectedBlock | null>(null);

   const toggle = (block: SelectedBlock) => {
      if (selected?.id === block.id) {
         setSelected(null);
         return;
      }
      setSelected(block);
      onSelect?.(block);
   };

   return (
      <EditorSelectionContext value={{ enabled, selected, toggle, clear: () => setSelected(null) }}>
         {children}
      </EditorSelectionContext>
   );
}

export function useEditorSelection() {
   const context = useContext(EditorSelectionContext);
   if (!context) {
      throw new Error('useEditorSelection은 EditorSelectionProvider 안에서만 쓸 수 있어요.');
   }
   return context;
}

// 배포된 사이트처럼 에디터 밖에서도 같은 렌더러를 쓰므로, 제공자가 없으면 선택 기능이 꺼진 값을 돌려준다.
export function useOptionalEditorSelection() {
   return useContext(EditorSelectionContext);
}
