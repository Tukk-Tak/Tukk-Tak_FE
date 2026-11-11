import type { ReactNode } from 'react';

interface MypagePageHeaderProps {
   // 제목 위의 영문 소제목 (MY ACCOUNT 등)
   eyebrow: string;
   title: string;
   description?: string;
   // 제목 줄 오른쪽에 놓을 버튼이나 배지 (정보 수정, 인증 상태 등)
   action?: ReactNode;
}

// 마이페이지 각 화면의 맨 위 머리말. 모든 화면이 같은 모양(소제목, 제목, 설명, 오른쪽 자리)을 쓴다.
export function MypagePageHeader({ eyebrow, title, description, action }: MypagePageHeaderProps) {
   return (
      <header className="flex items-start justify-between gap-4">
         <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.2em] text-brand-orange">{eyebrow}</p>
            <h1 className="mt-1 text-2xl font-bold text-black md:text-3xl">{title}</h1>
            {description && <p className="mt-2 text-sm text-black/40">{description}</p>}
         </div>
         {action && <div className="shrink-0">{action}</div>}
      </header>
   );
}
