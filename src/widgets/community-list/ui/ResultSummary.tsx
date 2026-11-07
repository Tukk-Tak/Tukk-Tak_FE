import { X } from 'lucide-react';
import type { ParsedQuery } from '@/features/community-search';

interface ResultSummaryProps {
   query: Exclude<ParsedQuery, { kind: 'none' }>;
   totalCount: number;
   onReset: () => void;
}

// 검색 중일 때 결과 개수를 알려 주고 검색을 해제하는 곳.
// 글자 검색은 "'맛집' 검색 결과 12건 + 검색 초기화", 태그 검색은 "#맛집 ×" 칩과 "이 태그의 글 12개"로 보여 준다.
// 개수는 스크린 리더가 검색 결과가 바뀔 때마다 읽어 준다(aria-live).
export function ResultSummary({ query, totalCount, onReset }: ResultSummaryProps) {
   if (query.kind === 'tag') {
      return (
         <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
               type="button"
               aria-label={`#${query.tag} 태그 검색 해제`}
               onClick={onReset}
               className="flex max-w-full cursor-pointer items-center gap-1.5 rounded-full bg-brand-orange-light px-3 py-1.5 text-xs font-bold text-brand-brown hover:bg-brand-line/50"
            >
               <span className="truncate">#{query.tag}</span>
               <X aria-hidden className="size-3.5 shrink-0" />
            </button>
            <p aria-live="polite" className="text-xs text-black/50">
               이 태그의 글 {totalCount}개
            </p>
         </div>
      );
   }

   return (
      <div className="mt-5 flex items-center justify-between gap-4">
         <p aria-live="polite" className="min-w-0 text-sm font-bold break-all text-brand-brown">
            &lsquo;{query.text}&rsquo; 검색 결과 {totalCount}건
         </p>
         <button
            type="button"
            onClick={onReset}
            className="shrink-0 cursor-pointer text-xs text-black/50 hover:text-black hover:underline"
         >
            검색 초기화
         </button>
      </div>
   );
}
