import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';

interface TemplateSelectBarProps {
   // 선택한 템플릿 이름. 선택하지 않았으면 null
   selectedName: string | null;
   // 진행하기 버튼이 이동할 주소. 템플릿을 선택하지 않았으면 null
   href: string | null;
}

// 화면 아래에 붙는 바. 선택한 템플릿을 보여 주고, 그 템플릿으로 진행하는 버튼을 둔다.
// 템플릿을 고르기 전에는 버튼을 누를 수 없다.
export function TemplateSelectBar({ selectedName, href }: TemplateSelectBarProps) {
   const label = '이 템플릿으로 진행하기 →';

   return (
      <div className="shrink-0 border-t border-brand-line bg-white">
         <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-[4%] py-3 md:flex-row md:items-center md:justify-between md:py-4">
            <p className="truncate text-sm text-black/60">
               선택한 템플릿
               <span className="ml-2 font-bold text-brand-brown">· {selectedName ?? '없음'}</span>
            </p>
            {href ? (
               <ButtonLink href={href} size="form" className="max-md:w-full">
                  {label}
               </ButtonLink>
            ) : (
               <Button size="form" disabled className="max-md:w-full">
                  {label}
               </Button>
            )}
         </div>
      </div>
   );
}
