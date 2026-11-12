import { Plus } from 'lucide-react';

// 빈 템플릿의 미리보기. 블록이 없으므로 더하기 표시만 둔다.
export function BlankThumbnail() {
   return (
      <div className="flex size-full items-center justify-center">
         <span className="flex size-12 items-center justify-center rounded-full border border-brand-line bg-white text-brand-line">
            <Plus aria-hidden className="size-5 text-[#A6A09B]" />
         </span>
      </div>
   );
}
