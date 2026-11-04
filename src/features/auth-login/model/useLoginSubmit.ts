import { useCallback, useState } from 'react';
import type { User } from '@/entities/user/types';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { login } from '../api/login';
import type { LoginPayload } from '../types';

interface LoginFailure {
   code: string;
   message: string;
}

// ok: 로그인 성공 / !ok: 실패 / null: 이미 진행 중인 요청이 있어 무시됨
export type LoginResult = { ok: true; user: User } | { ok: false; failure: LoginFailure } | null;

export function useLoginSubmit() {
   const [error, setError] = useState<LoginFailure | null>(null);
   // 로그인에 성공하면 페이지 이동이 끝날 때까지 제출 중 상태를 유지한다. (같은 요청이 한 번 더 전송되는 것을 막는다.)
   const [completed, setCompleted] = useState(false);
   const { run, pending } = useSingleFlight();

   const submit = useCallback(
      async (payload: LoginPayload): Promise<LoginResult> => {
         setError(null);
         const result = await run<LoginResult>(async () => {
            try {
               const user = await login(payload);
               setCompleted(true);
               return { ok: true, user };
            } catch (caught) {
               const { code, message } = toApiError(caught);
               const failure = { code, message };
               setError(failure);
               return { ok: false, failure };
            }
         });
         return result ?? null;
      },
      [run],
   );

   // 입력을 고치면 직전 제출의 오류는 더 이상 현재 상태를 설명하지 않는다.
   const clearError = useCallback(() => setError(null), []);

   return { error, submitting: pending || completed, submit, clearError };
}
