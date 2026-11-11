// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import { MypageLayout } from '@/widgets/mypage-layout';

// 마이페이지 모든 화면(/mypage/...)이 함께 쓰는 틀. 사이드바와 로그인 확인은 MypageLayout이 맡는다.
export default function MypageRouteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return <MypageLayout>{children}</MypageLayout>;
}
