'use client';

import { CollapsibleSection } from '@/shared/ui/CollapsibleSection';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { sanitizePhoneInput } from '../model/validation';
import type { StoreValues } from '../types';

type StoreInfoValues = Pick<StoreValues, 'storeAddress' | 'storePhone'>;

interface StoreInfoSectionProps {
   values: StoreInfoValues;
   // 화면에 보여줄 오류만 넘어온다. (입력 칸을 벗어나기 전의 오류는 걸러진 상태)
   errors: Partial<Record<keyof StoreInfoValues, string>>;
   onChange: (patch: Partial<StoreInfoValues>) => void;
   onBlur: () => void;
}

export function StoreInfoSection({ values, errors, onChange, onBlur }: StoreInfoSectionProps) {
   return (
      <CollapsibleSection title="업장 정보" description="(선택)">
         <div className="space-y-4">
            {/* TODO: 외부 주소 검색(카카오/다음 우편번호 등)을 붙이면 이 칸이 검색 결과를 채운다. */}
            <FormField label="업장 주소" htmlFor="storeAddress" required>
               <Input
                  id="storeAddress"
                  name="storeAddress"
                  autoComplete="street-address"
                  placeholder="업장 주소를 입력해주세요"
                  value={values.storeAddress}
                  invalid={Boolean(errors.storeAddress)}
                  aria-describedby="storeAddress-message"
                  onChange={(event) => onChange({ storeAddress: event.target.value })}
                  onBlur={onBlur}
               />
               {errors.storeAddress && (
                  <FieldMessage id="storeAddress-message" tone="error">
                     {errors.storeAddress}
                  </FieldMessage>
               )}
            </FormField>

            <FormField label="업장 전화번호" htmlFor="storePhone" required>
               <Input
                  id="storePhone"
                  name="storePhone"
                  type="tel"
                  inputMode="tel"
                  placeholder="02-000-0000"
                  value={values.storePhone}
                  invalid={Boolean(errors.storePhone)}
                  aria-describedby="storePhone-message"
                  onChange={(event) =>
                     onChange({ storePhone: sanitizePhoneInput(event.target.value) })
                  }
                  onBlur={onBlur}
               />
               {errors.storePhone && (
                  <FieldMessage id="storePhone-message" tone="error">
                     {errors.storePhone}
                  </FieldMessage>
               )}
            </FormField>
         </div>
      </CollapsibleSection>
   );
}
