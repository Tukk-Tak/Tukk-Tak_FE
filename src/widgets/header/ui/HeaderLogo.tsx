import Link from 'next/link';
import { BrandLogo } from '@/shared/ui/BrandLogo';

export function HeaderLogo() {
   return (
      <Link href="/" className="flex cursor-pointer items-center gap-2">
         <BrandLogo />
         <span className="font-display text-xl font-extrabold text-black">뚝딱</span>
      </Link>
   );
}
