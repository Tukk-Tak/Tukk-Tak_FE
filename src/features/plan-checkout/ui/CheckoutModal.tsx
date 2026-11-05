'use client';

import { useId, type FormEvent } from 'react';
import type { PaidPlanName } from '@/shared/config/plans';
import { formatDotDate } from '@/shared/lib/date';
import { formatWon } from '@/shared/lib/formatWon';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/toastContext';
import { useCheckout } from '../model/useCheckout';
import { MonthsField } from './MonthsField';
import { PaymentMethodField } from './PaymentMethodField';
import { PaymentSummary } from './PaymentSummary';
import { TermsAgreement } from './TermsAgreement';

interface CheckoutModalProps {
   tier: PaidPlanName;
   onClose: () => void;
}

// 플랜 결제 모달. 열 때마다 새로 그려서 입력값이 처음 상태로 시작한다.
export function CheckoutModal({ tier, onClose }: CheckoutModalProps) {
   const titleId = useId();
   const toast = useToast();
   const checkout = useCheckout(tier);

   // 결제 요청 중에는 닫지 못하게 한다. (닫고 나서 결제 결과를 놓치는 것을 막는다.)
   const handleClose = () => {
      if (checkout.submitting) return;
      onClose();
   };

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!checkout.canSubmit) return;

      const result = await checkout.submit();
      if (!result?.ok || !checkout.period) return;

      toast.show(
         `${tier} 플랜을 시작했어요. ${formatDotDate(checkout.period.end)}까지 이용할 수 있어요`,
         { tone: 'success' },
      );
      onClose();
   };

   return (
      <Modal titleId={titleId} onClose={handleClose} className="max-w-4xl">
         <form onSubmit={handleSubmit} noValidate className="grid md:grid-cols-[3fr_2fr]">
            <div className="space-y-6 p-6 pt-14 md:p-10">
               <div>
                  <h2 id={titleId} className="text-2xl font-bold text-black">
                     {tier} 플랜을 시작할까요?
                  </h2>
                  <p className="mt-2 text-sm text-black/50">몇 개월 이용할지 입력해주세요.</p>
               </div>

               <MonthsField
                  text={checkout.monthsText}
                  months={checkout.months}
                  disabled={checkout.submitting}
                  onTextChange={checkout.changeMonthsText}
                  onStep={checkout.stepMonths}
                  onBlur={checkout.normalizeMonths}
               />
               <PaymentMethodField
                  value={checkout.method}
                  disabled={checkout.submitting}
                  onChange={checkout.selectMethod}
               />
               <TermsAgreement
                  checked={checkout.agreed}
                  disabled={checkout.submitting}
                  onChange={checkout.changeAgreed}
               />
            </div>

            <div className="flex flex-col gap-6 border-t border-brand-line p-6 md:border-t-0 md:border-l md:p-10 md:pt-14">
               <PaymentSummary
                  tier={tier}
                  months={checkout.months}
                  period={checkout.period}
                  totalPrice={checkout.totalPrice}
               />

               <div className="mt-auto">
                  {checkout.error && (
                     <FieldMessage tone="error" className="mb-3 mt-0">
                        {checkout.error}
                     </FieldMessage>
                  )}
                  <Button
                     type="submit"
                     size="form"
                     disabled={!checkout.canSubmit}
                     className="w-full"
                  >
                     {checkout.submitting
                        ? '결제 중'
                        : checkout.totalPrice === null
                          ? '결제하고 시작하기'
                          : `${formatWon(checkout.totalPrice)} 결제하고 시작하기`}
                  </Button>
               </div>
            </div>
         </form>
      </Modal>
   );
}
