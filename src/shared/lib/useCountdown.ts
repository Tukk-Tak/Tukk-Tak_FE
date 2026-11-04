import { useCallback, useEffect, useState } from 'react';

// 남은 시간을 매 틱마다 빼지 않고 종료 시각과 현재 시각의 차로 계산해, 탭이 백그라운드여도 어긋나지 않게 한다.
export function useCountdown() {
   const [endAt, setEndAt] = useState<number | null>(null);
   const [remaining, setRemaining] = useState(0);

   useEffect(() => {
      if (endAt === null) return;

      const tick = () => {
         const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
         setRemaining(left);
         if (left === 0) setEndAt(null);
      };

      tick();
      const timerId = setInterval(tick, 500);
      return () => clearInterval(timerId);
   }, [endAt]);

   const start = useCallback((seconds: number) => setEndAt(Date.now() + seconds * 1000), []);
   const stop = useCallback(() => {
      setEndAt(null);
      setRemaining(0);
   }, []);

   return { remaining, running: endAt !== null, start, stop };
}
