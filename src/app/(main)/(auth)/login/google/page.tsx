// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { GoogleLoginCallback } from '@/features/auth-login';

export const metadata: Metadata = {
   title: '로그인 | 뚝딱',
};

export default function GoogleLoginPage() {
   return <GoogleLoginCallback />;
}
