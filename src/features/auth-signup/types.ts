// 1단계(계정 정보)
export interface AccountValues {
   email: string;
   password: string;
   passwordConfirm: string;
}

// 2단계(가게 정보). 구글로 가입할 때는 이 화면만 거친다.
export interface StoreValues {
   name: string;
   nickname: string;
   phone: string;
   businessNumber: string;
   openDate: string;
   storeAddress: string;
   storePhone: string;
   agreed: boolean;
}

export interface BusinessVerifyInput {
   businessNumber: string;
   openDate: string;
   representativeName: string;
}

// 구글 인증을 마치고 돌아왔을 때 구글에서 가져온 정보
export interface GoogleProfile {
   name: string;
   email: string;
}

// 가입 방식과 상관없이 2단계 입력에서 만들어지는 부분
export interface SignupPayloadBase {
   name: string;
   nickname: string;
   phone: string;
   // 선택 항목은 입력하지 않았거나(사업자 인증은 인증을 마치지 않았거나) 하면 보내지 않는다.
   // 사업자 번호와 개업일자는 사업자 인증 때 이미 서버에 보냈으므로, 가입에는 그 결과로 받은 토큰만 보낸다.
   businessToken?: string;
   store?: { address: string; phone: string };
   // 개인정보 수집·이용과 AI 사용에 한 번에 동의하는 체크박스 하나다. 서버에는 두 항목 모두에 같은 값으로 보낸다.
   agreedToTerms: boolean;
}

// 이메일 가입은 이메일 인증 때 받은 토큰(emailToken)과 비밀번호를 보낸다. (이메일 주소 자체는 보내지 않는다.)
// 구글 가입은 이메일과 비밀번호 대신, 구글 인증 때 서버에 만들어진 가입 대기 정보를 쓴다.
export type SignupPayload =
   | (SignupPayloadBase & {
        provider: 'EMAIL';
        emailToken: string;
        password: string;
        passwordConfirm: string;
     })
   | (SignupPayloadBase & { provider: 'GOOGLE' });
