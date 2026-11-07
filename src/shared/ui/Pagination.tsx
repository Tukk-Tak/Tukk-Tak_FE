import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPageItems } from '../lib/pagination';

interface PaginationProps {
   page: number;
   totalPages: number;
   onChange: (page: number) => void;
   className?: string;
}

const ARROW_CLASS =
   'flex size-9 cursor-pointer items-center justify-center rounded-full text-black/60 not-disabled:hover:bg-black/5 disabled:cursor-not-allowed disabled:text-black/20';

// 페이지 이동 버튼 (이전 · 번호 · 다음). 페이지가 한 장뿐이면 아무것도 그리지 않는다.
export function Pagination({ page, totalPages, onChange, className = '' }: PaginationProps) {
   if (totalPages <= 1) return null;

   return (
      <nav
         aria-label="페이지 이동"
         className={`flex items-center justify-center gap-1 ${className}`}
      >
         <button
            type="button"
            aria-label="이전 페이지"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            className={ARROW_CLASS}
         >
            <ChevronLeft className="size-4" />
         </button>

         {getPageItems(page, totalPages).map((item) =>
            typeof item === 'number' ? (
               <button
                  key={item}
                  type="button"
                  aria-label={`${item}페이지`}
                  aria-current={item === page ? 'page' : undefined}
                  onClick={() => item !== page && onChange(item)}
                  className={`flex size-9 cursor-pointer items-center justify-center rounded-full text-sm ${
                     item === page
                        ? 'bg-brand-orange font-bold text-white'
                        : 'text-black/50 hover:bg-black/5'
                  }`}
               >
                  {item}
               </button>
            ) : (
               <span
                  key={item}
                  aria-hidden
                  className="flex size-9 items-center justify-center text-black/30"
               >
                  …
               </span>
            ),
         )}

         <button
            type="button"
            aria-label="다음 페이지"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            className={ARROW_CLASS}
         >
            <ChevronRight className="size-4" />
         </button>
      </nav>
   );
}
