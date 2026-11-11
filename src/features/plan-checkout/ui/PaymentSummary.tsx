import { PLAN_MONTHLY_PRICE, type PaidPlanName } from '@/shared/config/plans';
import { formatDotDate, type YmdDate } from '@/shared/lib/date';
import { formatWon } from '@/shared/lib/formatWon';

interface PaymentSummaryProps {
   tier: PaidPlanName;
   // 개월 수가 유효하지 않으면 null이고, 이때는 날짜와 금액을 보여 주지 않는다.
   months: number | null;
   period: { start: YmdDate; end: YmdDate } | null;
   totalPrice: number | null;
}

// 이용 기간과 결제 금액 요약.
export function PaymentSummary({ tier, months, period, totalPrice }: PaymentSummaryProps) {
   return (
      <dl className="space-y-3 rounded-xl bg-brand-orange-light/60 px-6 py-6 text-sm">
         <div className="flex items-center justify-between">
            <dt className="text-black/60">이용 시작일</dt>
            <dd className="font-bold text-brand-brown">
               {period ? formatDotDate(period.start) : '-'}
            </dd>
         </div>
         <div className="flex items-center justify-between">
            <dt className="text-black/60">종료일</dt>
            <dd className="font-bold text-brand-brown">
               {period ? formatDotDate(period.end) : '-'}
            </dd>
         </div>
         <div className="flex items-center justify-between">
            <dt className="text-black/60">
               {formatWon(PLAN_MONTHLY_PRICE[tier])} × {months ?? '-'}개월
            </dt>
         </div>
         <div className="flex items-center justify-between border-t border-brand-line pt-4">
            <dt className="font-bold text-brand-brown">결제 금액</dt>
            <dd className="font-bold text-brand-brown">
               {totalPrice === null ? '-' : formatWon(totalPrice)}
            </dd>
         </div>
      </dl>
   );
}
