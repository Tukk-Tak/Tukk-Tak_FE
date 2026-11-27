import { useCallback, useState } from 'react';
import { isUnauthorizedError, toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';

// 댓글·답글 등록처럼 "한 번만 보내고, 실패하면 이유를 보여 주는" 요청을 맡는다.
// 요청 중에 같은 동작이 다시 불려도 무시하고(동기 가드), 실패하면 null을 돌려주며 입력창이 내용을 그대로 두게 한다.
// 성공하면 task가 돌려준 값을 그대로 돌려준다. (등록 API는 돌려주는 값이 없어서 task가 true 같은 표시를 돌려주게 한다.)
export function useCommentSubmit() {
   const { run, pending } = useSingleFlight();
   const [error, setError] = useState<string | null>(null);

   const submit = useCallback(
      async <T>(task: () => Promise<T>): Promise<T | null> => {
         setError(null);
         const result = await run(async () => {
            try {
               return { ok: true as const, value: await task() };
            } catch (caught) {
               // 로그인 시간이 지난 경우는 apiClient가 이미 안내했다. 그 밖에는 서버가 준 문구를 그대로 보여 준다.
               if (!isUnauthorizedError(caught)) setError(toApiError(caught).message);
               return { ok: false as const };
            }
         });
         return result?.ok ? result.value : null;
      },
      [run],
   );

   const clearError = useCallback(() => setError(null), []);

   return { submit, submitting: pending, error, clearError };
}
