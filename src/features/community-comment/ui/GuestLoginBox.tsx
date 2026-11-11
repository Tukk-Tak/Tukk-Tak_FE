import { Lock } from 'lucide-react';
import { useCommentUi } from '../model/commentUi';

// 로그인하지 않은 사용자의 댓글 입력 자리. 눌러도 입력할 수 없고, 로그인 안내를 띄운다.
export function GuestLoginBox() {
   const ui = useCommentUi();

   return (
      <button
         type="button"
         onClick={ui.requireLogin}
         className="flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-brand-line bg-white px-4 text-sm text-black/40 hover:bg-brand-orange-light/30"
      >
         로그인하고 댓글을 남겨보세요
         <Lock aria-hidden className="size-4" />
      </button>
   );
}
