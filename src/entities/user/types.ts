export interface User {
   nickname: string;
   // 가입할 때 적은 본명. 마이페이지 사이드바에서 "김뚝딱 사장님"처럼 보여 준다.
   name: string;
   // 사업자 인증을 마쳤는지. 프로필 메뉴가 "사업자 인증 완료"/"사업자 미인증"을 보여 줄 때 쓴다.
   isBusinessVerified: boolean;
   // 가입한 방식. 마이페이지에서 비밀번호 변경 영역을 보여 줄지 정하는 데 쓴다. (구글 계정은 비밀번호가 없다.)
   authProvider: AuthProvider;
}

export type AuthProvider = 'LOCAL' | 'GOOGLE';
