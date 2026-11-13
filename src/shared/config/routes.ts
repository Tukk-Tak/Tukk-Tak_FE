// 여러 곳에서 같은 주소로 보내는 경로. 주소를 바꿀 때 한 곳만 고치도록 모아 둔다.

// 사이트 만들기 허브. 아무 카드도 선택되지 않은 채 열린다.
export const CREATE_PATH = '/create';

// 사이트 만들기 허브를 "AI로 초안 만들기" 카드가 선택된 채로 연다.
export const CREATE_WITH_AI_PATH = '/create?start=ai';

export const LOGIN_PATH = '/login';

// 비밀번호 재설정. 로그인 화면의 "비밀번호를 잊으셨나요?"가 이 주소로 보낸다.
export const FIND_PASSWORD_PATH = '/find-password';

// 선택한 템플릿으로 에디터를 연다.
// TODO: 임시 연결이다. 사이트 생성 API가 생기면 만들어진 siteId로 /editor/{siteId} 에 이동하도록 바꾸고 이 함수는 지운다.
export function getEditorPathWithTemplate(templateId: string) {
   return `/editor/temp?template=${encodeURIComponent(templateId)}`;
}
