'use client';

import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';

type Orientation = 'vertical' | 'horizontal' | 'both';

interface ScrollAreaProps extends Omit<
   ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>,
   'type' | 'children' | 'className'
> {
   children: ReactNode;
   // 바깥 틀의 클래스. 크기(h-full 등)를 여기서 정한다. 틀은 position: relative 와 overflow: hidden 이 고정이다.
   className?: string;
   // 실제로 스크롤되는 요소의 클래스. 높이를 내용에 맞추고 최대 높이만 줄 때(max-h-*)는 여기에 쓴다.
   viewportClassName?: string;
   // 내용을 감싸는 요소의 클래스. flex 레이아웃이나 min-h-full 처럼 내용 전체의 배치를 정할 때 쓴다.
   contentClassName?: string;
   // 어느 방향으로 스크롤할지. 막대는 그 방향에만 생긴다.
   orientation?: Orientation;
   // 스크롤되는 요소의 ref. scrollTo 같은 호출이 필요할 때 쓴다.
   viewportRef?: Ref<HTMLDivElement>;
   // 스크롤 영역의 이름. 주면 스크린 리더가 영역(region)으로 읽는다. (페이지 main처럼 이미 이름이 있으면 생략)
   label?: string;
   // 키보드(Tab)로 스크롤 영역에 멈출 수 있게 한다. 모달처럼 포커스를 직접 관리하는 곳은 false로 둔다.
   focusable?: boolean;
}

// 서비스 전체의 스크롤 영역. 막대가 내용 위에 겹쳐 떠서, 스크롤이 생기고 사라져도 내용의 너비가 변하지 않는다.
// 막대 배경(트랙)은 투명하고, 막대(thumb)는 내용이 넘칠 때 항상 보이며 마우스를 올리면 진해진다.
// 브라우저 기본 스크롤바 대신 쓴다. (입력창처럼 감쌀 수 없는 곳은 globals.css 의 얇은 기본 스타일이 맡는다.)
// 사용: 크기를 정한 틀(className) 안에 내용을 넣는다. 내용이 틀보다 크면 스크롤된다.
export function ScrollArea({
   children,
   className = '',
   viewportClassName = '',
   contentClassName = '',
   orientation = 'vertical',
   viewportRef,
   label,
   focusable = true,
   ...rootProps
}: ScrollAreaProps) {
   const vertical = orientation !== 'horizontal';
   const horizontal = orientation !== 'vertical';

   return (
      <ScrollAreaPrimitive.Root type="auto" className={className} {...rootProps}>
         <ScrollAreaPrimitive.Viewport
            ref={viewportRef}
            disableImplicitContentElement
            // scrollAreaToTop 이 가장 가까운 스크롤 요소를 찾는 표시. (Radix 내부 속성에 기대지 않으려고 따로 둔다.)
            data-scroll-viewport=""
            // 키보드 사용자가 방향키로 스크롤할 수 있도록 포커스를 받게 한다. (포커스 표시는 키보드로 왔을 때만 보인다.)
            tabIndex={focusable ? 0 : undefined}
            role={label ? 'region' : undefined}
            aria-label={label}
            className={`size-full rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/50 focus-visible:ring-inset ${viewportClassName}`}
         >
            <ScrollAreaPrimitive.Content
               // Radix 기본은 display: table 이라 flex 나 min-h-full 같은 안쪽 레이아웃이 어긋난다.
               // 세로로만 스크롤할 때는 이 값을 풀어서 평소처럼 배치되게 하고, 가로 스크롤이 있을 때는 내용 폭을 재야 하므로 그대로 둔다.
               style={horizontal ? undefined : { display: undefined }}
               className={contentClassName}
            >
               {children}
            </ScrollAreaPrimitive.Content>
         </ScrollAreaPrimitive.Viewport>

         {vertical && <Bar orientation="vertical" />}
         {horizontal && <Bar orientation="horizontal" />}
         {vertical && horizontal && <ScrollAreaPrimitive.Corner />}
      </ScrollAreaPrimitive.Root>
   );
}

// from 요소를 감싼 가장 가까운 ScrollArea를 맨 위로 올린다. (페이지 이동이나 단계 전환 뒤에 새 내용의 처음부터 보이게 한다.)
// 페이지(main)는 서버 컴포넌트라 viewportRef를 안쪽으로 내려줄 수 없어서, 안쪽 컴포넌트가 자기 위치에서 찾아 올린다.
// 스크롤 영역 밖이면 아무 일도 하지 않는다.
export function scrollAreaToTop(from: Element | null | undefined) {
   from?.closest<HTMLElement>('[data-scroll-viewport]')?.scrollTo({ top: 0 });
}

function Bar({ orientation }: { orientation: 'vertical' | 'horizontal' }) {
   return (
      <ScrollAreaPrimitive.Scrollbar
         orientation={orientation}
         // 트랙은 배경 없이 비워 두고, 안쪽 여백(p-0.5)으로 막대가 가장자리에서 살짝 떨어지게 한다.
         className={`group flex touch-none p-0.5 select-none ${
            orientation === 'vertical' ? 'h-full w-2.5' : 'h-2.5 flex-col'
         }`}
      >
         <ScrollAreaPrimitive.Thumb className="bg-scrollbar-thumb group-hover:bg-scrollbar-thumb-hover relative flex-1 rounded-full transition-colors" />
      </ScrollAreaPrimitive.Scrollbar>
   );
}
