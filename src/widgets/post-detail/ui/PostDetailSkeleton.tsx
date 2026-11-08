// 게시물을 불러오는 동안 보이는 자리 표시. 본문의 모양(사진, 반응 줄, 제목, 글, 태그)과 오른쪽 댓글 카드 자리를 그대로 따라 그린다.
export function PostDetailSkeleton() {
   return (
      <div role="status" className="grid animate-pulse gap-8 lg:grid-cols-[minmax(0,1fr)_23rem]">
         <span className="sr-only">게시물을 불러오는 중이에요</span>

         <div aria-hidden className="min-w-0">
            <div className="h-5 w-20 rounded-full bg-field-readonly" />
            <div className="mt-6 aspect-21/10 w-full rounded-2xl bg-field-readonly" />
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

         {/* 댓글 카드 자리: 실제 카드(PostDetail, CommentCard)와 같은 시작 위치(lg:pt-12 → mt-12)와 높이를 쓴다. */}
         <div
            aria-hidden
            className="self-start overflow-hidden rounded-2xl border border-brand-line bg-white lg:mt-12 lg:h-[calc(100dvh-var(--header-height)-4rem)] lg:w-full"
         >
            <div className="border-b border-brand-line px-5 py-5">
               <div className="h-4 w-10 rounded-full bg-field-readonly" />
               <div className="mt-3 h-11 w-full rounded-xl bg-field-readonly" />
            </div>
            {[0, 1, 2, 3, 4, 5, 6].map((item) => (
               <div
                  key={item}
                  className="flex gap-3 border-b border-brand-line px-5 py-4 last:border-b-0"
               >
                  <div className="size-8 shrink-0 rounded-full bg-field-readonly" />
                  <div className="flex-1 space-y-2.5">
                     <div className="h-3 w-1/4 rounded-full bg-field-readonly" />
                     <div className="h-3 w-full rounded-full bg-field-readonly" />
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
