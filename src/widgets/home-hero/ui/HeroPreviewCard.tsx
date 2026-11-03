// 브라우저 창 모양의 장식용 카드. 데이터 없이 모양만 보여주므로 스크린 리더에서는 숨긴다.
// 좁은 화면(lg 미만)에서는 세로로 쌓이며 공간만 차지해 숨긴다.
export function HeroPreviewCard() {
   return (
      <div
         aria-hidden
         className="border-brand-line rounded-card shadow-card hidden aspect-14/9 border bg-white p-7 lg:block lg:w-[46%]"
      >
         <div className="flex gap-2">
            <span className="bg-brand-line size-3.5 rounded-full" />
            <span className="bg-brand-line size-3.5 rounded-full" />
            <span className="bg-brand-line size-3.5 rounded-full" />
         </div>

         <div className="mt-6 flex flex-col gap-3.5">
            <div className="border-brand-line rounded-xl border px-5 py-5">
               <div className="h-2.5 w-3/4 rounded-full bg-black/10" />
               <div className="mt-2.5 h-2.5 w-1/2 rounded-full bg-black/5" />
            </div>

            <div className="border-brand-line rounded-xl border px-5 py-5">
               <div className="h-2.5 w-3/5 rounded-full bg-black/10" />
               <div className="mt-4 flex gap-2">
                  <span className="bg-brand-orange size-6 rounded-full" />
                  <span className="bg-brand-brown size-6 rounded-full" />
                  <span className="bg-brand-line size-6 rounded-full" />
               </div>
            </div>

            <div className="border-brand-line rounded-xl border px-5 py-5">
               <div className="h-2.5 w-1/2 rounded-full bg-black/10" />
            </div>
         </div>
      </div>
   );
}
