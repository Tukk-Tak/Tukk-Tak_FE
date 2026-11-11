// 서비스 헤더가 없는 에디터 전용 레이아웃. 화면 전체를 에디터가 쓰고, 페이지 전체는 스크롤하지 않는다.
// 스크롤은 에디터 안의 캔버스와 패널이 각자 맡는다.
export default function EditorRouteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
   return <div className="h-dvh overflow-hidden">{children}</div>;
}
