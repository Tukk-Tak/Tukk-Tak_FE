'use client';

import { FooterInfoField } from './FooterInfoField';
import { HighlightField } from './HighlightField';

// 4단계 포함 섹션. 왼쪽에 푸터에 보여줄 정보(필수: 하나 이상 켜기), 오른쪽에 강조 특징(선택)을 둔다.
export function SectionsStep() {
   return (
      <div className="grid gap-10 md:grid-cols-2 md:gap-0">
         <div className="md:pr-10">
            <FooterInfoField />
         </div>
         <div className="md:border-l md:border-brand-line md:pl-10">
            <HighlightField />
         </div>
      </div>
   );
}
