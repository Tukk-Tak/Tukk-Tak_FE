import {
   Check,
   Heart,
   MessageSquare,
   Sparkles,
   TriangleAlert,
   type LucideIcon,
} from 'lucide-react';
import type { NotificationType } from '../types';

const ICONS: Record<NotificationType, { Icon: LucideIcon; className: string }> = {
   draft_failed: { Icon: TriangleAlert, className: 'bg-state-error/10 text-state-error' },
   draft_done: { Icon: Sparkles, className: 'bg-brand-orange-light text-brand-orange' },
   comment: { Icon: MessageSquare, className: 'bg-brand-orange-light text-brand-orange' },
   like: { Icon: Heart, className: 'bg-brand-orange-light text-brand-orange' },
   deployed: { Icon: Check, className: 'bg-brand-orange-light text-brand-orange' },
};

// 알림 종류를 나타내는 동그란 아이콘. 실패만 빨간색이고 나머지는 주황색이다. (장식이라 스크린 리더는 읽지 않는다.)
export function NotificationIcon({ type }: { type: NotificationType }) {
   const { Icon, className } = ICONS[type];

   return (
      <span
         aria-hidden
         className={`flex size-10 shrink-0 items-center justify-center rounded-full ${className}`}
      >
         <Icon className="size-4.5" />
      </span>
   );
}
