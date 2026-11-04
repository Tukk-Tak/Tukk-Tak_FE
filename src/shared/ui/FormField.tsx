import type { ReactNode } from 'react';

interface FormFieldProps {
   label: string;
   htmlFor: string;
   required?: boolean;
   children: ReactNode;
}

export function FormField({ label, htmlFor, required = false, children }: FormFieldProps) {
   return (
      <div>
         <label htmlFor={htmlFor} className="mb-2.5 block text-xs font-bold text-black">
            {label}
            {required && (
               <span aria-hidden className="ml-1 text-brand-orange">
                  *
               </span>
            )}
         </label>
         {children}
      </div>
   );
}
