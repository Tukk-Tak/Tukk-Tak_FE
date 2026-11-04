import { Mail } from 'lucide-react';

interface EmailSummaryCardProps {
   email: string;
   onEdit: () => void;
}

// 2단계 위쪽에 보여주는, 인증을 마친 이메일 요약
export function EmailSummaryCard({ email, onEdit }: EmailSummaryCardProps) {
   return (
      <div className="bg-brand-orange-light flex items-center gap-2 rounded-xl px-5 py-3">
         <Mail aria-hidden className="size-4 shrink-0 text-black/50" />
         <span className="min-w-0 truncate text-xs font-bold text-black">{email}</span>
         <span className="shrink-0 text-xs font-bold text-state-success">인증 완료</span>
         <button
            type="button"
            onClick={onEdit}
            className="ml-auto shrink-0 cursor-pointer text-xs text-black/50 hover:text-black"
         >
            수정
         </button>
      </div>
   );
}
