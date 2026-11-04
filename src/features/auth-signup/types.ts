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
   business?: { businessNumber: string; openDate: string };
   store?: { address: string; phone: string };
   agreedToTerms: boolean;
}

// 구글 가입은 이메일과 비밀번호 대신, 구글 인증 때 서버에 만들어진 가입 대기 정보를 쓴다.
export type SignupPayload =
   | (SignupPayloadBase & { provider: 'EMAIL'; email: string; password: string })
   | (SignupPayloadBase & { provider: 'GOOGLE' });
