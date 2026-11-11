import { Check } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import type { NicknameCheckState } from '../model/useNicknameCheck';

interface NicknameFieldProps {
   value: string;
   // 입력값 자체의 형식 오류. 입력 칸을 벗어난 뒤(touched)에만 화면에 보여준다.
   formatError?: string;
   touched: boolean;
   check: NicknameCheckState;
   onChange: (value: string) => void;
   onBlur: () => void;
}

export function NicknameField({
   value,
   formatError,
   touched,
   check,
   onChange,
   onBlur,
}: NicknameFieldProps) {
   const showFormatError = touched && Boolean(formatError);
   const rejected = check.status === 'rejected';
   const available = check.status === 'available';
   // 형식이 맞는데 중복확인을 하지 않은 채 입력 칸을 벗어난 경우
   const needsCheck = touched && !formatError && check.status === 'idle';

   return (
      <FormField label="닉네임 / 사업장명" htmlFor="nickname" required>
         <div className="flex gap-2">
            <Input
               id="nickname"
               name="nickname"
               placeholder="커뮤니티에서 사용할 이름"
               value={value}
               invalid={rejected || showFormatError}
               aria-describedby="nickname-message"
               className="min-w-0 flex-1"
               onChange={(event) => onChange(event.target.value)}
               onBlur={onBlur}
            />
            <Button
               variant="outline"
               size="field"
               className="w-22"
               disabled={Boolean(formatError) || check.checking || available}
               onClick={() => check.check(value)}
            >
               {check.checking ? '확인 중' : '중복확인'}
            </Button>
         </div>

         {rejected ? (
            <FieldMessage id="nickname-message" tone="error">
               {check.message}
            </FieldMessage>
         ) : available ? (
            <FieldMessage id="nickname-message" tone="success" className="flex items-center gap-1">
               <Check aria-hidden className="size-3.5" strokeWidth={3} />
               사용할 수 있는 이름이에요
            </FieldMessage>
         ) : showFormatError ? (
            <FieldMessage id="nickname-message" tone="error">
               {formatError}
            </FieldMessage>
         ) : needsCheck ? (
            <FieldMessage id="nickname-message" tone="error">
               중복확인을 해주세요
            </FieldMessage>
         ) : (
            <FieldMessage id="nickname-message">공백 없이 15자 이내</FieldMessage>
         )}
      </FormField>
   );
}
