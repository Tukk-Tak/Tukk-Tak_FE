'use client';

import { useAiDraftForm } from '../model/AiDraftFormContext';
import {
   BUSINESS_TYPE_CUSTOM_MAX,
   BUSINESS_TYPES,
   LOCATION_MAX,
   STORE_NAME_MAX,
} from '../model/options';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';

// 1단계 기본 정보. 상호명, 업종 세부 유형(필수)과 대략적 위치(선택)를 받는다.
export function BasicInfoStep() {
   const { values, update } = useAiDraftForm();

   return (
      <div className="space-y-6">
         <FormField
            label="상호명"
            htmlFor="ai-store-name"
            labelSize="sm"
            labelTone="brown"
            required
         >
            <Input
               tone="brown"
               id="ai-store-name"
               aria-required="true"
               name="storeName"
               autoComplete="organization"
               placeholder="예: 카페 오롯"
               maxLength={STORE_NAME_MAX}
               value={values.storeName}
               onChange={(event) => update({ storeName: event.target.value })}
            />
         </FormField>

         <fieldset>
            <legend className="mb-2.5 block text-sm font-bold text-brand-brown">
               업종 세부 유형
               <span aria-hidden className="ml-1 text-brand-orange">
                  *
               </span>
            </legend>
            <div className="flex flex-wrap gap-2.5">
               {BUSINESS_TYPES.map(({ key, label }) => {
                  const selected = values.businessType === key;
                  return (
                     <button
                        key={key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => update({ businessType: selected ? null : key })}
                        className={`h-10 cursor-pointer rounded-full border px-5 text-sm transition-colors ${
                           selected
                              ? 'border-brand-orange bg-brand-orange-light font-semibold text-brand-orange'
                              : 'border-brand-line bg-white text-[#79716B] hover:border-brand-orange hover:text-brand-orange'
                        }`}
                     >
                        {label}
                     </button>
                  );
               })}
            </div>

            {values.businessType === 'other' && (
               <div className="mt-3">
                  <Input
                     tone="brown"
                     aria-label="업종 직접 입력"
                     aria-required="true"
                     name="businessTypeCustom"
                     placeholder="예: 베이커리, 브런치"
                     maxLength={BUSINESS_TYPE_CUSTOM_MAX}
                     value={values.businessTypeCustom}
                     onChange={(event) => update({ businessTypeCustom: event.target.value })}
                  />
               </div>
            )}
         </fieldset>

         <div>
            <label
               htmlFor="ai-location"
               className="mb-2.5 block text-sm font-bold text-brand-brown"
            >
               대략적 위치
               <span className="ml-1 font-normal text-[#A6A09B]">(선택)</span>
            </label>
            <Input
               tone="brown"
               id="ai-location"
               name="location"
               placeholder="예: 마포구 서교동"
               maxLength={LOCATION_MAX}
               value={values.location}
               aria-describedby="ai-location-hint"
               onChange={(event) => update({ location: event.target.value })}
            />
            <FieldMessage id="ai-location-hint">
               동·구 단위로 적어 주세요. 자세한 주소는 포함 섹션 단계에서 입력할 수 있어요.
            </FieldMessage>
         </div>
      </div>
   );
}
