import { X } from 'lucide-react';

// "@닉네임" 칩. 답글 입력창에 자동으로 붙고, × 로 지울 수 있다. (글자 수에는 포함하지 않는 별도의 값이다.)
export function MentionChip({ nickname, onRemove }: { nickname: string; onRemove: () => void }) {
   return (
      <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-brand-orange-light py-0.5 pr-1 pl-2.5 text-xs font-bold text-brand-orange">
         @{nickname}
         <button
            type="button"
            aria-label={`@${nickname} 멘션 지우기`}
            onClick={onRemove}
            className="flex size-4 cursor-pointer items-center justify-center rounded-full hover:bg-black/10"
         >
            <X aria-hidden className="size-3" />
         </button>
      </span>
   );
}
