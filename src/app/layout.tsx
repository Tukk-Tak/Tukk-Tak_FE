import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "뚝딱",
  description:
    "코드 없이, AI의 도움과 몇 번의 클릭만으로 요식업 사장님이 직접 홍보용 가게 홈페이지를 만들고 배포할 수 있게 하는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
