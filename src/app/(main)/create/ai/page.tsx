// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { CREATE_PATH } from '@/shared/config/routes';
import { ButtonLink } from '@/shared/ui/ButtonLink';

export const metadata: Metadata = {
   title: 'AI 초안 만들기 | 뚝딱',
};

// TODO: #44에서 AI 초안 입력 단계(기본 정보 ~ 최종 확인)를 만들 때 이 임시 화면을 교체한다.
// 그때까지 허브의 "AI로 시작하기"가 404로 가지 않도록 자리만 잡아 둔다.
export default function CreateAiPage() {
   return (
      <main className="relative flex h-full flex-col items-center justify-center gap-6 px-[4%] text-center">
         <div>
            <h1 className="text-2xl font-bold text-black md:text-3xl">
               AI 초안 만들기는 준비 중이에요
            </h1>
            <p className="mt-3 text-sm text-black/50">조금만 기다려 주세요.</p>
         </div>
         <ButtonLink href={CREATE_PATH} size="form" variant="outline">
            다른 방식으로 시작하기
         </ButtonLink>
      </main>
   );
}
