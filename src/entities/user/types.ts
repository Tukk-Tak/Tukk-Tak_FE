export interface User {
   nickname: string;
   // 사업자 인증을 마쳤는지. 프로필 메뉴가 "사업자 인증 완료"/"사업자 미인증"을 보여 줄 때 쓴다.
   isBusinessVerified: boolean;
}
