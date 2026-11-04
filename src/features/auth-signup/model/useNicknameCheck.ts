import { useCallback, useRef, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { checkNickname } from '../api/checkNickname';

// rejected: 이미 사용 중이거나, 확인 요청 자체가 실패한 경우. 사유는 message에 담긴다.
export type NicknameCheckStatus = 'idle' | 'available' | 'rejected';

export function useNicknameCheck() {
   const [status, setStatus] = useState<NicknameCheckStatus>('idle');
   const [message, setMessage] = useState<string | null>(null);
   const { run, pending } = useSingleFlight();
   // 확인을 요청한 뒤 닉네임이 바뀌면(reset) 값이 올라가, 그 이전에 보낸 요청의 응답은 무시한다.
   const versionRef = useRef(0);

   const check = useCallback(
      (nickname: string) =>
         run(async () => {
            const version = versionRef.current;
            try {
               await checkNickname(nickname);
               if (version !== versionRef.current) return;
               setStatus('available');
               setMessage(null);
            } catch (error) {
               if (version !== versionRef.current) return;
               setStatus('rejected');
               setMessage(toApiError(error).message);
            }
         }),
      [run],
   );

   // 닉네임을 고치면 이전 확인 결과는 무효다. 진행 중이던 확인의 응답도 무효로 만든다.
   const reset = useCallback(() => {
      versionRef.current += 1;
      setStatus('idle');
      setMessage(null);
   }, []);

   return { status, message, checking: pending, check, reset };
}

export type NicknameCheckState = ReturnType<typeof useNicknameCheck>;
