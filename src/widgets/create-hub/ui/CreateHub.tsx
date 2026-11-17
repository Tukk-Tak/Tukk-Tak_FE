'use client';

import { LayoutTemplate, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { usePlan } from '@/entities/plan';
import { PLAN_LIMITS } from '@/shared/config/plans';
import { getEditorPathWithTemplate } from '@/shared/config/routes';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import type { StartMethod } from '../model/startMethod';
import { StartCard } from './StartCard';

interface CreateHubProps {
   // 처음에 선택해 둘 시작 방식. 없으면 아무 카드도 선택하지 않는다.
   initialMethod: StartMethod | null;
}

// 새 사이트를 만드는 방식을 고르는 화면. AI로 초안을 만들거나, 템플릿에서 시작한다.
// 카드를 누르면 선택(다시 누르면 해제)되고, 카드 안의 버튼을 누르면 그 방식으로 이동한다.
export function CreateHub({ initialMethod }: CreateHubProps) {
   const planState = usePlan();
   const [selected, setSelected] = useState<StartMethod | null>(initialMethod);

   const toggle = (method: StartMethod) =>
      setSelected((current) => (current === method ? null : method));

   // TODO: 서버에서 이번 달 남은 횟수를 받으면 교체한다. 지금은 사용 기록이 없다고 보고 플랜의 월 한도를 보여 준다.
   const remainingAi =
      planState.status === 'loading' ? null : PLAN_LIMITS[planState.plan.tier].aiUsagePerMonth;

   return (
      <ScrollArea className="h-full">
         <section className="mx-auto w-full max-w-4xl px-[4%] py-12 md:py-16">
            <header className="text-center">
               <h1 className="text-2xl font-bold text-black md:text-3xl">어떻게 시작할까요?</h1>
               <p className="mt-3 text-sm text-black/50">나중에 에디터에서 언제든 바꿀 수 있어요</p>
            </header>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
               <StartCard
                  recommended
                  icon={<Sparkles className="size-6" />}
                  title="AI로 초안 만들기"
                  description={
                     '질문에 차근차근 답하면\nAI가 가게에 맞는 사이트의 초안을 만들어 줘요'
                  }
                  note={`${remainingAi !== null ? `남은 AI ${remainingAi}회` : ''}`}
                  buttonLabel="AI로 시작하기"
                  href="/create/ai"
                  selected={selected === 'ai'}
                  onSelect={() => toggle('ai')}
               />
               <StartCard
                  icon={<LayoutTemplate className="size-6" />}
                  title="템플릿으로 시작하기"
                  description={'마음에 드는 구성의 템플릿을 골라\n바로 편집을 시작해요'}
                  note="AI 횟수를 쓰지 않아요!"
                  buttonLabel="템플릿 고르기"
                  href="/create/template"
                  selected={selected === 'template'}
                  onSelect={() => toggle('template')}
               />
            </div>

            {/* 빈 템플릿(블록이 없는 사이트)으로 에디터를 연다. 템플릿 선택 화면의 빈 템플릿 카드와 같은 동작이다. */}
            <p className="mt-10 text-center">
               <Link
                  href={getEditorPathWithTemplate('blank')}
                  className="cursor-pointer text-sm text-black/50 underline underline-offset-4 transition-colors hover:text-brand-orange"
               >
                  빈 화면에서 시작하기
               </Link>
            </p>
         </section>
      </ScrollArea>
   );
}
