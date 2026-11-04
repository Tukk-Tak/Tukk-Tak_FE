interface StartGoogleAuthOptions {
   intent: 'signup' | 'login';
   // true면 구글 계정 선택 화면부터 다시 시작한다. (다른 계정으로 변경)
   selectAccount?: boolean;
}

// TODO: 백엔드의 구글 로그인 주소가 정해지면 그 주소로 이동하도록 교체한다. 지금은 UI 확인용 mock이다.
// 실제로는 구글 인증이 끝난 뒤 백엔드가 가입 화면(/signup/google) 또는 오류가 담긴 /signup?google=...
// 으로 돌려보내므로, 프론트는 이동만 시작하면 된다.
// TODO: selectAccount는 아직 처리하지 않는다. mock에서는 "다른 계정으로 변경"을 눌러도 같은 계정 정보가
// 다시 불러와질 뿐이다. 실제 연동 때 구글 계정 선택 화면(prompt=select_account)을 요청하도록 연결한다.
export function startGoogleAuth({ intent }: StartGoogleAuthOptions) {
   window.location.assign(intent === 'signup' ? '/signup/google' : '/login');
}
