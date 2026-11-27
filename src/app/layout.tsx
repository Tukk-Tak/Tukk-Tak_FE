import './globals.css';
import type { Metadata } from 'next';
import {
   Do_Hyeon,
   Gaegu,
   Gowun_Dodum,
   Jua,
   Noto_Sans_KR,
   Noto_Serif_KR,
   Outfit,
} from 'next/font/google';
import { SessionExpiredNotice } from '@/entities/user/ui/SessionExpiredNotice';
import { ToastProvider } from '@/shared/ui/ToastProvider';

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

// 사용자 사이트에서 고를 수 있는 글꼴. 쓰는 사이트에서만 필요한 조각을 내려받도록 미리 불러오기(preload)는 끈다.
// 변수 이름은 entities/site/model/fonts.ts 의 SITE_FONTS 와 맞춰야 한다.
const notoSerifKr = Noto_Serif_KR({
   subsets: ['latin'],
   variable: '--font-noto-serif-kr',
   display: 'swap',
   preload: false,
});
const gowunDodum = Gowun_Dodum({
   subsets: ['latin'],
   weight: '400',
   variable: '--font-gowun-dodum',
   display: 'swap',
   preload: false,
});
const gaegu = Gaegu({
   subsets: ['latin'],
   weight: ['400', '700'],
   variable: '--font-gaegu',
   display: 'swap',
   preload: false,
});
const jua = Jua({
   subsets: ['latin'],
   weight: '400',
   variable: '--font-jua',
   display: 'swap',
   preload: false,
});
const doHyeon = Do_Hyeon({
   subsets: ['latin'],
   weight: '400',
   variable: '--font-do-hyeon',
   display: 'swap',
   preload: false,
});

const FONT_VARIABLES = [notoSansKr, outfit, notoSerifKr, gowunDodum, gaegu, jua, doHyeon]
   .map((font) => font.variable)
   .join(' ');

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
      <html lang="ko" className={FONT_VARIABLES}>
         <body>
            <ToastProvider>
               {children}
               <SessionExpiredNotice />
            </ToastProvider>
         </body>
      </html>
   );
}
