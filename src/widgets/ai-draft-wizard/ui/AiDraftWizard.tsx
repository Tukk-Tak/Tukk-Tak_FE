'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePlan } from '@/entities/plan';
import {
   AiDraftFormProvider,
   BasicInfoStep,
   ConfirmStep,
   type EditableStepId,
   MoodStep,
   isMoodComplete,
   isScaleComplete,
   isSectionsComplete,
   SectionsStep,
   ScaleStep,
   isStepComplete,
   hasAiDraftInput,
   LeaveConfirmModal,
   type LeaveModalKind,
   useLeaveGuard,
   isBasicInfoComplete,
   useAiDraftForm,
} from '@/features/ai-draft';
import { PLAN_LIMITS } from '@/shared/config/plans';
import { CREATE_PATH, getEditorPathWithTemplate } from '@/shared/config/routes';
import { ScrollArea } from '@/shared/ui/ScrollArea';
import { AI_DRAFT_STEP_COUNT, AI_DRAFT_STEPS } from '../model/steps';
import { FlowProgress } from './FlowProgress';
import { StepNav } from './StepNav';
import { StepPanel } from './StepPanel';
import { WizardFooter } from './WizardFooter';

// 입력값은 이 화면 안에서만 들고 있는다. 화면을 벗어나면 Provider가 사라지면서 값도 함께 사라진다.
export function AiDraftWizard() {
   return (
      <AiDraftFormProvider>
         <WizardBody />
      </AiDraftFormProvider>
   );
}

// AI 초안 입력 화면의 틀. 위에 큰 흐름, 왼쪽에 입력 5단계, 가운데에 단계별 내용, 아래에 이동 버튼을 둔다.
// 단계는 주소가 아니라 화면 상태로 바꾼다. 그래서 브라우저 뒤로 가기는 단계가 아니라 허브로 나간다.
function WizardBody() {
   const router = useRouter();
   const planState = usePlan();
   const { values } = useAiDraftForm();
   const [current, setCurrent] = useState(0);
   // 직접 누른 [이전](1단계)과 [건너뛰고 직접 편집하기]의 확인 모달. 뒤로 가기·헤더 링크는 useLeaveGuard가 맡는다.
   const [leaveRequest, setLeaveRequest] = useState<Exclude<LeaveModalKind, 'page'> | null>(null);

   // 입력한 값이 하나라도 있을 때만 나가기 전에 확인을 받는다.
   const hasInput = hasAiDraftInput(values);
   const guard = useLeaveGuard(hasInput);

   // 단계는 필수 항목을 비워 둬도 넘어갈 수 있다. 마지막 단계의 [AI로 초안 만들기]만 모든 필수 항목을 채워야 켜진다.
   const canSubmit =
      isBasicInfoComplete(values) &&
      isMoodComplete(values) &&
      isScaleComplete(values) &&
      isSectionsComplete(values);
   // 필수 항목을 모두 채운 단계는 사이드바에서 숫자 대신 체크로 보여 준다.
   const completed = AI_DRAFT_STEPS.map((step) => isStepComplete(step.id, values));

   // TODO: 서버에서 이번 달 남은 횟수를 받으면 교체한다. (허브와 같은 임시 값)
   const remainingAi =
      planState.status === 'loading' ? null : PLAN_LIMITS[planState.plan.tier].aiUsagePerMonth;

   const goPrev = () => {
      if (current > 0) {
         setCurrent(current - 1);
         return;
      }
      if (hasInput) setLeaveRequest('restart');
      else router.push(CREATE_PATH);
   };

   // 최종 확인의 [수정]에서 해당 단계로 돌아간다.
   const goToStep = (stepId: EditableStepId) =>
      setCurrent(AI_DRAFT_STEPS.findIndex((step) => step.id === stepId));

   const goNext = () => setCurrent((index) => Math.min(index + 1, AI_DRAFT_STEP_COUNT - 1));

   const skip = () => {
      if (hasInput) setLeaveRequest('skip');
      else router.push(getEditorPathWithTemplate('blank'));
   };

   const confirmLeave = () => {
      const request = leaveRequest;
      setLeaveRequest(null);
      if (request === 'restart') router.push(CREATE_PATH);
      if (request === 'skip') router.push(getEditorPathWithTemplate('blank'));
   };

   return (
      <div className="flex h-full flex-col">
         <FlowProgress />

         <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <aside className="shrink-0 md:w-85 md:border-r md:border-brand-line md:pr-8 md:pl-15 md:py-3">
               <p className="mb-3 hidden px-4 text-sm text-[#A6A09B] font-semibold md:block">
                  입력 단계
               </p>
               <div className="md:hidden">
                  <ScrollArea className="w-full" orientation="horizontal">
                     <StepNav
                        variant="tabs"
                        current={current}
                        completed={completed}
                        onSelect={setCurrent}
                     />
                  </ScrollArea>
               </div>
               <div className="hidden md:block">
                  <StepNav
                     variant="list"
                     current={current}
                     completed={completed}
                     onSelect={setCurrent}
                  />
               </div>
            </aside>

            <div className="relative min-h-0 min-w-0 flex-1">
               <ScrollArea className="h-full">
                  <div className="px-[4%] py-4 md:pl-10 md:pr-15 md:py-4">
                     <StepPanel current={current}>
                        {current === 0 && <BasicInfoStep />}
                        {current === 1 && <MoodStep />}
                        {current === 2 && <ScaleStep />}
                        {current === 3 && <SectionsStep />}
                        {current === 4 && <ConfirmStep onEdit={goToStep} />}
                     </StepPanel>
                  </div>
               </ScrollArea>
            </div>
         </div>

         <WizardFooter
            isLast={current === AI_DRAFT_STEP_COUNT - 1}
            canSubmit={canSubmit}
            remainingAi={remainingAi}
            onPrev={goPrev}
            onNext={goNext}
            onSkip={skip}
         />

         {guard.request && (
            <LeaveConfirmModal kind="page" onConfirm={guard.confirm} onCancel={guard.cancel} />
         )}
         {leaveRequest && (
            <LeaveConfirmModal
               kind={leaveRequest}
               onConfirm={confirmLeave}
               onCancel={() => setLeaveRequest(null)}
            />
         )}
      </div>
   );
}
