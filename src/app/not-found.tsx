import { ButtonLink } from '@/shared/ui/ButtonLink';

// 주소와 맞는 페이지가 없을 때 보이는 404 화면.
// 루트에 두므로 서비스 헤더가 없는 화면(에디터, 배포된 사이트 등)과 함께 쓰인다.
// 그래서 헤더 대신 홈으로 돌아가는 링크를 직접 둔다.
export default function NotFound() {
   return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-brand-cream px-[4%] text-center">
         <p className="text-xs font-bold tracking-[0.2em] text-brand-orange">404</p>
         <h1 className="mt-3 text-2xl font-bold text-black">페이지를 찾을 수 없어요</h1>
         <p className="mt-2 text-sm text-black/50">주소가 바뀌었거나 없는 페이지예요.</p>
         <ButtonLink href="/" size="form" className="mt-8">
            홈으로 돌아가기
         </ButtonLink>
      </main>
   );
}
