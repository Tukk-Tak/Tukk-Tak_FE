import { Lock } from 'lucide-react';

// 볼 수 없는 비공개 댓글. 닉네임과 내용 없이 한 줄만 보여 준다. (그 아래 답글도 보이지 않는다.)
export function PrivateRow({ compact = false }: { compact?: boolean }) {
   return (
      <div
         className={`flex items-center gap-2 py-4 text-sm text-black/50 ${compact ? 'px-4' : 'px-5'}`}
      >
         <Lock aria-hidden className="size-4" />
         비공개 댓글이에요.
      </div>
   );
}
