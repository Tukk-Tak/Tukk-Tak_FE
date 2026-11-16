'use client';

import { useAiDraftForm } from '../model/AiDraftFormContext';
import { MENU_COUNTS, PHOTO_COUNTS } from '../model/options';
import { OptionCardGroup } from './OptionCardGroup';

// 3단계 구조·스케일. 소개할 메뉴·상품 개수와 가진 사진 개수를 고른다. 둘 다 필수이다.
// 이 값으로 AI가 목록과 갤러리 블록의 모양을 정한다.
export function ScaleStep() {
   const { values, update } = useAiDraftForm();

   return (
      <div className="space-y-10">
         <OptionCardGroup
            legend="소개할 메뉴·상품의 갯수가 얼마나 되나요?"
            options={MENU_COUNTS}
            value={values.menuCount}
            onChange={(menuCount) => update({ menuCount })}
            columns={3}
         />
         <OptionCardGroup
            legend="사진은 얼마나 있나요?"
            options={PHOTO_COUNTS}
            value={values.photoCount}
            onChange={(photoCount) => update({ photoCount })}
            columns={4}
         />
      </div>
   );
}
