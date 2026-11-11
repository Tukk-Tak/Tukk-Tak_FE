export interface MypageMenuItem {
   label: string;
   href: string;
   // 눈에 덜 띄게 보여 줄 메뉴 (회원 탈퇴)
   muted?: boolean;
}

// 마이페이지 사이드바 메뉴. 순서와 주소는 이 목록 한 곳에서 정한다.
export const MYPAGE_MENU: MypageMenuItem[] = [
   { label: '회원 정보', href: '/mypage/profile' },
   { label: '사업자 인증', href: '/mypage/business' },
   { label: '결제 내역', href: '/mypage/payments' },
   { label: '내 사이트', href: '/mypage/sites' },
   { label: '북마크', href: '/mypage/bookmarks' },
   { label: '회원 탈퇴', href: '/mypage/withdraw', muted: true },
];

// /mypage 로 들어오면 처음 보여 줄 화면
export const MYPAGE_HOME = MYPAGE_MENU[0].href;
