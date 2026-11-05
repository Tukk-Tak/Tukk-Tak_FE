'use client';

import { useRouter } from 'next/navigation';
import { useId, type FormEvent } from 'react';
import type { PaidPlanName } from '@/shared/config/plans';
import { formatDotDate, type YmdDate } from '@/shared/lib/date';
import { formatWon } from '@/shared/lib/formatWon';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/ui/toastContext';
import { CHECKOUT_ERROR } from '../model/errorCodes';
import { useCheckout } from '../model/useCheckout';
import { MonthsField } from './MonthsField';
import { PaymentMethodField } from './PaymentMethodField';
import { PaymentSummary } from './PaymentSummary';
import { TermsAgreement } from './TermsAgreement';

// 결제가 끝나면 이동할 곳. 지금은 결제 내역을 볼 마이페이지로 정했다.
// TODO: 마이페이지가 만들어지면 경로를 맞춘다. (아직 없는 페이지라 이동하면 404가 난다.)
const PAYMENT_SUCCESS_PATH = '/mypage';

interface PaymentModalProps {
   tier: PaidPlanName;
   onClose: () => void;
   // 제목 문구. 마이페이지의 연장처럼 다른 곳에서 쓸 때 바꾼다. 기본은 첫 결제 문구이다.
   title?: string;
   // 이용 시작일. 없으면 오늘이다. (연장은 현재 만료일 다음 날부터 시작한다.)
   startDate?: YmdDate;
}

// 플랜 결제 모달. 요금제 페이지의 첫 결제와 마이페이지의 연장에서 함께 쓰도록 만들었다.
// 열 때마다 새로 그려서 입력값이 처음 상태로 시작한다.
// TODO: 마이페이지 연장 흐름에 연결한다. (제목과 시작일 외에 연장에 필요한 값이 더 있는지 그때 확인한다.)
export function PaymentModal({ tier, onClose, title, startDate }: PaymentModalProps) {
   const titleId = useId();
   const router = useRouter();
   const toast = useToast();
   const checkout = useCheckout(tier, startDate);

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
         `${tier} 플랜을 시작했어요.\n${formatDotDate(checkout.period.end)}까지 이용할 수 있어요`,
         { tone: 'success' },
      );
      onClose();
      router.push(PAYMENT_SUCCESS_PATH);
   };

   return (
      <Modal titleId={titleId} onClose={handleClose} className="max-w-4xl">
         <form onSubmit={handleSubmit} noValidate className="grid md:grid-cols-[3fr_2fr]">
            <div className="space-y-6 p-6 pt-14 md:p-10">
               <div>
                  <h2 id={titleId} className="text-2xl font-bold text-black">
                     {title ?? `${tier} 플랜을 시작할까요?`}
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

            {/* 가운데 세로선은 border 대신 가상 요소로 그려서, 위아래(inset-y)에 여백을 둔다. */}
            <div className="relative flex flex-col gap-6 border-t border-brand-line p-6 md:border-t-0 md:p-10 md:pt-14 md:before:absolute md:before:inset-y-10 md:before:left-0 md:before:w-px md:before:bg-brand-line">
               <PaymentSummary
                  tier={tier}
                  months={checkout.months}
                  period={checkout.period}
                  totalPrice={checkout.totalPrice}
               />

               <div className="mt-auto">
                  {checkout.submitting && !checkout.error && (
                     <p
                        role="status"
                        className="mb-3 text-xs break-keep whitespace-pre-line text-black/50"
                     >
                        {'결제를 진행하고 있어요.\n창을 닫지 말고 잠시만 기다려주세요'}
                     </p>
                  )}
                  {checkout.error && (
                     // 결제 취소는 오류가 아니라 안내로 보여 준다. (오류만 바로 읽어 주는 alert이다.)
                     <div
                        role={
                           checkout.error.code === CHECKOUT_ERROR.CANCELED ? 'status' : undefined
                        }
                     >
                        <FieldMessage
                           tone={checkout.error.code === CHECKOUT_ERROR.CANCELED ? 'hint' : 'error'}
                           className="mb-3 mt-0 break-keep whitespace-pre-line"
                        >
                           {checkout.error.message}
                        </FieldMessage>
                     </div>
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
