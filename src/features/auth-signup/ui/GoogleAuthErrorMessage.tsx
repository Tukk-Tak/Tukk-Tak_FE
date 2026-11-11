import Link from 'next/link';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { GOOGLE_AUTH_ERROR, type GoogleAuthError } from '../model/googleAuthError';

// 구글 버튼 아래에 보여주는 구글 연결 오류 안내
export function GoogleAuthErrorMessage({ error }: { error: GoogleAuthError }) {
   return (
      <FieldMessage tone="error" className="mt-3 text-center">
         {error === GOOGLE_AUTH_ERROR.REGISTERED && (
            <>
               이미 가입된 구글 계정이에요{' · '}
               <Link href="/login" className="cursor-pointer underline underline-offset-4">
                  로그인하기
               </Link>
            </>
         )}
         {error === GOOGLE_AUTH_ERROR.FAILED && '구글 연결에 실패했어요. 잠시 후 다시 시도해주세요'}
         {error === GOOGLE_AUTH_ERROR.EXPIRED && '구글 연결 시간이 지났어요. 다시 시도해주세요'}
      </FieldMessage>
   );
}
