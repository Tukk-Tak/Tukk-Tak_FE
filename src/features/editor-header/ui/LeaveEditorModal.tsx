'use client';

import { useId } from 'react';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';

interface LeaveEditorModalProps {
   onClose: () => void; // X 버튼, Esc: 에디터에 그대로 머문다.
   onLeave: () => void; // 저장하지 않고 나간다.
   onSaveAndLeave: () => void;
}

// 저장하지 않은 변경사항이 있을 때 에디터를 나가려는 경우에 확인을 받는 모달.
export function LeaveEditorModal({ onClose, onLeave, onSaveAndLeave }: LeaveEditorModalProps) {
   const titleId = useId();

   return (
      <Modal titleId={titleId} onClose={onClose} className="max-w-md">
         <div className="p-8">
            
            <h2 id={titleId} className="mt-6 text-2xl font-bold text-black">
               저장하지 않은 변경사항이 있어요
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-black/50">
               지금 에디터를 나가면 변경한 내용이 사라져요.
               <br />
               메인페이지로 나가시겠어요?
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
               <Button variant="outline" size="form" onClick={onLeave}>
                  나가기
               </Button>
               <Button size="form" onClick={onSaveAndLeave}>
                  저장하고 나가기
               </Button>
            </div>
         </div>
      </Modal>
   );
}
