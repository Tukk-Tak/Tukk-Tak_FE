'use client';

import { createContext, useContext } from 'react';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastOptions {
   tone?: ToastTone;
   // 자동으로 사라지기까지의 시간(ms). 기본은 4초이다.
   duration?: number;
}

export interface ToastApi {
   show: (message: string, options?: ToastOptions) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

// 하단 중앙에 잠깐 떴다 사라지는 일반 토스트를 띄운다. ToastProvider 안에서만 쓸 수 있다.
export function useToast(): ToastApi {
   const context = useContext(ToastContext);
   if (!context) throw new Error('useToast는 ToastProvider 안에서만 사용할 수 있어요');
   return context;
}
