'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { EMPTY_AI_DRAFT_VALUES, type AiDraftValues } from './values';

interface AiDraftFormContextValue {
   values: AiDraftValues;
   // 바꿀 항목만 넘기면 나머지는 그대로 둔다.
   update: (patch: Partial<AiDraftValues>) => void;
}

const AiDraftFormContext = createContext<AiDraftFormContextValue | null>(null);

// 입력 단계를 오가는 동안 값을 화면 메모리에 들고 있는다. 저장소에는 쓰지 않으므로
// 새로고침하거나 이 화면을 벗어나면 값이 사라진다. (최종 단계까지 마친 뒤에만 서버로 넘긴다.)
export function AiDraftFormProvider({ children }: { children: ReactNode }) {
   const [values, setValues] = useState<AiDraftValues>(EMPTY_AI_DRAFT_VALUES);

   const update = (patch: Partial<AiDraftValues>) =>
      setValues((current) => ({ ...current, ...patch }));

   return <AiDraftFormContext value={{ values, update }}>{children}</AiDraftFormContext>;
}

export function useAiDraftForm() {
   const context = useContext(AiDraftFormContext);
   if (!context) throw new Error('useAiDraftForm은 AiDraftFormProvider 안에서만 쓸 수 있어요.');
   return context;
}
