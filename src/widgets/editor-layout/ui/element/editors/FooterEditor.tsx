'use client';

import { Plus, X } from 'lucide-react';
import {
   BLOCK_LIMITS,
   getSocialLabel,
   inferSocialKind,
   isHttpUrl,
   type FooterContent,
   type FooterSection,
} from '@/entities/block';
import { useEditorSite } from '@/features/editor-site';
import { isValidEmail } from '@/shared/lib/isValidEmail';
import { sanitizePhoneInput } from '@/shared/lib/sanitizePhone';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { Input } from '@/shared/ui/Input';
import { EditorSection } from '../EditorSection';
import { FieldLabel, TextField } from '../fields';
import { StructureSection } from '../StructureSection';

type Social = NonNullable<FooterContent['social']>;

// 숫자 10자리를 000-00-00000 형태로 보여 준다. 입력 중에는 있는 숫자까지만 하이픈을 붙인다.
function formatRegistrationNumber(value: string) {
   const digits = value.replace(/\D/g, '').slice(0, BLOCK_LIMITS.footerRegistrationDigits);
   if (digits.length <= 3) return digits;
   if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
   return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

// SNS 링크 입력 목록. 주소만 입력받고(http, https만), 종류(Instagram 등)는 주소의 도메인으로 정한다.
// 최대 5개이고, 칸의 ✕로 지운다. 올바르지 않은 주소는 안내만 하고 푸터에는 나오지 않는다.
function SocialLinksField({
   id,
   social = [],
   onChange,
}: {
   id: string;
   social: Social | undefined;
   onChange: (social: Social | undefined) => void;
}) {
   const full = social.length >= BLOCK_LIMITS.footerSocialCount;
   const commit = (next: Social) => onChange(next.length > 0 ? next : undefined);

   return (
      <div>
         <FieldLabel htmlFor={`${id}-0`} label="SNS 링크" optional />
         {/* 편집 화면의 캔버스에서는 푸터가 이름만 보여서 링크인 줄 알아채기 어렵다. 어떻게 보이고 동작하는지 먼저 알려 준다. */}
         <p className="mb-2.5 text-[11px] leading-relaxed break-keep text-[#A6A09B]">
            주소를 넣으면 주소 대신 Instagram, 블로그 같은 이름으로 보여요. 클릭하면 입력한 주소로
            이동하니, 미리보기 모드에서 확인 가능해요.
         </p>
         <div className="space-y-2">
            {social.map((link, index) => {
               const invalid = link.url.trim() !== '' && !isHttpUrl(link.url);
               const footerName = invalid ? null : getSocialLabel(link);
               return (
                  <div key={index}>
                     <div className="flex items-center gap-2">
                        <Input
                           tone="brown"
                           id={`${id}-${index}`}
                           type="url"
                           value={link.url}
                           maxLength={BLOCK_LIMITS.footerSocialUrl}
                           placeholder="https://instagram.com/내가게"
                           invalid={invalid}
                           aria-label={`SNS 링크 ${index + 1}`}
                           aria-describedby={invalid ? `${id}-${index}-message` : undefined}
                           className="px-4"
                           onChange={(event) =>
                              commit(
                                 social.map((item, i) =>
                                    i === index
                                       ? {
                                            kind: inferSocialKind(event.target.value),
                                            url: event.target.value,
                                         }
                                       : item,
                                 ),
                              )
                           }
                        />
                        <button
                           type="button"
                           aria-label={`SNS 링크 ${index + 1} 삭제`}
                           onClick={() => commit(social.filter((_, i) => i !== index))}
                           className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#A6A09B] hover:bg-black/5 hover:text-black/70"
                        >
                           <X className="size-4" aria-hidden />
                        </button>
                     </div>
                     {invalid && (
                        <FieldMessage id={`${id}-${index}-message`} tone="error">
                           http:// 또는 https://로 시작하는 주소를 입력해 주세요.
                        </FieldMessage>
                     )}
                     {/* 올바른 주소이면 푸터에 어떤 이름으로 보이는지 바로 알려 준다. */}
                     {footerName && (
                        <FieldMessage>
                           푸터에 보이는 이름:{' '}
                           <b className="font-bold text-brand-brown">{footerName}</b>
                        </FieldMessage>
                     )}
                  </div>
               );
            })}
         </div>
         {!full && (
            <button
               type="button"
               onClick={() => commit([...social, { kind: '', url: '' }])}
               className="mt-2.5 flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-line text-xs text-[#79716B] transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
               <Plus className="size-3.5" aria-hidden />
               링크 추가
            </button>
         )}
         <FieldMessage>
            최대 {BLOCK_LIMITS.footerSocialCount}개까지 넣을 수 있어요. ({social.length}/
            {BLOCK_LIMITS.footerSocialCount})
         </FieldMessage>
      </div>
   );
}

// 푸터 편집: 구조, 상호명(필수), 주소, 전화번호, 영업시간, SNS 링크, 저작권, 정보형 전용(이메일, 대표자명, 사업자등록번호).
// 정보형 전용 항목은 심플형에서 값을 남긴 채 흐리게 보여 준다. 선택 항목을 비우면 푸터에서 그 칸이 사라진다.
export function FooterEditor({ section }: { section: FooterSection }) {
   const updateContent = useEditorSite((state) => state.updateContent);
   const { brandName, address, phone, hours, social, copyright, email, businessInfo } =
      section.content;
   const infoOnly = section.variant === 'info';
   const registrationNumber = businessInfo?.registrationNumber;
   const representative = businessInfo?.representative;

   // 선택 항목은 비우면 값을 지운다. (빈 글자가 아니라 없는 값이 된다)
   const optional = (value: string) => value || undefined;

   const updateBusinessInfo = (patch: NonNullable<FooterContent['businessInfo']>) => {
      const next = { ...businessInfo, ...patch };
      const empty = !next.representative && !next.registrationNumber;
      updateContent(section.id, { businessInfo: empty ? undefined : next });
   };

   return (
      <>
         <StructureSection section={section} />
         <EditorSection title="내용">
            <TextField
               id={`${section.id}-brandName`}
               label="상호명"
               required
               value={brandName}
               maxLength={BLOCK_LIMITS.footerBrandName}
               onChange={(value) => updateContent(section.id, { brandName: value })}
            />
            <TextField
               id={`${section.id}-address`}
               label="주소"
               optional
               value={address}
               maxLength={BLOCK_LIMITS.footerAddress}
               onChange={(value) => updateContent(section.id, { address: optional(value) })}
            />
            <TextField
               id={`${section.id}-phone`}
               label="전화번호"
               optional
               type="tel"
               value={phone}
               maxLength={BLOCK_LIMITS.footerPhone}
               transform={sanitizePhoneInput}
               hint="입력한 번호는 사이트에 공개돼요."
               onChange={(value) => updateContent(section.id, { phone: optional(value) })}
            />
            <TextField
               id={`${section.id}-hours`}
               label="영업시간"
               optional
               value={hours}
               maxLength={BLOCK_LIMITS.footerHours}
               onChange={(value) => updateContent(section.id, { hours: optional(value) })}
            />
            <SocialLinksField
               id={`${section.id}-social`}
               social={social}
               onChange={(next) => updateContent(section.id, { social: next })}
            />
            <TextField
               id={`${section.id}-copyright`}
               label="저작권"
               optional
               value={copyright}
               maxLength={BLOCK_LIMITS.footerCopyright}
               hint="비워 두면 © 올해+헤더의 상호명으로 표시돼요."
               onChange={(value) => updateContent(section.id, { copyright: optional(value) })}
            />
         </EditorSection>
         <EditorSection title="추가 정보">
            {!infoOnly && (
               <p className="rounded-lg bg-field-readonly px-3 py-2.5 text-xs break-keep text-[#79716B]">
                  이 구조에서는 표시되지 않아요. 입력한 내용은 정보형으로 바꾸면 다시 보여요.
               </p>
            )}
            <div className={`space-y-4 ${infoOnly ? '' : 'opacity-50'}`} inert={!infoOnly}>
               <TextField
                  id={`${section.id}-email`}
                  label="이메일"
                  optional
                  type="email"
                  value={email}
                  maxLength={BLOCK_LIMITS.footerEmail}
                  error={
                     email && !isValidEmail(email) ? '올바른 이메일 형식이 아니에요.' : undefined
                  }
                  onChange={(value) => updateContent(section.id, { email: optional(value) })}
               />
               <TextField
                  id={`${section.id}-representative`}
                  label="대표자명"
                  optional
                  value={representative}
                  maxLength={BLOCK_LIMITS.footerRepresentative}
                  onChange={(value) => updateBusinessInfo({ representative: optional(value) })}
               />
               <TextField
                  id={`${section.id}-registrationNumber`}
                  label="사업자등록번호"
                  optional
                  value={registrationNumber}
                  maxLength={BLOCK_LIMITS.footerRegistrationDigits + 2}
                  transform={formatRegistrationNumber}
                  placeholder="000-00-00000"
                  onChange={(value) => updateBusinessInfo({ registrationNumber: optional(value) })}
               />
            </div>
         </EditorSection>
      </>
   );
}
