'use client';

import { useState } from 'react';
import { usePlan } from '@/entities/plan';
import { useSession } from '@/entities/user/model/useSession';
import { PaymentModal } from '@/features/plan-checkout';
import type { PaidPlanName, PlanName } from '@/shared/config/plans';
import { PaymentNotice } from './PaymentNotice';
import { PlanCard, type PlanCardState } from './PlanCard';

const PLANS: { tier: PlanName; tagline: string; highlighted?: boolean }[] = [
   { tier: 'FREE', tagline: '가볍게 시작해 보고 싶은 사장님' },
   { tier: 'BASIC', tagline: '첫 가게 페이지를 운영하는 사장님', highlighted: true },
   { tier: 'PREMIUM', tagline: '여러 가게를 함께 관리하는 사장님' },
];

// 요금제 안내. 로그인 여부와 현재 플랜에 따라 카드의 버튼이 달라지고, 유료 플랜을 고르면 결제 모달을 연다.
export function PricingPlans() {
   const session = useSession();
   const planState = usePlan();
   const [checkoutTier, setCheckoutTier] = useState<PaidPlanName | null>(null);

   const loading =
      session.status === 'loading' || (session.user !== null && planState.status === 'loading');
   // 플랜은 로그인한 사용자에게만 의미가 있다.
   const currentPlan = session.user ? planState.plan : null;

   const getCardState = (tier: PlanName): PlanCardState => {
      if (loading) return 'loading';
      if (!session.user) return 'guest';
      // 플랜을 확인하지 못한 경우는 FREE로 본다. (usePlan은 조회 실패 시 FREE를 돌려준다.)
      return (currentPlan?.tier ?? 'FREE') === tier ? 'current' : 'other';
   };

   return (
      <section className="mx-auto w-full max-w-5xl px-[4%] py-12 md:py-10">
         <header className="text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-brand-orange">PRICING</p>
            <h1 className="mt-3 text-2xl font-bold text-black md:text-3xl">
               사장님 가게에 맞는 플랜을 골라보세요
            </h1>
            <p className="mt-3 text-sm text-black/50">
               신용카드 등록 없이 무료로 시작하고, 필요할 때 업그레이드하세요.
            </p>
         </header>

         <div className="mx-auto mt-14 grid max-w-md gap-8 lg:max-w-none lg:grid-cols-3 lg:gap-6">
            {PLANS.map((plan) => (
               <PlanCard
                  key={plan.tier}
                  {...plan}
                  state={getCardState(plan.tier)}
                  expiresAt={
                     getCardState(plan.tier) === 'current' ? (currentPlan?.expiresAt ?? null) : null
                  }
                  onStart={setCheckoutTier}
               />
            ))}
         </div>

         <PaymentNotice />

         {checkoutTier && (
            <PaymentModal tier={checkoutTier} onClose={() => setCheckoutTier(null)} />
         )}
      </section>
   );
}
