// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { AiDraftWizard } from '@/widgets/ai-draft-wizard';

export const metadata: Metadata = {
   title: 'AI 초안 만들기 | 뚝딱',
};

export default function CreateAiPage() {
   return (
      <main className="relative h-full">
         <AiDraftWizard />
      </main>
   );
}
