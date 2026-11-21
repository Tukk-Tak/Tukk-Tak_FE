'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { useStore, type StoreApi } from 'zustand';
import type { SiteContent } from '@/entities/site';
import { createEditorSiteStore, type EditorSiteState } from './editorSiteStore';

const EditorSiteContext = createContext<StoreApi<EditorSiteState> | null>(null);

interface EditorSiteProviderProps {
   initialSite: SiteContent;
   children: ReactNode;
}

// 에디터 화면 하나가 쓰는 사이트 내용 저장소를 만들어 아래 화면에 나눠 준다.
// 저장소는 화면마다 따로 만들므로 서버에서 다른 사용자의 내용이 섞이지 않는다.
export function EditorSiteProvider({ initialSite, children }: EditorSiteProviderProps) {
   const [store] = useState(() => createEditorSiteStore(initialSite));
   return <EditorSiteContext value={store}>{children}</EditorSiteContext>;
}

// 저장소에서 필요한 값만 골라 읽는다. 고른 값이 바뀔 때만 이 컴포넌트가 다시 그려진다.
// 선택 함수는 새 배열이나 객체를 만들어 돌려주지 말고, 저장소에 있는 값 그대로 돌려줘야 한다.
export function useEditorSite<T>(selector: (state: EditorSiteState) => T): T {
   const store = useContext(EditorSiteContext);
   if (!store) throw new Error('useEditorSite는 EditorSiteProvider 안에서만 쓸 수 있어요.');
   return useStore(store, selector);
}
