'use client';

import { Checkbox } from '@/shared/ui/Checkbox';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import type { StoreFormState } from '../model/useStoreForm';
import { formatPhone, sanitizePhoneInput } from '../model/validation';
import { BusinessVerifySection } from './BusinessVerifySection';
import { NicknameField } from './NicknameField';
import { StoreInfoSection } from './StoreInfoSection';

// 이름부터 동의 체크박스까지의 입력 영역. 이메일 가입의 2단계와 구글 가입이 함께 쓴다.
export function StoreFields({ form }: { form: StoreFormState }) {
   const { values, errors, touched, showError, setValue, touch } = form;

   return (
      <div className="space-y-6">
         <FormField label="이름" htmlFor="name" required>
            <Input
               id="name"
               name="name"
               autoComplete="name"
               placeholder="홍길동"
               value={values.name}
               invalid={Boolean(showError('name'))}
               aria-describedby="name-message"
               onChange={(event) => form.handleNameChange(event.target.value)}
               onBlur={() => touch('name')}
            />
            <FieldMessage id="name-message" tone={showError('name') ? 'error' : 'hint'}>
               {showError('name') ??
                  '사업자 인증을 할 때 대표자명과 같아야 해요. 가입 후에는 바꿀 수 없어요'}
            </FieldMessage>
         </FormField>

         <NicknameField
            value={values.nickname}
            formatError={errors.nickname}
            touched={Boolean(touched.nickname)}
            check={form.nicknameCheck}
            onChange={form.handleNicknameChange}
            onBlur={() => touch('nickname')}
         />

         <FormField label="개인 전화번호" htmlFor="phone" required>
            <Input
               id="phone"
               name="phone"
               type="tel"
               inputMode="tel"
               autoComplete="tel"
               placeholder="010-0000-0000"
               value={values.phone}
               invalid={Boolean(showError('phone'))}
               aria-describedby="phone-message"
               onChange={(event) => setValue({ phone: sanitizePhoneInput(event.target.value) })}
               onBlur={() => {
                  setValue({ phone: formatPhone(values.phone) });
                  touch('phone');
               }}
            />
            {showError('phone') && (
               <FieldMessage id="phone-message" tone="error">
                  {showError('phone')}
               </FieldMessage>
            )}
         </FormField>

         <BusinessVerifySection
            values={{ businessNumber: values.businessNumber, openDate: values.openDate }}
            representativeName={values.name}
            errors={{
               businessNumber: showError('businessNumber'),
               openDate: showError('openDate'),
            }}
            verify={form.businessVerify}
            canVerify={form.canVerifyBusiness}
            onChange={form.handleBusinessChange}
            // 그룹 안의 칸 하나를 벗어나면 같은 그룹의 필수 오류도 함께 보여준다.
            onBlur={() => touch('businessNumber', 'openDate')}
            onVerify={form.handleVerifyBusiness}
         />

         <StoreInfoSection
            values={{ storeAddress: values.storeAddress, storePhone: values.storePhone }}
            errors={{
               storeAddress: showError('storeAddress'),
               storePhone: showError('storePhone'),
            }}
            onChange={setValue}
            onBlur={() => {
               setValue({ storePhone: formatPhone(values.storePhone) });
               touch('storeAddress', 'storePhone');
            }}
         />

         <Checkbox
            checked={values.agreed}
            onChange={(event) => setValue({ agreed: event.target.checked })}
         >
            <span>
               <span className="font-bold text-brand-orange">[필수]</span> 개인정보 수집·이용 및 AI
               사용에 동의합니다
            </span>
         </Checkbox>
      </div>
   );
}
