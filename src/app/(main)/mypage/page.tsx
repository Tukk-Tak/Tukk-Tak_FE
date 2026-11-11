// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import { redirect } from 'next/navigation';
import { MYPAGE_HOME } from '@/widgets/mypage-layout';

// 헤더의 "마이페이지" 링크(/mypage)로 들어오면 첫 화면(회원 정보)으로 보낸다.
export default function MypageIndexPage() {
   redirect(MYPAGE_HOME);
}
