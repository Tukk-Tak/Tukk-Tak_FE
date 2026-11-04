import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { SIGNUP_ERROR } from '../model/errorCodes';
import type { BusinessVerifyInput } from '../types';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. 지금은 UI 확인용 mock이다.
// mock 규칙: 사업자 등록번호가 1234567890 이면 인증에 성공하고, 그 외에는 정보 불일치다.
export async function verifyBusiness(input: BusinessVerifyInput): Promise<void> {
   await mockDelay(900);

   if (input.businessNumber !== '1234567890') {
      throw new ApiError(
         SIGNUP_ERROR.BUSINESS_MISMATCH,
         '국세청 정보와 일치하지 않아요. 입력하신 내용을 다시 확인해주세요.',
      );
   }
}
