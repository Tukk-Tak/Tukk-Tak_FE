import Link from 'next/link';

export function HeaderLogo() {
   return (
      <Link href="/" className="flex cursor-pointer items-center gap-2">
         {/* 로고 확정 전 임시 자리. 확정되면 이 박스만 교체한다. */}
         <span
            aria-hidden
            className="bg-brand-orange-light size-6 rounded border border-dashed border-brand-orange"
         />
         <span className="font-display text-xl font-extrabold text-black">뚝딱</span>
      </Link>
   );
}
