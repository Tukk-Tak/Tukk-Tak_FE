import { ScrollArea } from '@/shared/ui/ScrollArea';
import { AuthIntro } from '@/widgets/auth-intro';

// 회원가입/로그인 페이지 공용 2단 레이아웃. 왼쪽 소개 패널은 여기서 한 번만 배치한다.
// 헤더를 뺀 남은 높이를 모두 쓰고(h-full), 내용이 길면 페이지 전체가 아니라 오른쪽 main만 스크롤한다.
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div className="flex h-full overflow-hidden">
         <AuthIntro />
         {/* min-w-0: 내용이 넓어도 좁은 화면에서 main이 화면보다 커지지 않고 줄어들게 한다. */}
         {/* relative: sr-only 같은 absolute 요소가 main을 기준으로 잡혀야 페이지 스크롤을 만들지 않고 main 안에서만 스크롤된다. */}
         <main className="relative min-w-0 flex-1 bg-white">
            {/* 내용 영역을 세로 flex로 두고 안쪽 div가 남은 높이를 채우게(flex-1) 해서, 내용이 짧아도 화면 중앙에 오게 한다. */}
            {/* 안쪽 div: 스크롤 영역 자신의 아래 padding은 끝까지 스크롤했을 때 사라지므로, 여백(py-10)은 안쪽에 둔다. */}
            <ScrollArea className="h-full" contentClassName="flex min-h-full flex-col">
               <div className="flex flex-1 justify-center px-[4%] py-10">{children}</div>
            </ScrollArea>
         </main>
      </div>
   );
}
