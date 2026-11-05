'use client';

import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastContext, type ToastApi, type ToastTone } from './toastContext';

interface ToastItem {
   id: number;
   message: string;
   tone: ToastTone;
   duration: number;
}

const DEFAULT_DURATION = 4000;
const MAX_TOASTS = 3;

const TONE_ICON = {
   success: <CircleCheck className="size-5 shrink-0 text-state-success" />,
   error: <CircleAlert className="size-5 shrink-0 text-state-error" />,
   info: <Info className="size-5 shrink-0 text-brand-orange" />,
};

function ToastView({ toast, onClose }: { toast: ToastItem; onClose: (id: number) => void }) {
   useEffect(() => {
      const timer = setTimeout(() => onClose(toast.id), toast.duration);
      return () => clearTimeout(timer);
   }, [toast, onClose]);

   return (
      // 오류는 바로 읽어 주고(alert), 그 밖의 안내는 하던 말이 끝난 뒤에 읽어 준다(status).
      <div
         role={toast.tone === 'error' ? 'alert' : 'status'}
         className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm text-black shadow-card"
      >
         {TONE_ICON[toast.tone]}
         <p className="min-w-0 flex-1 break-keep">{toast.message}</p>
         <button
            type="button"
            aria-label="알림 닫기"
            onClick={() => onClose(toast.id)}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-black/40 hover:text-black"
         >
            <X className="size-4" />
         </button>
      </div>
   );
}

// 일반 토스트 알림. 화면 아래 가운데에 쌓이고, 일정 시간이 지나면 사라진다.
// TODO: 디자인이 정해지면 ToastView의 모양만 바꾼다.
// TODO: 백그라운드 진행상태를 보여 주는 토스트(위치가 다름)가 생기면, 이 위치 고정 컨테이너와 별도로 만든다.
export function ToastProvider({ children }: { children: ReactNode }) {
   const [toasts, setToasts] = useState<ToastItem[]>([]);
   const nextId = useRef(0);

   const close = useCallback((id: number) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
   }, []);

   const show = useCallback<ToastApi['show']>((message, options) => {
      const toast: ToastItem = {
         id: nextId.current++,
         message,
         tone: options?.tone ?? 'info',
         duration: options?.duration ?? DEFAULT_DURATION,
      };
      // 너무 많이 쌓이지 않게 오래된 것부터 지운다.
      setToasts((prev) => [...prev, toast].slice(-MAX_TOASTS));
   }, []);

   const api = useMemo<ToastApi>(() => ({ show }), [show]);

   return (
      <ToastContext.Provider value={api}>
         {children}
         {/* 모달(z-50)보다 위에 떠야 모달 위에서도 보인다. 컨테이너는 클릭을 막지 않는다. */}
         <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-4">
            {toasts.map((toast) => (
               <ToastView key={toast.id} toast={toast} onClose={close} />
            ))}
         </div>
      </ToastContext.Provider>
   );
}
