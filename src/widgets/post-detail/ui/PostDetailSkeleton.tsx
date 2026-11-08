// 게시물을 불러오는 동안 보이는 자리 표시. 본문의 모양(사진, 반응 줄, 제목, 글, 태그)을 그대로 따라 그린다.
export function PostDetailSkeleton() {
   return (
      <div role="status" className="mt-6 animate-pulse">
         <span className="sr-only">게시물을 불러오는 중이에요</span>
         <div aria-hidden>
            <div className="aspect-21/10 w-full rounded-2xl bg-field-readonly" />
            <div className="mt-5 flex gap-8 border-b border-brand-line pb-4">
               <div className="h-4 w-20 rounded-full bg-field-readonly" />
               <div className="h-4 w-20 rounded-full bg-field-readonly" />
               <div className="h-4 w-16 rounded-full bg-field-readonly" />
            </div>
            <div className="mt-6 h-8 w-3/5 rounded-lg bg-field-readonly" />
            <div className="mt-3 h-3 w-40 rounded-full bg-field-readonly" />
            <div className="mt-5 space-y-3">
               <div className="h-3 w-full rounded-full bg-field-readonly" />
               <div className="h-3 w-11/12 rounded-full bg-field-readonly" />
               <div className="h-3 w-4/6 rounded-full bg-field-readonly" />
            </div>
            <div className="mt-6 flex gap-2">
               <div className="h-9 w-16 rounded-full bg-field-readonly" />
               <div className="h-9 w-16 rounded-full bg-field-readonly" />
               <div className="h-9 w-20 rounded-full bg-field-readonly" />
            </div>
         </div>
      </div>
   );
}
