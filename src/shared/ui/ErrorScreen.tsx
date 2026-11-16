import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ScrollArea } from './ScrollArea';

interface ErrorScreenProps {
   // 큰 숫자로 보여 주는 오류 번호 (403, 404, 500)
   code: string;
   icon: LucideIcon;
   title: string;
   // 설명. 줄바꿈(\n)은 줄바꿈으로 보여 준다.
   description: string;
   // 버튼 두 개 (주요 동작 / 보조 동작). 버튼의 폭은 이 화면이 맞춘다.
   actions: ReactNode;
   // 맨 아래의 작은 안내 줄 (500의 "오류 코드 ERR-500")
   note?: string;
   // true면 서비스 헤더가 없는 화면에서 쓰는 것이다. 부모가 높이를 정해 주지 않으므로 화면 전체 높이를 쓴다.
   standalone?: boolean;
}

// 403·404·500이 함께 쓰는 오류 화면의 틀. 큰 숫자, 아이콘, 제목, 설명, 버튼 두 개를 가운데에 쌓는다.
// 서비스 헤더 아래에서는 남은 높이를 모두 쓰고(h-full), 낮은 화면에서 내용이 넘치면 안에서 스크롤된다.
export function ErrorScreen({
   code,
   icon: Icon,
   title,
   description,
   actions,
   note,
   standalone = false,
}: ErrorScreenProps) {
   return (
      <main className={`relative bg-white ${standalone ? 'h-dvh' : 'h-full'}`}>
         <ScrollArea
            className="h-full"
            contentClassName="flex min-h-full flex-col items-center justify-center px-[4%] py-10 text-center"
         >
            {/* 숫자는 장식이라 스크린 리더는 제목(h1)만 읽는다. */}
            <p
               aria-hidden
               className="text-[clamp(4.5rem,11vw,6.5rem)] leading-none font-black tracking-tight text-brand-line"
            >
               {code}
            </p>
            <span
               aria-hidden
               className="mt-4 flex size-12 items-center justify-center rounded-full bg-brand-orange-light text-brand-orange"
            >
               <Icon className="size-6" strokeWidth={1.75} />
            </span>

            <h1 className="mt-5 text-xl font-bold text-black sm:text-2xl">{title}</h1>
            <p className="mt-2.5 text-[13px] leading-relaxed break-keep whitespace-pre-line text-black/50 sm:text-sm">
               {description}
            </p>

            {/* 안내 줄(note)은 버튼 아래에 absolute로 걸어서 높이에 포함되지 않게 한다. */}
            {/* 그래야 안내 줄이 있는 500도 숫자, 아이콘, 제목, 버튼이 403·404와 같은 위치에 놓인다. */}
            <div className="relative mt-7 flex w-full flex-col items-center">
               {/* 작은 화면에서는 버튼을 세로로 쌓아 전체 폭으로, 넓은 화면에서는 같은 폭의 두 버튼을 나란히 놓는다. */}
               <div className="flex w-full max-w-xs flex-col gap-2.5 sm:max-w-none sm:flex-row sm:justify-center [&>*]:w-full sm:[&>*]:w-48">
                  {actions}
               </div>
               {note && (
                  <p className="absolute inset-x-0 top-full mt-5 text-xs text-black/40">{note}</p>
               )}
            </div>
         </ScrollArea>
      </main>
   );
}
