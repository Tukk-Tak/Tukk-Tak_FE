import { Checkbox } from '@/shared/ui/Checkbox';

const NOTICES = ['환불되지 않아요', '자동으로 연장되지 않아요', '연장은 직접 눌러야 해요'];

interface TermsAgreementProps {
   checked: boolean;
   disabled: boolean;
   onChange: (checked: boolean) => void;
}

// 결제 약관 확인. 체크해야 결제할 수 있다.
export function TermsAgreement({ checked, disabled, onChange }: TermsAgreementProps) {
   return (
      <section className="rounded-xl border border-brand-line p-5">
         <Checkbox
            checked={checked}
            disabled={disabled}
            onChange={(event) => onChange(event.target.checked)}
         >
            <span className="font-bold text-brand-brown">결제 약관을 확인했어요</span>
         </Checkbox>

         <p className="mt-3 rounded-lg bg-field-disabled px-4 py-3 text-xs text-black/60">
            결제 즉시 이용이 시작되며, 결제 완료 후에는 환불되지 않아요.
         </p>
         <ul className="mt-3 space-y-1 text-xs text-black/60">
            {NOTICES.map((notice) => (
               <li key={notice}>· {notice}</li>
            ))}
         </ul>
      </section>
   );
}
