import { Check, Minus } from 'lucide-react';
import Link from 'next/link';
import {
   PLAN_LIMITS,
   PLAN_MONTHLY_PRICE,
   type PaidPlanName,
   type PlanName,
} from '@/shared/config/plans';
import { formatDotDate, parseIsoDate } from '@/shared/lib/date';
import { formatWon } from '@/shared/lib/formatWon';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';

// loading: 로그인·플랜을 확인하는 중 / guest: 로그인하지 않음 / current: 지금 이용 중인 플랜 / other: 그 밖의 플랜
export type PlanCardState = 'loading' | 'guest' | 'current' | 'other';

interface PlanCardProps {
   tier: PlanName;
   tagline: string;
   // 가장 많이 선택하는 플랜(배지와 주황 테두리로 강조)
   highlighted?: boolean;
   state: PlanCardState;
   // 이용 중인 유료 플랜의 만료일(YYYY-MM-DD)
   expiresAt: string | null;
   onStart: (tier: PaidPlanName) => void;
}

function getFeatureRows(tier: PlanName) {
   const limits = PLAN_LIMITS[tier];
   return [
      // 시안에서 FREE만 "월" 없이 "1회"로 표기한다.
      {
         label: 'AI 페이지 생성',
         value: tier === 'FREE' ? `${limits.aiUsagePerMonth}회` : `월 ${limits.aiUsagePerMonth}회`,
         available: true,
      },
      {
         label: '사이트 배포',
         value: limits.siteDeployLimit === 0 ? '불가' : `${limits.siteDeployLimit}개`,
         available: limits.siteDeployLimit > 0,
      },
      { label: '임시저장', value: `${limits.siteSaveLimit}개`, available: true },
   ];
}

function PlanAction({
   tier,
   highlighted,
   state,
   onStart,
}: Pick<PlanCardProps, 'tier' | 'highlighted' | 'state' | 'onStart'>) {
   const variant = highlighted ? 'solid' : 'outline';

   if (state === 'current') {
      return (
         <Button size="form" disabled className="w-full">
            이용 중
         </Button>
      );
   }

   if (tier === 'FREE') {
      // 이미 유료 플랜을 쓰는 사람에게 FREE는 선택지가 아니다.
      if (state === 'guest') {
         return (
            <ButtonLink href="/signup" size="form" variant="outline" className="w-full">
               무료로 시작하기
            </ButtonLink>
         );
      }
      return (
         <Button size="form" variant="outline" disabled className="w-full">
            {state === 'loading' ? '무료로 시작하기' : '기본 플랜'}
         </Button>
      );
   }

   if (state === 'guest') {
      // 로그인하지 않았으면 먼저 로그인하게 한다. (로그인 후 이 페이지로 돌아오는 기능은 아직 없다.)
      return (
         <ButtonLink href="/login" size="form" variant={variant} className="w-full">
            {tier} 시작하기
         </ButtonLink>
      );
   }

   return (
      <Button
         size="form"
         variant={variant}
         disabled={state === 'loading'}
         onClick={() => onStart(tier)}
         className="w-full"
      >
         {tier} 시작하기
      </Button>
   );
}

export function PlanCard({
   tier,
   tagline,
   highlighted = false,
   state,
   expiresAt,
   onStart,
}: PlanCardProps) {
   const expiry = expiresAt ? parseIsoDate(expiresAt) : null;

   return (
      <article
         className={`relative flex flex-col rounded-2xl bg-white p-8 ${
            highlighted ? 'border-2 border-brand-orange' : 'border border-brand-line'
         }`}
      >
         {highlighted && (
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-orange px-4 py-1.5 text-xs font-bold text-white">
               가장 많이 선택해요
            </span>
         )}

         <h2
            className={`text-xs font-bold tracking-widest ${
               highlighted ? 'text-brand-orange' : 'text-black/60'
            }`}
         >
            {tier}
         </h2>
         <p className="mt-2 text-xs text-black/50">{tagline}</p>

         <p className="mt-6 flex items-baseline gap-2 text-black">
            {tier === 'FREE' ? (
               <>
                  <span className="text-3xl font-bold">0원</span>
                  <span className="text-xs text-black/50">계속 무료</span>
               </>
            ) : (
               <>
                  <span className="text-3xl font-bold">{formatWon(PLAN_MONTHLY_PRICE[tier])}</span>
                  <span className="text-xs text-black/50">/ 월</span>
               </>
            )}
         </p>

         <ul className="mt-6 space-y-4 border-t border-brand-line pt-6">
            {getFeatureRows(tier).map((row) => (
               <li key={row.label} className="flex items-center gap-3 text-sm text-black">
                  <span
                     aria-hidden
                     className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                        row.available
                           ? 'bg-brand-orange-light text-brand-orange'
                           : 'bg-field-disabled text-black/30'
                     }`}
                  >
                     {row.available ? (
                        <Check className="size-3.5" />
                     ) : (
                        <Minus className="size-3.5" />
                     )}
                  </span>
                  <span className="flex-1">{row.label}</span>
                  <span
                     className={`font-bold ${row.available ? 'text-brand-brown' : 'text-black/40'}`}
                  >
                     {row.value}
                  </span>
               </li>
            ))}
         </ul>

         {state === 'current' && expiry && (
            // 기능 목록 바로 아래에 붙인다. (버튼 위에 두면 목록과 사이가 크게 벌어진다.)
            // 한 줄에 이어 쓰면 카드 폭에서 어색하게 끊겨서, 만료일과 링크를 두 줄로 나눈다.
            <p className="mt-5 space-y-1 text-center text-xs text-black/60">
               <span className="block">{formatDotDate(expiry)}까지 이용할 수 있어요</span>
               {/* 마이페이지의 결제 내역으로 간다. (연장은 거기서 한다. 경로는 마이페이지 메뉴와 같아야 한다.) */}
               <Link
                  href="/mypage/payments"
                  className="block font-bold text-brand-orange underline-offset-2 hover:underline"
               >
                  결제 내역·연장 보기
               </Link>
            </p>
         )}

         <div className="mt-auto pt-5">
            <PlanAction tier={tier} highlighted={highlighted} state={state} onStart={onStart} />
         </div>
      </article>
   );
}
