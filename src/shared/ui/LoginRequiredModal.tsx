'use client';

import { useRouter } from 'next/navigation';
import { ConfirmModal } from './ConfirmModal';

interface LoginRequiredModalProps {
   onCancel: () => void;
}

// 로그인하지 않은 사용자가 로그인이 필요한 동작(좋아요, 댓글 등)을 눌렀을 때 띄우는 안내.
// 열려 있을 때만 렌더링해서 쓴다. "로그인하기"를 누르면 로그인 페이지로 이동한다.
// TODO: 로그인 후 원래 화면으로 돌아오는 기능이 생기면 현재 주소를 함께 넘긴다.
export function LoginRequiredModal({ onCancel }: LoginRequiredModalProps) {
   const router = useRouter();

   return (
      <ConfirmModal
         title="로그인이 필요해요"
         description="로그인하고 이용해 주세요."
         confirmLabel="로그인하기"
         cancelLabel="취소"
         onConfirm={() => router.push('/login')}
         onCancel={onCancel}
      />
   );
}
