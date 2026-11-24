import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import { SIGNUP_ERROR } from '../model/errorCodes';

interface CheckNicknameData {
   available?: boolean;
}

// 닉네임 중복 확인 GET /auth/nickname/check?nickname=
// 사용할 수 있으면 아무것도 돌려주지 않고, 이미 쓰는 이름이면 예외를 던진다.
// 이미 쓰는 이름은 서버가 오류가 아니라 200과 available: false로 알려 주므로 여기서 오류로 바꾼다. (문구는 서버가 주지 않아 프론트가 정한다.)
// 형식에 맞지 않으면 400(AUTH-NICKNAME-INVALID), 1분에 31번째 요청이면 429이고, 문구는 서버 message를 그대로 보여 준다.
// 아직 로그인하기 전의 요청이라 로그인 토큰은 붙이지 않는다. (auth: false)
export async function checkNickname(nickname: string): Promise<void> {
   const data = await apiFetch<CheckNicknameData | null>(
      `/auth/nickname/check?nickname=${encodeURIComponent(nickname)}`,
      { auth: false },
   );

   if (data?.available !== true) {
      throw new ApiError(SIGNUP_ERROR.NICKNAME_TAKEN, '이미 사용 중인 이름이에요');
   }
}
