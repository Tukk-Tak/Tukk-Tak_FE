import type { Metadata } from 'next';
import { NotFoundScreen } from '@/widgets/error-pages';

export const metadata: Metadata = {
   title: '페이지를 찾을 수 없어요 | 뚝딱',
};

// 서비스 헤더가 있는 화면의 404. notFound()를 불렀을 때와, 알 수 없는 주소(아래 [...rest])에서 보인다.
// (main) 레이아웃 안쪽이라 헤더가 함께 보인다.
export default function MainNotFound() {
   return <NotFoundScreen />;
}
