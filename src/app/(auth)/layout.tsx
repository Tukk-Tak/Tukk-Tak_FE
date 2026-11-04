import { AuthIntro } from '@/widgets/auth-intro';

// 회원가입/로그인 페이지 공용 2단 레이아웃. 왼쪽 소개 패널은 여기서 한 번만 배치한다.
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div className="flex min-h-[calc(100vh-4rem)]">
         <AuthIntro />
         {/* min-w-0: 내용이 넓어도 좁은 화면에서 main이 화면보다 커지지 않고 줄어들게 한다. */}
         <main className="flex min-w-0 flex-1 justify-center bg-white px-[4%] py-10">
            {children}
         </main>
      </div>
   );
}
