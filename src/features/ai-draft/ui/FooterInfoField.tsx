'use client';

import { useId, type ReactNode } from 'react';
import { Input } from '@/shared/ui/Input';
import { Switch } from '@/shared/ui/Switch';
import { useAiDraftForm } from '../model/AiDraftFormContext';
import { FOOTER_ADDRESS_MAX, FOOTER_HOURS_MAX, FOOTER_PHONE_MAX } from '../model/options';

interface FooterRowProps {
   label: string;
   description?: string;
   checked: boolean;
   onChange: (checked: boolean) => void;
   // 켰을 때 아래에 펼쳐지는 입력 칸
   children?: ReactNode;
}

// 항목 하나. 제목과 스위치가 한 줄이고, 켜면 입력 칸이 아래로 펼쳐진다. 행 사이에만 구분선이 있다.
function FooterRow({ label, description, checked, onChange, children }: FooterRowProps) {
   const titleId = useId();

   return (
      <div className="border-b border-brand-line py-4 first:pt-0 last:border-b-0 last:pb-0">
         <div className="flex items-center justify-between gap-4">
            <div>
               <p id={titleId} className="text-sm font-bold text-brand-brown">
                  {label}
               </p>
               {description && <p className="mt-1 text-xs text-[#A6A09B]">{description}</p>}
            </div>
            <Switch checked={checked} onChange={onChange} labelledBy={titleId} />
         </div>
         {checked && children && <div className="mt-3">{children}</div>}
      </div>
   );
}

// 전화번호에 쓸 수 있는 글자만 남긴다. (숫자, 하이픈, 괄호, +, 공백)
function sanitizePhone(value: string) {
   return value.replace(/[^0-9+\-() ]/g, '');
}

// 푸터에 보여줄 정보(필수). 하나 이상 켜면 조건을 채운 것이고, 항목별 필수는 없다.
// 끄면 입력 칸이 사라지면서 값도 비운다. 켰는데 비워 두면 초안 푸터에 대체 문구가 들어간다.
export function FooterInfoField() {
   const { values, update } = useAiDraftForm();

   return (
      <fieldset>
         <legend className="flex w-full items-center justify-between text-sm font-bold text-brand-brown">
            <span>
               푸터에 보여줄 정보
               <span aria-hidden className="ml-1 text-brand-orange">
                  *
               </span>
            </span>
         </legend>

         <div className="mt-4">
            <FooterRow
               label="주소"
               checked={values.footerAddressOn}
               onChange={(on) =>
                  update({ footerAddressOn: on, ...(on ? {} : { footerAddress: '' }) })
               }
            >
               <Input
                  tone="brown"
                  aria-label="푸터에 보여줄 주소"
                  name="footerAddress"
                  placeholder="예: 서울 마포구 서교동 123-4"
                  maxLength={FOOTER_ADDRESS_MAX}
                  value={values.footerAddress}
                  onChange={(event) => update({ footerAddress: event.target.value })}
               />
            </FooterRow>

            <FooterRow
               label="매장 전화번호"
               checked={values.footerPhoneOn}
               onChange={(on) => update({ footerPhoneOn: on, ...(on ? {} : { footerPhone: '' }) })}
            >
               <Input
                  tone="brown"
                  aria-label="푸터에 보여줄 전화번호"
                  name="footerPhone"
                  type="tel"
                  inputMode="tel"
                  placeholder="예: 02-1234-5678"
                  maxLength={FOOTER_PHONE_MAX}
                  value={values.footerPhone}
                  onChange={(event) => update({ footerPhone: sanitizePhone(event.target.value) })}
               />
            </FooterRow>

            <FooterRow
               label="영업시간"
               checked={values.footerHoursOn}
               onChange={(on) => update({ footerHoursOn: on, ...(on ? {} : { footerHours: '' }) })}
            >
               <Input
                  tone="brown"
                  aria-label="푸터에 보여줄 영업시간"
                  name="footerHours"
                  placeholder="예: 매일 10:00 ~ 21:00 (일요일 휴무)"
                  maxLength={FOOTER_HOURS_MAX}
                  value={values.footerHours}
                  onChange={(event) => update({ footerHours: event.target.value })}
               />
            </FooterRow>

            {/* SNS 링크는 입력 칸이 없다. 푸터는 올바른 링크만 보여 주므로, 링크는 편집 단계에서 직접 넣는다. */}
            <FooterRow
               label="SNS 링크"
               description="직접 편집 단계에서 링크 입력이 가능해요"
               checked={values.footerSocialOn}
               onChange={(on) => update({ footerSocialOn: on })}
            />
         </div>
      </fieldset>
   );
}
