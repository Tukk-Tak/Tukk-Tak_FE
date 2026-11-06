import { AuthIntro } from '@/widgets/auth-intro';

// 회원가입/로그인 페이지 공용 2단 레이아웃. 왼쪽 소개 패널은 여기서 한 번만 배치한다.
// 헤더를 뺀 남은 높이를 모두 쓰고(h-full), 내용이 길면 페이지 전체가 아니라 오른쪽 main만 스크롤한다.
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div className="flex h-full overflow-hidden">
         <AuthIntro />
         {/* min-w-0: 내용이 넓어도 좁은 화면에서 main이 화면보다 커지지 않고 줄어들게 한다. */}
         {/* relative: sr-only 같은 absolute 요소가 main을 기준으로 잡혀야 페이지 스크롤을 만들지 않고 main 안에서만 스크롤된다. */}
         {/* 안쪽 div: 스크롤 컨테이너 자신의 아래 padding은 끝까지 스크롤했을 때 사라지므로, 여백(py-10)은 안쪽에 둔다. */}
         <main className="relative min-w-0 flex-1 overflow-y-auto bg-white">
            <div className="flex min-h-full justify-center px-[4%] py-10">{children}</div>
         </main>
      </div>
   );
}
