'use client';

import { Bell } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';
import { useNotifications } from '@/entities/notification';
import { useDismissibleMenu } from '@/shared/lib/useDismissibleMenu';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { Button } from '@/shared/ui/Button';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { useToast } from '@/shared/ui/toastContext';
import { NotificationRow } from './NotificationRow';

const DELETE_FAILED_MESSAGE = '알림을 지우지 못했어요. 잠시 후 다시 시도해주세요';

// 헤더의 알림 벨과 드롭다운. 읽지 않은 알림이 있으면 벨에 점이 뜬다.
// - 드롭다운을 여는 동안은 "신규" 표시를 그대로 보여 주고, 닫을 때 모두 읽음으로 바꾼다.
// - 전체 삭제는 확인 모달을 거친다. 모달은 드롭다운 밖에 두어서, 모달을 누르는 것이 바깥 클릭으로 처리되지 않게 한다.
export function NotificationMenu() {
   const toast = useToast();
   const panelId = useId();
   const rootRef = useRef<HTMLDivElement>(null);
   const [open, setOpen] = useState(false);
   const [confirming, setConfirming] = useState(false);
   const { run, pending } = useSingleFlight();
   const { status, items, message, unreadCount, retry, remove, removeAll, markAllRead } =
      useNotifications();

   const close = useCallback(() => {
      setOpen(false);
      if (unreadCount > 0) markAllRead();
   }, [unreadCount, markAllRead]);

   // 확인 모달이 떠 있는 동안에는 Esc와 바깥 클릭을 모달이 맡는다.
   useDismissibleMenu(open, rootRef, close, confirming);

   const handleRemove = async (id: string) => {
      const ok = await remove(id);
      if (!ok) toast.show(DELETE_FAILED_MESSAGE, { tone: 'error' });
   };

   const handleRemoveAll = () => {
      setConfirming(false);
      void run(async () => {
         const ok = await removeAll();
         if (!ok) toast.show(DELETE_FAILED_MESSAGE, { tone: 'error' });
      });
   };

   return (
      <div ref={rootRef} className="relative">
         <button
            type="button"
            aria-label={unreadCount > 0 ? `알림, 읽지 않은 알림 ${unreadCount}개` : '알림'}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            onClick={() => (open ? close() : setOpen(true))}
            className="relative flex size-9 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white"
         >
            <Bell aria-hidden className="size-4.5 text-black/70" />
            {unreadCount > 0 && (
               <span
                  aria-hidden
                  className="absolute top-1.5 right-2.5 size-1.5 rounded-full bg-red-500"
               />
            )}
         </button>

         {open && (
            // 좁은 화면에서는 화면 양옆에 맞춰 펼치고, 넓은 화면에서는 벨 오른쪽 끝에 맞춘다.
            <div
               id={panelId}
               role="dialog"
               aria-label="알림"
               className="border-brand-line shadow-card absolute top-full right-0 z-10 mt-2 w-96 overflow-hidden rounded-2xl border bg-white max-sm:fixed max-sm:inset-x-4 max-sm:top-[calc(var(--header-height)+0.5rem)] max-sm:mt-0 max-sm:w-auto"
            >
               <div className="border-brand-line flex items-center justify-between border-b px-5 py-4">
                  <h2 className="text-sm font-bold text-black">알림</h2>
                  {items.length > 0 && (
                     <button
                        type="button"
                        disabled={pending}
                        onClick={() => setConfirming(true)}
                        className="cursor-pointer text-xs text-black/40 not-disabled:hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-50"
                     >
                        전체 삭제
                     </button>
                  )}
               </div>

               {status === 'loading' && (
                  <div role="status" className="animate-pulse">
                     <span className="sr-only">알림을 불러오는 중이에요</span>
                     {[0, 1, 2].map((item) => (
                        <div key={item} aria-hidden className="flex gap-3 px-5 py-4">
                           <div className="size-10 shrink-0 rounded-full bg-field-readonly" />
                           <div className="flex-1 space-y-2.5 pt-1">
                              <div className="h-3 w-4/5 rounded-full bg-field-readonly" />
                              <div className="h-3 w-1/5 rounded-full bg-field-readonly" />
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {status === 'error' && (
                  <div
                     role="alert"
                     className="flex flex-col items-center gap-3 px-5 py-10 text-center"
                  >
                     <p className="text-sm text-black/60">{message}</p>
                     <Button variant="outline" size="field" onClick={retry}>
                        다시 시도
                     </Button>
                  </div>
               )}

               {status === 'ready' && items.length === 0 && (
                  <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
                     <Bell aria-hidden className="size-8 text-black/20" strokeWidth={1.5} />
                     <p className="text-xs text-black/40">아직 받은 알림이 없어요</p>
                  </div>
               )}

               {status === 'ready' && items.length > 0 && (
                  // 알림이 많으면 이 안에서만 스크롤한다. (화면 높이에서 헤더와 여백을 뺀 만큼까지)
                  <ul className="max-h-[min(26rem,calc(100dvh-var(--header-height)-6rem))] overflow-y-auto">
                     {items.map((notification) => (
                        <NotificationRow
                           key={notification.id}
                           notification={notification}
                           onRemove={handleRemove}
                           onNavigate={close}
                        />
                     ))}
                  </ul>
               )}
            </div>
         )}

         {confirming && (
            <ConfirmModal
               title="알림을 모두 지울까요?"
               description={'지운 알림은 되돌릴 수 없어요.'}
               confirmLabel="모두 지우기"
               cancelLabel="취소"
               onConfirm={handleRemoveAll}
               onCancel={() => setConfirming(false)}
            />
         )}
      </div>
   );
}
