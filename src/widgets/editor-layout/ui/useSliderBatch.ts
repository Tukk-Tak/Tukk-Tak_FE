import type { KeyboardEvent } from 'react';
import { useEditorSite } from '@/features/editor-site';

// 슬라이더 값을 바꾸는 키. 이 키로 조작하는 동안만 되돌리기 한 번으로 묶는다. (Shift 등 다른 키는 상관없다)
const VALUE_KEYS = new Set([
   'ArrowLeft',
   'ArrowRight',
   'ArrowUp',
   'ArrowDown',
   'Home',
   'End',
   'PageUp',
   'PageDown',
]);

// 슬라이더를 끄는 동안의 변경을 되돌리기 한 번으로 묶는 이벤트 핸들러.
// 포인터를 누를 때(또는 값을 바꾸는 키를 누를 때) 시작하고, 떼거나 취소하거나 포커스가 벗어나면 끝난다.
export function useSliderBatch() {
   const beginBatch = useEditorSite((state) => state.beginBatch);
   const endBatch = useEditorSite((state) => state.endBatch);

   return {
      onPointerDown: beginBatch,
      onPointerUp: endBatch,
      onPointerCancel: endBatch,
      onBlur: endBatch,
      onKeyDown: (event: KeyboardEvent) => {
         if (VALUE_KEYS.has(event.key)) beginBatch();
      },
      onKeyUp: (event: KeyboardEvent) => {
         if (VALUE_KEYS.has(event.key)) endBatch();
      },
   };
}
