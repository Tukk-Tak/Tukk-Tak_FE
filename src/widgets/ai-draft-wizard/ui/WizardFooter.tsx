import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button';

interface WizardFooterProps {
   isLast: boolean;
   // 모든 필수 항목을 채워 초안을 만들 수 있는지. 마지막 단계의 버튼에만 쓴다.
   canSubmit: boolean;
   // 이번 달 남은 AI 횟수. 아직 모르면 null
   remainingAi: number | null;
   onPrev: () => void;
   onNext: () => void;
   onSkip: () => void;
}

// 화면 아래에 붙는 바. 왼쪽에 '이전', 오른쪽에 남은 AI 횟수·'건너뛰고 직접 편집하기'·'다음'을 둔다.
export function WizardFooter({
   isLast,
   canSubmit,
   remainingAi,
   onPrev,
   onNext,
   onSkip,
}: WizardFooterProps) {
   return (
      <div className="shrink-0 border-t border-brand-line bg-white">
         <div className="flex w-full items-center justify-between gap-3 px-[5%] py-3 md:px-20 md:py-4">
            <Button variant="outline" size="form" onClick={onPrev}>
               <ArrowLeft className="mr-1.5 size-4" aria-hidden />
               이전
            </Button>

            <div className="flex items-center gap-3 md:gap-6">
               {remainingAi !== null && (
                  <span className="hidden text-sm text-[#8A7A6A] sm:inline">
                     남은 AI 사용 {remainingAi}회
                  </span>
               )}
               <button
                  type="button"
                  onClick={onSkip}
                  className="cursor-pointer text-sm font-bold text-black hover:text-brand-orange"
               >
                  <span className="max-sm:hidden">건너뛰고 직접 편집하기</span>
                  <span className="sm:hidden">건너뛰기</span>
               </button>
               {/* TODO: 마지막 단계의 버튼은 모든 필수 항목을 입력했을 때만 켠다. 눌렀을 때의 동작은 AI 생성 작업에서 연결한다. */}
               <Button size="form" onClick={onNext} disabled={isLast && !canSubmit}>
                  {isLast ? 'AI로 초안 만들기' : '다음'}
                  {!isLast && <ArrowRight className="ml-1.5 size-4" aria-hidden />}
               </Button>
            </div>
         </div>
      </div>
   );
}
