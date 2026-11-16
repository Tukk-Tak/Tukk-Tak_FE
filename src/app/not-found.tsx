import type { Metadata } from 'next';
import { NotFoundScreen } from '@/widgets/error-pages';

export const metadata: Metadata = {
   title: '페이지를 찾을 수 없어요 | 뚝딱',
};

// 서비스 헤더가 없는 영역(에디터, 배포된 사이트 등)에서 notFound()를 불렀을 때 보이는 404 화면.
// 헤더가 있는 영역은 (main)/not-found.tsx 와 (main)/[...rest] 가 맡아서 헤더와 함께 보여 준다.
export default function NotFound() {
   return <NotFoundScreen standalone />;
}
