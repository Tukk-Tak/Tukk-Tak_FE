import { AuthIntro } from '@/widgets/auth-intro';

// 회원가입/로그인 페이지 공용 2단 레이아웃. 왼쪽 소개 패널은 여기서 한 번만 배치한다.
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return (
      <div className="flex min-h-[calc(100vh-4rem)]">
         <AuthIntro />
         <main className="flex flex-1 justify-center bg-white px-[4%] py-10">{children}</main>
      </div>
   );
}
