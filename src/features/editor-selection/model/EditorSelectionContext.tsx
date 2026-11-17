'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface EditorSelectionContextValue {
   // 편집 모드인지. 미리보기에서는 블록 라벨과 선택 표시가 사라지고 선택할 수 없다.
   enabled: boolean;
   // 선택한 블록의 id. 블록의 종류와 구조는 사이트 내용 저장소에서 id로 찾는다.
   selectedId: string | null;
   // 같은 블록을 다시 누르면 선택이 해제된다.
   toggle: (id: string) => void;
   // 해제하지 않고 항상 선택한다. (목록에서 누르거나 블록을 새로 추가했을 때)
   select: (id: string) => void;
   clear: () => void;
}

const EditorSelectionContext = createContext<EditorSelectionContextValue | null>(null);

interface EditorSelectionProviderProps {
   enabled: boolean;
   // 블록을 새로 선택했을 때 부른다. (해제할 때는 부르지 않는다.) 오른쪽 패널을 요소 편집 탭으로 옮기는 데 쓴다.
   onSelect?: (id: string) => void;
   children: ReactNode;
}

// 에디터에서 선택한 블록 하나를 들고 있는다. 캔버스(블록 클릭)와 오른쪽 패널(선택 정보, 섹션 구조 목록)이 함께 읽는다.
export function EditorSelectionProvider({
   enabled,
   onSelect,
   children,
}: EditorSelectionProviderProps) {
   const [selectedId, setSelectedId] = useState<string | null>(null);

   const select = (id: string) => {
      setSelectedId(id);
      onSelect?.(id);
   };

   const toggle = (id: string) => {
      if (selectedId === id) setSelectedId(null);
      else select(id);
   };

   return (
      <EditorSelectionContext
         value={{ enabled, selectedId, toggle, select, clear: () => setSelectedId(null) }}
      >
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
