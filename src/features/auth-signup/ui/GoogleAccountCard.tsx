import { GoogleIcon } from '@/shared/ui/GoogleIcon';
import type { GoogleProfile } from '../types';

interface GoogleAccountCardProps {
   profile: GoogleProfile;
   onChangeAccount: () => void;
}

// 구글에서 가져온 계정 정보. 다른 계정으로 바꾸려면 구글 계정 선택부터 다시 시작한다.
export function GoogleAccountCard({ profile, onChangeAccount }: GoogleAccountCardProps) {
   return (
      <div className="border-brand-line flex items-center gap-3 rounded-xl border bg-white px-5 py-4">
         <span className="border-brand-line flex size-10 shrink-0 items-center justify-center rounded-full border bg-white">
            <GoogleIcon className="size-5" />
         </span>
         <div className="min-w-0">
            <p className="truncate text-sm font-bold text-black">{profile.name}</p>
            <p className="truncate text-xs text-black/50">{profile.email}</p>
         </div>
         <button
            type="button"
            onClick={onChangeAccount}
            className="ml-auto shrink-0 cursor-pointer text-xs font-medium text-black/70 hover:text-black"
         >
            다른 계정으로 변경
         </button>
      </div>
   );
}
