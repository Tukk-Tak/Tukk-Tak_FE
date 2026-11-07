'use client';

import { useId } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface ConfirmModalProps {
   title: string;
   description: string;
   confirmLabel: string;
   cancelLabel: string;
   onConfirm: () => void;
   // 취소 버튼, X 버튼, Esc가 모두 이 함수를 부른다. (배경 클릭으로는 닫히지 않는다.)
   onCancel: () => void;
}

// "정말 나갈까요?" 같은 확인 모달. 열려 있을 때만 렌더링해서 쓴다.
export function ConfirmModal({
   title,
   description,
   confirmLabel,
   cancelLabel,
   onConfirm,
   onCancel,
}: ConfirmModalProps) {
   const titleId = useId();

   return (
      <Modal titleId={titleId} onClose={onCancel} className="max-w-sm">
         <div className="p-6 pt-14">
            <h2 id={titleId} className="text-lg font-bold text-black">
               {title}
            </h2>
            <p className="mt-2 text-sm text-black/60">{description}</p>
            <div className="mt-6 flex justify-end gap-2">
               <Button variant="outline" size="field" onClick={onCancel}>
                  {cancelLabel}
               </Button>
               <Button size="field" onClick={onConfirm}>
                  {confirmLabel}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
