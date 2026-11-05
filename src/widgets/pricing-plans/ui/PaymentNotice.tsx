// 결제 수단 안내. 로고는 공식 에셋을 받기 전까지 글자와 색 배지로 대신한다.
// TODO: 토스·카카오페이 공식 로고(SVG)를 받으면 배지를 이미지로 교체한다. (각 브랜드 가이드의 사용 규정을 따른다.)
export function PaymentNotice() {
   return (
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-black/40">
         <span>안전하고 간편한 결제</span>
         <span aria-hidden className="h-3 w-px bg-brand-line" />
         <span className="font-bold text-[#0064ff]">toss</span>
         <span className="rounded-md bg-[#fee500] px-2 py-1 font-bold text-black">kakao pay</span>
         <span>토스 · 카카오페이로 결제할 수 있어요</span>
      </div>
   );
}
