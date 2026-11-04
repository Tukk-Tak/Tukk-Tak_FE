import type { ReactNode } from 'react';

type FieldMessageTone = 'hint' | 'error' | 'success';

interface FieldMessageProps {
   tone?: FieldMessageTone;
   id?: string;
   className?: string;
   children: ReactNode;
}

const TONE_CLASS: Record<FieldMessageTone, string> = {
   hint: 'text-black/50',
   error: 'text-state-error',
   success: 'text-state-success',
};

// 입력 칸 아래에 붙는 안내, 오류, 성공 메시지. 오류와 성공은 스크린 리더가 바로 읽어주도록 알린다.
export function FieldMessage({ tone = 'hint', id, className = '', children }: FieldMessageProps) {
   return (
      <p
         id={id}
         role={tone === 'error' ? 'alert' : undefined}
         aria-live={tone === 'success' ? 'polite' : undefined}
         className={`mt-1.5 text-xs ${TONE_CLASS[tone]} ${className}`}
      >
         {children}
      </p>
   );
}
