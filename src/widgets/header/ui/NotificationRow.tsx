'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import { NotificationIcon, type NotificationData } from '@/entities/notification';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';

interface NotificationRowProps {
   notification: NotificationData;
   onRemove: (id: string) => void;
   // 이동하는 알림을 눌렀을 때(드롭다운을 닫는다)
   onNavigate: () => void;
}

const BODY_CLASS = 'flex items-start gap-3 py-4 pr-12 pl-5';

// 알림 한 줄. 읽지 않은 알림은 배경색과 "신규" 배지로 알린다. 이동할 곳(href)이 있으면 누를 수 있고, 없으면 글자만 보여 준다.
// 삭제 버튼은 링크 바깥에 둔다. (링크 안에 버튼을 넣을 수 없다.)
export function NotificationRow({ notification, onRemove, onNavigate }: NotificationRowProps) {
   const { id, type, message, createdAt, isNew, href } = notification;

   const body = (
      <>
         <NotificationIcon type={type} />
         <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug font-medium break-keep wrap-break-word text-black/80">
               {message}
               {isNew && (
                  <span className="ml-2 inline-block rounded-full bg-brand-orange px-2 py-0.5 align-middle text-[0.625rem] leading-none font-bold text-white">
                     신규
                  </span>
               )}
            </p>
            <p className="mt-1 text-xs text-black/40">{formatRelativeTime(createdAt)}</p>
         </div>
      </>
   );

   return (
      <li
         className={`border-brand-line relative border-b last:border-b-0 ${isNew ? 'bg-brand-orange-light/70' : ''}`}
      >
         {href ? (
            <Link
               href={href}
               onClick={onNavigate}
               className={`${BODY_CLASS} hover:bg-black/[0.03]`}
            >
               {body}
            </Link>
         ) : (
            <div className={BODY_CLASS}>{body}</div>
         )}
         <button
            type="button"
            aria-label="알림 삭제"
            onClick={() => onRemove(id)}
            className="absolute top-3.5 right-3 flex size-7 cursor-pointer items-center justify-center rounded-full text-black/30 hover:bg-black/5 hover:text-black/70"
         >
            <X aria-hidden className="size-4" />
         </button>
      </li>
   );
}
