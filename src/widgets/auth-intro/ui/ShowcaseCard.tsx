export function ShowcaseCard({ name }: { name: string }) {
   return (
      <li className="border-brand-line overflow-hidden rounded-lg border bg-white">
         {/* 가게 사진이 정해지기 전까지 쓰는 임시 자리. 사진이 생기면 이 박스만 이미지로 교체한다. */}
         <div aria-hidden className="bg-brand-line/50 h-[clamp(40px,10vh,90px)]" />
         <p className="px-2 py-2.5 text-[clamp(0.625rem,0.95vw,0.75rem)] font-bold text-black">
            {name}
         </p>
      </li>
   );
}
