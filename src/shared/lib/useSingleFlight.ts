import { useCallback, useRef, useState } from 'react';

// 이전 요청이 끝나기 전의 중복 호출을 무시한다.
// state(pending)는 비동기로 갱신되어 빠른 연타를 막지 못하므로, 동기 가드(ref)를 함께 쓴다.
export function useSingleFlight() {
   const busyRef = useRef(false);
   const [pending, setPending] = useState(false);

   const run = useCallback(async <T>(task: () => Promise<T>): Promise<T | undefined> => {
      if (busyRef.current) return undefined;

      busyRef.current = true;
      setPending(true);
      try {
         return await task();
      } finally {
         busyRef.current = false;
         setPending(false);
      }
   }, []);

   return { run, pending };
}
