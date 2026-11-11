import { Calendar } from 'lucide-react';
import { Input, type InputProps } from './Input';

type DateInputProps = Omit<InputProps, 'type'>;

// 브라우저 기본 날짜 선택기를 쓰되, 기본 아이콘 대신 프로젝트 아이콘을 보여준다.
// 기본 아이콘은 투명하게 두고 입력 칸 전체로 넓혀서, 칸 어디를 눌러도 선택기가 열린다.
const NATIVE_PICKER_CLASS =
   '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0';

export function DateInput({ className = '', ...props }: DateInputProps) {
   return (
      <div className="relative">
         <Input
            type="date"
            // 날짜를 고르기 전에는 다른 입력 칸의 placeholder처럼 옅게 보인다.
            // (브라우저 기본 날짜 입력은 "YYYY-MM-DD" 같은 문구를 직접 바꿀 수 없다.)
            data-empty={props.value ? undefined : ''}
            className={`pr-12 data-empty:text-black/25 ${NATIVE_PICKER_CLASS} ${className}`}
            {...props}
         />
         <Calendar
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-5 size-4.5 -translate-y-1/2 text-black/40"
         />
      </div>
   );
}
