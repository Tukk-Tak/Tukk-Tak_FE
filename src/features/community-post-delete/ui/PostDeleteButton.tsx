'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { deletePost } from '@/entities/post';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { useToast } from '@/shared/ui/toastContext';

// 목록으로 돌아갈 곳
const COMMUNITY_PATH = '/community';

// 게시물 삭제 버튼. 누르면 확인 모달을 띄우고, 확인하면 삭제한 뒤 목록으로 돌아간다.
// 이 버튼을 보여 줄지(작성자인지)는 서버가 내려준 canDelete로 호출하는 쪽이 정하고, 실제 삭제 권한은 서버가 다시 확인한다.
export function PostDeleteButton({ postId }: { postId: string }) {
   const router = useRouter();
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
         await deletePost(postId);
         toast.show('게시물을 삭제했어요', { tone: 'success' });
         // 삭제한 글의 상세로 뒤로 가기가 돌아오지 않게 기록을 바꾼다.
         router.replace(COMMUNITY_PATH);
      } catch {
         busyRef.current = false;
         setDeleting(false);
         toast.show('게시물을 삭제하지 못했어요. 잠시 후 다시 시도해주세요', { tone: 'error' });
      }
   };

   return (
      <>
         <button
            type="button"
            disabled={deleting}
            onClick={() => setConfirming(true)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-black/60 hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
         >
            <Trash2 aria-hidden className="size-4" />
            삭제
         </button>

         {confirming && (
            <ConfirmModal
               title="게시물을 삭제할까요?"
               description="삭제하면 댓글과 좋아요도 함께 사라져요. 되돌릴 수 없어요."
               confirmLabel="삭제하기"
               cancelLabel="취소"
               onConfirm={handleConfirm}
               onCancel={() => setConfirming(false)}
            />
         )}
      </>
   );
}
