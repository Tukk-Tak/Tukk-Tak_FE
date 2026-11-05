import { setMyPlan, type CurrentPlan } from '@/entities/plan';
import { useCallback, useState } from 'react';
import type { PaidPlanName } from '@/shared/config/plans';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { payPlan } from '../api/payPlan';
import type { PaymentMethod } from '../types';
import { clampMonths, getPeriod, getTotalPrice, isValidMonths } from './period';

export type CheckoutResult = { ok: true; plan: CurrentPlan } | { ok: false } | null;

// 결제 모달의 입력 상태와 제출을 맡는다.
// 개월 수는 입력 도중 비우거나 범위를 벗어난 값도 잠시 허용하려고 문자열로 들고 있다가, 칸을 벗어날 때 1~24로 맞춘다.
export function useCheckout(tier: PaidPlanName) {
   const [monthsText, setMonthsText] = useState('1');
   const [method, setMethod] = useState<PaymentMethod | null>(null);
   const [agreed, setAgreed] = useState(false);
   const [error, setError] = useState<string | null>(null);
   // 성공하면 모달이 닫힐 때까지 제출 중 상태를 유지한다. (같은 결제가 한 번 더 전송되는 것을 막는다.)
   const [completed, setCompleted] = useState(false);
   const { run, pending } = useSingleFlight();

   const parsed = /^\d+$/.test(monthsText) ? Number(monthsText) : Number.NaN;
   // 유효하지 않은 값이면 null이다. (요약과 결제 버튼은 유효한 개월 수일 때만 보여 주고 활성화한다.)
   const months = isValidMonths(parsed) ? parsed : null;
   const submitting = pending || completed;
   const canSubmit = months !== null && method !== null && agreed && !submitting;

   const changeMonthsText = (raw: string) => {
      // 숫자만 받고, 최대 24(두 자리)까지만 입력할 수 있게 한다.
      setMonthsText(raw.replace(/\D/g, '').slice(0, 2));
      setError(null);
   };

   const stepMonths = (delta: number) => {
      setMonthsText(String(clampMonths((Number.isNaN(parsed) ? 1 : parsed) + delta)));
      setError(null);
   };

   const normalizeMonths = () => {
      setMonthsText(String(clampMonths(parsed)));
   };

   const selectMethod = (next: PaymentMethod) => {
      setMethod(next);
      setError(null);
   };

   const changeAgreed = (next: boolean) => {
      setAgreed(next);
      setError(null);
   };

   const submit = useCallback(async (): Promise<CheckoutResult> => {
      if (months === null || method === null || !agreed) return null;

      setError(null);
      const result = await run<CheckoutResult>(async () => {
         try {
            const plan = await payPlan({ tier, months, method });
            setCompleted(true);
            setMyPlan(plan);
            return { ok: true, plan };
         } catch (caught) {
            setError(toApiError(caught).message);
            return { ok: false };
         }
      });
      return result ?? null;
   }, [run, tier, months, method, agreed]);

   return {
      monthsText,
      months,
      method,
      agreed,
      error,
      submitting,
      canSubmit,
      period: months === null ? null : getPeriod(months),
      totalPrice: months === null ? null : getTotalPrice(tier, months),
      changeMonthsText,
      stepMonths,
      normalizeMonths,
      selectMethod,
      changeAgreed,
      submit,
   };
}
