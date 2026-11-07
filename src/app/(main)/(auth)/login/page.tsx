// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { LoginForm, parseGoogleAuthError } from '@/features/auth-login';

export const metadata: Metadata = {
   title: '로그인 | 뚝딱',
};

export default async function LoginPage({
   searchParams,
}: {
   searchParams: Promise<{ google?: string }>;
}) {
   // 구글 인증이 실패해서 돌아온 경우(/login?google=unregistered 등)의 오류를 화면에 전달한다.
   const { google } = await searchParams;

   return <LoginForm googleError={parseGoogleAuthError(google)} />;
}
