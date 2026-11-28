import {
   Bell,
   Check,
   CreditCard,
   Heart,
   MessageSquare,
   Sparkles,
   TriangleAlert,
   type LucideIcon,
} from 'lucide-react';
import type { NotificationType } from '../types';

const NORMAL = 'bg-brand-orange-light text-brand-orange';
const FAILED = 'bg-state-error/10 text-state-error';

const ICONS: Record<NotificationType, { Icon: LucideIcon; className: string }> = {
   COMMENT: { Icon: MessageSquare, className: NORMAL },
   LIKE: { Icon: Heart, className: NORMAL },
   PAYMENT_EXPIRE: { Icon: CreditCard, className: NORMAL },
   AI_COMPLETE: { Icon: Sparkles, className: NORMAL },
   AI_FAILED: { Icon: TriangleAlert, className: FAILED },
   DEPLOY_COMPLETE: { Icon: Check, className: NORMAL },
   DEPLOY_FAILED: { Icon: TriangleAlert, className: FAILED },
   // 서버가 나중에 늘린 종류. 아이콘이 정해지기 전에도 알림은 보여 준다.
   UNKNOWN: { Icon: Bell, className: NORMAL },
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
