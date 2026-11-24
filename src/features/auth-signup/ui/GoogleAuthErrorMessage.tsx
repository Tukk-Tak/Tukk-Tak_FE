import { FieldMessage } from '@/shared/ui/FieldMessage';
import { GOOGLE_AUTH_ERROR, type GoogleAuthError } from '../model/googleAuthError';

// 구글 버튼 아래에 보여주는 구글 가입 안내
export function GoogleAuthErrorMessage({ error }: { error: GoogleAuthError }) {
   return (
      <FieldMessage tone="error" className="mt-3 text-center">
         {error === GOOGLE_AUTH_ERROR.EXPIRED && '구글 연결 시간이 지났어요. 다시 시도해주세요'}
      </FieldMessage>
   );
}
