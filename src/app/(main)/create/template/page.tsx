// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { TemplateSelect } from '@/widgets/template-select';

export const metadata: Metadata = {
   title: '템플릿 선택 | 뚝딱',
};

export default function CreateTemplatePage() {
   return (
      // 헤더를 뺀 남은 높이를 모두 쓴다(h-full). 스크롤은 위젯 안의 목록 영역만 맡고, 아래 바는 화면에 붙어 있다.
      <main className="relative h-full">
         <TemplateSelect />
      </main>
   );
}
