import { useEffect, type RefObject } from 'react';

// 열려 있는 드롭다운을 Esc나 바깥 클릭으로 닫는다. (헤더의 알림·프로필 메뉴가 함께 쓴다.)
// paused: 메뉴 위에 모달이 떠 있을 때처럼, 잠시 이 동작을 멈춰야 할 때 true로 둔다.
export function useDismissibleMenu(
   open: boolean,
   rootRef: RefObject<HTMLElement | null>,
   onClose: () => void,
   paused = false,
) {
   useEffect(() => {
      if (!open || paused) return;

      const closeOnEscape = (event: KeyboardEvent) => {
         if (event.key === 'Escape') onClose();
      };
      const closeOnOutsideClick = (event: PointerEvent) => {
         if (!rootRef.current?.contains(event.target as Node)) onClose();
      };
      window.addEventListener('keydown', closeOnEscape);
      window.addEventListener('pointerdown', closeOnOutsideClick);
      return () => {
         window.removeEventListener('keydown', closeOnEscape);
         window.removeEventListener('pointerdown', closeOnOutsideClick);
      };
   }, [open, paused, rootRef, onClose]);
}
