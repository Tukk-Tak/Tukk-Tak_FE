// 지금 보고 있는 주소(하위 경로 포함)가 해당 메뉴의 주소인지. 헤더 메뉴와 마이페이지 사이드바가 현재 메뉴를 표시하는 데 쓴다.
// 예) /community/post-1 은 /community 메뉴로 본다. (/community-x 처럼 이름만 비슷한 주소는 아니다.)
export function isActivePath(pathname: string, href: string) {
   return pathname === href || pathname.startsWith(`${href}/`);
}
