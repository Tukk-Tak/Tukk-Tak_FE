'use client';

import { Share2 } from 'lucide-react';
import { useToast } from '@/shared/ui/toastContext';

// 지금 보고 있는 글의 주소를 복사한다. 복사하지 못하면(클립보드를 쓸 수 없는 환경) 직접 복사하도록 안내한다.
export function ShareButton() {
   const toast = useToast();

   const copyLink = async () => {
      try {
         await navigator.clipboard.writeText(window.location.href);
         toast.show('링크를 복사했어요', { tone: 'success' });
      } catch {
         toast.show('링크를 복사하지 못했어요. 주소창의 주소를 직접 복사해주세요', {
            tone: 'error',
         });
      }
   };

   return (
      <button
         type="button"
         onClick={copyLink}
         className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-black/60 hover:bg-black/5"
      >
         <Share2 aria-hidden className="size-5" />
         공유
      </button>
   );
}
