'use client';

import { Lock } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { CollapsibleSection } from '@/shared/ui/CollapsibleSection';
import { DateInput } from '@/shared/ui/DateInput';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import type { BusinessVerifyState } from '../model/useBusinessVerify';
import { formatBusinessNumber } from '../model/validation';
import type { StoreValues } from '../types';

type BusinessValues = Pick<StoreValues, 'businessNumber' | 'openDate'>;

interface BusinessVerifySectionProps {
   values: BusinessValues;
   // 대표자명은 입력받지 않고 위에서 입력한 이름을 그대로 쓴다. (이름과 같아야 인증할 수 있다.)
   representativeName: string;
   // 화면에 보여줄 오류만 넘어온다. (입력 칸을 벗어나기 전의 오류는 걸러진 상태)
   errors: Partial<Record<keyof BusinessValues, string>>;
   verify: BusinessVerifyState;
   canVerify: boolean;
   onChange: (patch: Partial<BusinessValues>) => void;
   onBlur: () => void;
   onVerify: () => void;
}

export function BusinessVerifySection({
   values,
   representativeName,
   errors,
   verify,
   canVerify,
   onChange,
   onBlur,
   onVerify,
}: BusinessVerifySectionProps) {
   const verified = verify.status === 'verified';
   const failed = verify.status === 'failed';
   const hasInput = Boolean(values.businessNumber || values.openDate);

   return (
      <CollapsibleSection
         title="사업자 인증"
         description="(선택 · 지금 하지 않아도 돼요)"
         badge={
            verified && (
               <span className="bg-state-success/10 rounded-full px-2 py-0.5 text-[11px] font-bold text-state-success">
                  인증 완료
               </span>
            )
         }
      >
         <div className="space-y-4">
            {failed && (
               <p
                  role="alert"
                  className="bg-state-error/10 rounded-lg px-3 py-2.5 text-xs text-state-error"
               >
                  {verify.message}
               </p>
            )}

            <FormField label="사업자 등록번호" htmlFor="businessNumber" required>
               <Input
                  id="businessNumber"
                  name="businessNumber"
                  inputMode="numeric"
                  placeholder="000-00-00000"
                  value={values.businessNumber}
                  readOnly={verified}
                  invalid={Boolean(errors.businessNumber)}
                  aria-describedby="businessNumber-message"
                  onChange={(event) =>
                     onChange({ businessNumber: formatBusinessNumber(event.target.value) })
                  }
                  onBlur={onBlur}
               />
               {errors.businessNumber && (
                  <FieldMessage id="businessNumber-message" tone="error">
                     {errors.businessNumber}
                  </FieldMessage>
               )}
            </FormField>

            <FormField label="개업일자" htmlFor="openDate" required>
               <DateInput
                  id="openDate"
                  name="openDate"
                  value={values.openDate}
                  readOnly={verified}
                  invalid={Boolean(errors.openDate)}
                  aria-describedby="openDate-message"
                  className={verified ? 'pointer-events-none' : ''}
                  onChange={(event) => onChange({ openDate: event.target.value })}
                  onBlur={onBlur}
               />
               {errors.openDate && (
                  <FieldMessage id="openDate-message" tone="error">
                     {errors.openDate}
                  </FieldMessage>
               )}
            </FormField>

            <FormField label="대표자명" htmlFor="representativeName" required>
               <div className="relative">
                  <Input
                     id="representativeName"
                     readOnly
                     value={representativeName}
                     placeholder="이름을 먼저 입력해주세요"
                     className="pr-12"
                  />
                  <Lock
                     aria-hidden
                     className="pointer-events-none absolute top-1/2 right-5 size-4 -translate-y-1/2 text-black/40"
                  />
               </div>
               <FieldMessage>이름과 대표자명이 같아야 인증할 수 있어요</FieldMessage>
            </FormField>

            {!verified && (
               <div className="flex flex-col items-end gap-1.5">
                  {hasInput && (
                     <FieldMessage className="mt-0">
                        인증을 마쳐야 가입할 수 있어요. 입력한 내용을 지우면 건너뛸 수 있어요
                     </FieldMessage>
                  )}
                  <Button
                     size="field"
                     className="w-22"
                     disabled={!canVerify || verify.verifying}
                     onClick={onVerify}
                  >
                     {verify.verifying ? '인증 중' : '인증하기'}
                  </Button>
               </div>
            )}
         </div>
      </CollapsibleSection>
   );
}
