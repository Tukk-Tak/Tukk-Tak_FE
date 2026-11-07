import { Header } from '@/widgets/header';

// 서비스 헤더가 있는 화면(메인, 요금제, 로그인·회원가입 등)의 공용 레이아웃.
// 헤더가 없는 화면(에디터, 배포된 사이트 등)은 이 그룹 밖의 라우트 그룹에 둔다. (괄호 폴더 이름은 주소에 나타나지 않는다.)
// 화면 높이를 헤더와 본문이 나눠 가진다. 페이지는 헤더 높이를 따로 계산하지 않고 h-full만 쓰면 되고,
// 내용이 길면 페이지 전체가 아니라 각 페이지의 main만 스크롤한다.
export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div className="flex h-dvh flex-col">
         <Header />
         {/* min-h-0: 내용이 길어도 이 영역이 화면보다 커지지 않고, 안쪽 main이 스크롤되게 한다. */}
         <div className="min-h-0 flex-1">{children}</div>
      </div>
   );
}
