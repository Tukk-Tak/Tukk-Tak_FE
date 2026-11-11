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
   // 취소 버튼과 Esc가 이 함수를 부른다. (배경을 눌러도 닫히지 않는다.)
   onCancel: () => void;
}

// "정말 나갈까요?" 같은 확인 모달. 열려 있을 때만 렌더링해서 쓴다.
// 취소 버튼이 이미 있으므로 X 버튼은 두지 않는다. 두 버튼은 같은 크기로 가로를 꽉 채운다.
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
      <Modal titleId={titleId} onClose={onCancel} showCloseButton={false} className="max-w-sm">
         <div className="px-7 py-8">
            <h2 id={titleId} className="text-xl font-bold text-black">
               {title}
            </h2>
            {/* 설명의 \n은 줄바꿈으로 보여 준다. (문장이 끝나는 곳에서 줄을 나눌 수 있게) */}
            <p className="mt-3 text-sm break-keep whitespace-pre-line text-black/60">
               {description}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
               <Button variant="outline" size="form" onClick={onCancel} className="w-full">
                  {cancelLabel}
               </Button>
               <Button size="form" onClick={onConfirm} className="w-full">
                  {confirmLabel}
               </Button>
            </div>
         </div>
      </Modal>
   );
}
