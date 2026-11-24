import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import type { BusinessVerifyInput } from '../types';

interface VerifyBusinessData {
   businessToken?: string;
}

// 사업자 인증 POST /auth/business/verify
// 성공하면 가입 요청에 쓸 사업자 토큰(businessToken)을 돌려준다. 가입 때의 이름은 여기서 보낸 대표자명(ceoName)과 같아야 한다.
// 국세청 정보와 다르면 400(AUTH-BUSINESS-MISMATCH), 폐업이면 400(AUTH-BUSINESS-CLOSED), 이미 인증된 번호면 409,
// 요청이 많으면 429, 국세청이 응답하지 않으면 503이다. 문구는 서버 message를 그대로 보여 준다.
// 아직 로그인하기 전의 요청이라 로그인 토큰은 붙이지 않는다. (auth: false)
export async function verifyBusiness(input: BusinessVerifyInput): Promise<string> {
   const data = await apiFetch<VerifyBusinessData | null>('/auth/business/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         businessNumber: input.businessNumber,
         openDate: input.openDate,
         ceoName: input.representativeName,
      }),
      auth: false,
   });

   // 토큰이 없으면 가입에 쓸 수 없으므로, 인증이 끝난 것으로 보지 않고 실패로 알린다.
   if (!data?.businessToken) {
      throw new ApiError('UNKNOWN', '사업자 인증 처리 중 오류가 발생했어요. 다시 시도해주세요');
   }
   return data.businessToken;
}
