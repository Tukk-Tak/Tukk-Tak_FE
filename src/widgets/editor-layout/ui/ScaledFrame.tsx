'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const TRANSITION_MS = 320;

function easeInOutCubic(t: number) {
   return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

// 고정 폭(width)으로 그린 사이트를 사용 가능한 너비에 맞춰 같은 비율로 줄여서 보여 준다.
// transform은 레이아웃 크기를 바꾸지 않으므로, 줄인 크기만큼 바깥 박스의 너비와 높이를 직접 맞춘다.
// 안쪽은 항상 배치 폭(renderWidth) 그대로 배치되어서 반응형 규칙(컨테이너 쿼리)이 실제 기기 폭 기준으로 동작한다.
//
// width가 바뀌면 배치 폭이 그 값으로 서서히 변한다. 브라우저 창 크기를 조절하는 것처럼 보이도록,
// 배율은 매 프레임 배치 폭에서 다시 계산한다. (배율을 따로 바꾸면 한 프레임 동안 폭과 배율이 어긋나 깜빡인다.)
export function ScaledFrame({ width, children }: { width: number; children: ReactNode }) {
   const outerRef = useRef<HTMLDivElement>(null);
   const innerRef = useRef<HTMLDivElement>(null);
   const renderWidthRef = useRef(width);
   const [renderWidth, setRenderWidth] = useState(width);
   const [availableWidth, setAvailableWidth] = useState(0);
   const [innerHeight, setInnerHeight] = useState(0);

   useEffect(() => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) return;

      const update = () => {
         setAvailableWidth(outer.clientWidth);
         setInnerHeight(inner.offsetHeight);
      };
      update();

      const observer = new ResizeObserver(update);
      observer.observe(outer);
      observer.observe(inner);
      return () => observer.disconnect();
   }, []);

   useEffect(() => {
      const from = renderWidthRef.current;
      if (from === width) return;

      const apply = (value: number) => {
         renderWidthRef.current = value;
         setRenderWidth(value);
      };

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
         apply(width);
         return;
      }

      const start = performance.now();
      let frame = 0;
      const step = (now: number) => {
         const progress = Math.min(1, (now - start) / TRANSITION_MS);
         apply(from + (width - from) * easeInOutCubic(progress));
         if (progress < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frame);
   }, [width]);

   // 사용 가능한 너비보다 작게 그릴 때는 확대하지 않는다.
   const scale = availableWidth > 0 ? Math.min(1, availableWidth / renderWidth) : 1;

   return (
      <div
         ref={outerRef}
         className="w-full"
         // 너비를 재기 전에는 확대 전 크기로 한 번 그려지므로 숨겨 둔다.
         style={{ visibility: availableWidth > 0 ? 'visible' : 'hidden' }}
      >
         <div
            className="mx-auto"
            style={{ width: renderWidth * scale, height: innerHeight * scale }}
         >
            <div
               ref={innerRef}
               className="min-h-160 overflow-hidden rounded-lg bg-white shadow-card"
               style={{
                  width: renderWidth,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
               }}
            >
               {children}
            </div>
         </div>
      </div>
   );
}
