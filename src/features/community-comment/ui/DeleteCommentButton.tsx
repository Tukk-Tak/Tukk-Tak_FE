'use client';

import { useRef, useState } from 'react';
import { deleteComment } from '@/entities/post';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { useToast } from '@/shared/ui/toastContext';

interface DeleteCommentButtonProps {
   commentId: string;
   // 삭제에 성공한 뒤 호출한다. (목록을 갱신하는 일은 부르는 쪽이 한다.)
   onDeleted: (commentId: string) => void;
}

// 댓글·답글 삭제 버튼. 확인 모달을 거치고, 삭제하면 "삭제된 댓글입니다."로 남는다.
// 이 버튼을 보여 줄지(내 댓글인지)는 서버가 내려준 canDelete로 정하고, 실제 삭제 권한은 서버가 다시 확인한다.
export function DeleteCommentButton({ commentId, onDeleted }: DeleteCommentButtonProps) {
   const toast = useToast();
   const [confirming, setConfirming] = useState(false);
   const [deleting, setDeleting] = useState(false);
   // 삭제 요청이 두 번 가지 않게 하는 동기 가드
   const busyRef = useRef(false);

   const handleConfirm = async () => {
      setConfirming(false);
      if (busyRef.current) return;

      busyRef.current = true;
      setDeleting(true);
      try {
         await deleteComment(commentId);
         onDeleted(commentId);
      } catch {
         toast.show('댓글을 삭제하지 못했어요. 잠시 후 다시 시도해주세요', { tone: 'error' });
      } finally {
         busyRef.current = false;
         setDeleting(false);
      }
   };

   return (
      <>
         <button
            type="button"
            disabled={deleting}
            onClick={() => setConfirming(true)}
            className="cursor-pointer text-black/40 hover:text-black hover:underline disabled:cursor-not-allowed disabled:opacity-50"
         >
            삭제
         </button>

         {confirming && (
            <ConfirmModal
               title="댓글을 삭제할까요?"
               description={'삭제한 댓글은 되돌릴 수 없어요.'}
               confirmLabel="삭제하기"
               cancelLabel="취소"
               onConfirm={handleConfirm}
               onCancel={() => setConfirming(false)}
            />
         )}
      </>
   );
}
