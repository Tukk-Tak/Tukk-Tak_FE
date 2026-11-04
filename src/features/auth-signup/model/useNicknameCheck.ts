import { useCallback, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { checkNickname } from '../api/checkNickname';

// rejected: 이미 사용 중이거나, 확인 요청 자체가 실패한 경우. 사유는 message에 담긴다.
export type NicknameCheckStatus = 'idle' | 'available' | 'rejected';

export function useNicknameCheck() {
   const [status, setStatus] = useState<NicknameCheckStatus>('idle');
   const [message, setMessage] = useState<string | null>(null);
   const { run, pending } = useSingleFlight();

   const check = useCallback(
      (nickname: string) =>
         run(async () => {
            try {
               await checkNickname(nickname);
               setStatus('available');
               setMessage(null);
            } catch (error) {
               setStatus('rejected');
               setMessage(toApiError(error).message);
            }
         }),
      [run],
   );

   // 닉네임을 고치면 이전 확인 결과는 무효다.
   const reset = useCallback(() => {
      setStatus('idle');
      setMessage(null);
   }, []);

   return { status, message, checking: pending, check, reset };
}

export type NicknameCheckState = ReturnType<typeof useNicknameCheck>;
