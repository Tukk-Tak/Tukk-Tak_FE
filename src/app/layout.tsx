import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_KR, Outfit } from 'next/font/google';
import { ToastProvider } from '@/shared/ui/ToastProvider';
import { Header } from '@/widgets/header';

// 한글 글리프는 unicode-range 단위로 필요한 조각만 내려받는다.
const notoSansKr = Noto_Sans_KR({
   subsets: ['latin'],
   variable: '--font-noto-sans-kr',
   display: 'swap',
});

const outfit = Outfit({
   subsets: ['latin'],
   variable: '--font-outfit-src',
   display: 'swap',
});

export const metadata: Metadata = {
   title: '뚝딱',
   description:
      '코드 없이, AI의 도움과 몇 번의 클릭만으로 요식업 사장님이 직접 홍보용 가게 홈페이지를 만들고 배포할 수 있게 하는 서비스',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="ko" className={`${notoSansKr.variable} ${outfit.variable}`}>
         <body>
            <ToastProvider>
               <Header />
               {children}
            </ToastProvider>
         </body>
      </html>
   );
}
