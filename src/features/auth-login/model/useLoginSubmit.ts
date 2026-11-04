import { useCallback, useRef, useState } from 'react';
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
   // 입력이 바뀔 때마다 올린다. 요청 중에 입력이 바뀌었다면 그 요청의 실패는 현재 입력과 상관없으므로 무시한다.
   const inputVersion = useRef(0);

   const submit = useCallback(
      async (payload: LoginPayload): Promise<LoginResult> => {
         setError(null);
         const versionAtSubmit = inputVersion.current;
         const result = await run<LoginResult>(async () => {
            try {
               const user = await login(payload);
               setCompleted(true);
               return { ok: true, user };
            } catch (caught) {
               // 이미 고친 입력에 이전 실패를 적용하지 않는다. (오류를 다시 띄우거나 새 비밀번호를 지우는 것을 막는다.)
               if (versionAtSubmit !== inputVersion.current) return null;
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
   const clearError = useCallback(() => {
      inputVersion.current += 1;
      setError(null);
   }, []);

   return { error, submitting: pending || completed, submit, clearError };
}
