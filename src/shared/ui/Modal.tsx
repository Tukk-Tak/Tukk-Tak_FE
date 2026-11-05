'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
   // 화면에 보이는 제목 요소(children 안)의 id. 스크린 리더가 모달 이름으로 읽는다.
   titleId: string;
   onClose: () => void;
   // 입력 중인 값을 잃지 않도록 배경을 눌러도 닫히지 않는 것이 기본이다. (Esc와 X 버튼은 항상 닫는다.)
   closeOnBackdrop?: boolean;
   className?: string;
   children: ReactNode;
}

const FOCUSABLE =
   'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// 화면 중앙에 뜨는 공용 모달. 열려 있는 동안 포커스를 모달 안에 가두고, 닫으면 열기 전 위치로 되돌린다.
// 렌더링 여부(열림/닫힘)는 호출하는 쪽이 정한다. (열 때마다 안의 상태가 새로 시작된다.)
export function Modal({
   titleId,
   onClose,
   closeOnBackdrop = false,
   className = '',
   children,
}: ModalProps) {
   const dialogRef = useRef<HTMLDivElement>(null);
   const closeRef = useRef(onClose);

   useEffect(() => {
      closeRef.current = onClose;
   });

   useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const previouslyFocused = document.activeElement as HTMLElement | null;
      // 처음에는 모달 자체에 포커스를 둔다. (첫 입력 칸에 바로 키보드가 열리지 않게 한다.)
      dialog.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            event.stopPropagation();
            closeRef.current();
            return;
         }
         if (event.key !== 'Tab') return;

         const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
            (element) => element.offsetParent !== null,
         );
         if (focusable.length === 0) {
            event.preventDefault();
            return;
         }
         const first = focusable[0];
         const last = focusable[focusable.length - 1];
         const active = document.activeElement;
         if (event.shiftKey && (active === first || active === dialog)) {
            event.preventDefault();
            last.focus();
         } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
         }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
         document.removeEventListener('keydown', handleKeyDown);
         previouslyFocused?.focus?.();
      };
   }, []);

   return createPortal(
      <div
         className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4"
         onMouseDown={(event) => {
            if (closeOnBackdrop && event.target === event.currentTarget) closeRef.current();
         }}
      >
         <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`relative my-auto w-full rounded-2xl bg-white shadow-card outline-none ${className}`}
         >
            <button
               type="button"
               aria-label="닫기"
               onClick={() => closeRef.current()}
               className="absolute top-5 right-5 flex size-8 cursor-pointer items-center justify-center rounded-full text-black/60 hover:bg-black/5 hover:text-black"
            >
               <X className="size-5" />
            </button>
            {children}
         </div>
      </div>,
      document.body,
   );
}
