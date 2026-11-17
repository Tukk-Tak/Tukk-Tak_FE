'use client';

import type { ReactNode } from 'react';
import { useAiDraftForm } from '../model/AiDraftFormContext';
import {
   BUSINESS_TYPES,
   HIGHLIGHT_PRESETS,
   MENU_COUNTS,
   MOOD_KEYWORDS,
   PHOTO_COUNTS,
} from '../model/options';
import {
   isBasicInfoComplete,
   isMoodComplete,
   isScaleComplete,
   isSectionsComplete,
   type AiDraftValues,
} from '../model/values';

// 수정 버튼이 돌아갈 단계. 위저드가 이 값을 단계 번호로 바꿔 이동한다.
export type EditableStepId = 'basic' | 'concept' | 'scale' | 'sections';

interface ConfirmStepProps {
   onEdit: (stepId: EditableStepId) => void;
}

const CHIP_CLASS =
   'rounded-full border border-brand-line bg-white px-3 py-1 text-xs text-[#79716B]';

function Chip({ children }: { children: ReactNode }) {
   return <li className={CHIP_CLASS}>{children}</li>;
}

interface SummaryCardProps {
   title: string;
   onEdit: () => void;
   // 필수 항목이 비어 있으면 그 이름들. 있으면 내용 대신 안내를 보여 준다.
   missing?: string[];
   children: ReactNode;
}

function SummaryCard({ title, onEdit, missing = [], children }: SummaryCardProps) {
   return (
      <section className="flex flex-col rounded-xl border border-brand-line p-5">
         <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-brown">{title}</h2>
            <button
               type="button"
               aria-label={`${title} 수정`}
               onClick={onEdit}
               className="cursor-pointer text-xs font-bold text-brand-orange hover:underline"
            >
               수정
            </button>
         </div>
         <div className="mt-3 space-y-2.5 text-xs text-[#79716B]">{children}</div>
         {missing.length > 0 && (
            <p className="mt-3 text-xs font-semibold text-state-error">
               입력이 필요해요: {missing.join(', ')}
            </p>
         )}
      </section>
   );
}

function getBusinessTypeLabel(values: AiDraftValues) {
   if (values.businessType === 'other') return values.businessTypeCustom.trim();
   return BUSINESS_TYPES.find((type) => type.key === values.businessType)?.label ?? '';
}

function getFooterLabels(values: AiDraftValues) {
   return [
      values.footerAddressOn && '주소',
      values.footerPhoneOn && '전화번호',
      values.footerHoursOn && '영업시간',
      values.footerSocialOn && 'SNS 링크',
   ].filter((label): label is string => Boolean(label));
}

// 5단계 최종 확인. 입력한 내용을 단계별 카드로 요약해서 보여 주고, 각 카드의 [수정]으로 해당 단계로 돌아간다.
// 필수 항목이 비어 있으면 카드에 안내가 나오고, [AI로 초안 만들기] 버튼은 켜지지 않는다.
export function ConfirmStep({ onEdit }: ConfirmStepProps) {
   const { values } = useAiDraftForm();

   const basicMissing = [
      values.storeName.trim() === '' && '상호명',
      (values.businessType === null ||
         (values.businessType === 'other' && values.businessTypeCustom.trim() === '')) &&
         '업종',
   ].filter((item): item is string => Boolean(item));
   const moodMissing = [
      values.moodKeywords.length === 0 && '분위기 키워드',
      values.moodColors.length === 0 && '색',
   ].filter((item): item is string => Boolean(item));
   const scaleMissing = [
      values.menuCount === null && '메뉴·상품 개수',
      values.photoCount === null && '사진 개수',
   ].filter((item): item is string => Boolean(item));
   const sectionsMissing = isSectionsComplete(values) ? [] : ['푸터에 보여줄 정보'];

   const menu = MENU_COUNTS.find((item) => item.key === values.menuCount);
   const photo = PHOTO_COUNTS.find((item) => item.key === values.photoCount);
   const footerLabels = getFooterLabels(values);
   const highlightLabels = [
      ...values.highlightKeys.map(
         (key) => HIGHLIGHT_PRESETS.find((preset) => preset.key === key)?.label ?? key,
      ),
      ...values.highlightCustoms,
   ];

   const basicParts = [
      values.storeName.trim(),
      getBusinessTypeLabel(values),
      values.location.trim(),
   ].filter(Boolean);

   return (
      <div>
         <p className="text-sm text-[#79716B]">
            AI가 이 내용으로 초안을 만들어요. 수정을 원하는 경우, 각 항목의 수정 버튼을 눌러 주세요
         </p>

         <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SummaryCard
               title="기본 정보"
               onEdit={() => onEdit('basic')}
               missing={isBasicInfoComplete(values) ? [] : basicMissing}
            >
               {basicParts.length > 0 && <p>{basicParts.join(' · ')}</p>}
            </SummaryCard>

            <SummaryCard
               title="컨셉·분위기"
               onEdit={() => onEdit('concept')}
               missing={isMoodComplete(values) ? [] : moodMissing}
            >
               {(values.moodKeywords.length > 0 || values.moodColors.length > 0) && (
                  <ul className="flex flex-wrap items-center gap-2">
                     {values.moodKeywords.map((key) => (
                        <Chip key={key}>
                           {MOOD_KEYWORDS.find((keyword) => keyword.key === key)?.label ?? key}
                        </Chip>
                     ))}
                     {values.moodColors.map((hex) => (
                        <li
                           key={hex}
                           title={hex}
                           aria-label={`선택한 색 ${hex}`}
                           className="size-5 rounded-full border border-black/10"
                           style={{ backgroundColor: hex }}
                        />
                     ))}
                  </ul>
               )}
               <p className="line-clamp-2 break-keep">
                  {values.moodNote.trim() !== '' ? values.moodNote.trim() : '보완 설명 없음'}
                  {' · '}
                  {values.referenceImages.length > 0
                     ? `참고 이미지 ${values.referenceImages.length}개`
                     : '참고 이미지 없음'}
               </p>
            </SummaryCard>

            <SummaryCard
               title="구조·스케일"
               onEdit={() => onEdit('scale')}
               missing={isScaleComplete(values) ? [] : scaleMissing}
            >
               {menu && (
                  <p className="break-keep">
                     메뉴·상품 {menu.label} → {menu.result}
                  </p>
               )}
               {photo && (
                  <p className="break-keep">
                     {photo.key === 'none' ? '사진 없음' : `사진 ${photo.label}`} → {photo.result}
                  </p>
               )}
            </SummaryCard>

            <SummaryCard
               title="포함 섹션"
               onEdit={() => onEdit('sections')}
               missing={sectionsMissing}
            >
               {footerLabels.length > 0 && (
                  <div>
                     <p className="mb-1.5 text-[#A6A09B]">푸터</p>
                     <ul className="flex flex-wrap gap-2">
                        {footerLabels.map((label) => (
                           <Chip key={label}>{label}</Chip>
                        ))}
                     </ul>
                  </div>
               )}
               <div>
                  <p className="mb-1.5 text-[#A6A09B]">강조 특징</p>
                  {highlightLabels.length > 0 ? (
                     <ul className="flex flex-wrap gap-2">
                        {highlightLabels.map((label) => (
                           <Chip key={label}>{label}</Chip>
                        ))}
                     </ul>
                  ) : (
                     <p>없음</p>
                  )}
               </div>
            </SummaryCard>
         </div>

         {/* AI 횟수 정책: 초안이 만들어졌을 때만 차감한다. */}
         <p className="mt-4 rounded-lg bg-[#F7F0E8] px-5 py-4 text-xs text-[#79716B]">
            초안을 만들면 AI 사용 횟수가 1회가 차감돼요. 실패할 경우 차감되지 않아요. 만든 초안은
            적용하기 전에 확인할 수 있어요.
         </p>
      </div>
   );
}
