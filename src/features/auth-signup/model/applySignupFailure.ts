import { SIGNUP_ERROR } from './errorCodes';
import type { StoreFormState, SubmittedInputs } from './useStoreForm';

interface ApplySignupFailureOptions {
   code: string;
   message: string;
   // 가입을 요청한 시점의 입력. 응답이 늦게 도착했을 때 지금 입력과 같은지 비교하는 데 쓴다.
   submitted: SubmittedInputs;
   form: StoreFormState;
   // 폼 아래에 이미 띄운 오류 문구를 지운다. (닉네임·사업자 칸에 사유를 보여 줄 때 같은 문구가 두 번 보이지 않게)
   clearError: () => void;
}

// 이메일 가입과 구글 가입이 함께 받는, 가게 정보 입력(닉네임·사업자 인증) 때문에 가입이 거절된 경우를 처리한다.
// 처리했으면 true, 이 코드는 여기서 다루지 않으니 호출한 쪽이 처리하라는 뜻이면 false를 돌려준다.
// (문구는 모두 서버 message다.)
export function applySignupFailure({
   code,
   message,
   submitted,
   form,
   clearError,
}: ApplySignupFailureOptions): boolean {
   switch (code) {
      // 중복확인 뒤에 다른 사람이 같은 이름을 썼다. 닉네임 칸에서 다시 확인하게 한다.
      case SIGNUP_ERROR.NICKNAME_ALREADY_USED:
         clearError();
         form.rejectNickname(submitted, message);
         return true;
      // 사업자 인증을 더 쓸 수 없다. 사업자 칸에 사유를 보여 주고 다시 인증하게 한다.
      case SIGNUP_ERROR.BUSINESS_TOKEN_INVALID:
      case SIGNUP_ERROR.BUSINESS_NAME_MISMATCH:
      case SIGNUP_ERROR.BUSINESS_ALREADY_USED:
         clearError();
         form.failBusiness(submitted, message);
         return true;
      default:
         return false;
   }
}
