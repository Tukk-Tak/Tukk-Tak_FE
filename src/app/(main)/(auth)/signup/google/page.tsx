// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import type { Metadata } from 'next';
import { GoogleSignupForm } from '@/features/auth-signup';

export const metadata: Metadata = {
   title: '회원가입 | 뚝딱',
};

export default function GoogleSignupPage() {
   return <GoogleSignupForm />;
}
