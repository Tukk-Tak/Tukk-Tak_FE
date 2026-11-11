import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { MAX_MONTHS, MIN_MONTHS } from '../model/period';

interface MonthsFieldProps {
   text: string;
   // 유효한 개월 수. 비었거나 범위를 벗어났으면 null이다.
   months: number | null;
   disabled: boolean;
   onTextChange: (text: string) => void;
   onStep: (delta: number) => void;
   onBlur: () => void;
}

// 이용 개월을 − / 숫자 입력 / + 로 정한다. 범위는 1~24개월이다.
export function MonthsField({
   text,
   months,
   disabled,
   onTextChange,
   onStep,
   onBlur,
}: MonthsFieldProps) {
   const invalid = months === null;

   return (
      <FormField label="이용 개월" htmlFor="months">
         <div className="flex gap-2">
            <Button
               variant="outline"
               size="field"
               aria-label="이용 개월 줄이기"
               disabled={disabled || (months !== null && months <= MIN_MONTHS)}
               onClick={() => onStep(-1)}
               className="w-12 px-0"
            >
               −
            </Button>
            <div className="relative min-w-0 flex-1">
               <Input
                  id="months"
                  inputMode="numeric"
                  autoComplete="off"
                  value={text}
                  disabled={disabled}
                  invalid={invalid}
                  aria-describedby="months-message"
                  onChange={(event) => onTextChange(event.target.value)}
                  onBlur={onBlur}
                  className="pr-14 text-center"
               />
               <span className="pointer-events-none absolute inset-y-0 right-5 flex items-center text-xs text-black/50">
                  개월
               </span>
            </div>
            <Button
               variant="outline"
               size="field"
               aria-label="이용 개월 늘리기"
               disabled={disabled || (months !== null && months >= MAX_MONTHS)}
               onClick={() => onStep(1)}
               className="w-12 px-0"
            >
               +
            </Button>
         </div>
         <FieldMessage id="months-message" tone={invalid ? 'error' : 'hint'}>
            {MIN_MONTHS}~{MAX_MONTHS}개월까지 입력할 수 있어요
         </FieldMessage>
      </FormField>
   );
}
