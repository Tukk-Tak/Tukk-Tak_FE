export interface User {
   nickname: string;
   // 가입할 때 적은 본명. 마이페이지 사이드바에서 "김뚝딱 사장님"처럼 보여 준다.
   name: string;
   // 사업자 인증을 마쳤는지. 프로필 메뉴가 "사업자 인증 완료"/"사업자 미인증"을 보여 줄 때 쓴다.
   isBusinessVerified: boolean;
}
