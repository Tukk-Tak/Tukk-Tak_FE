// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import { notFound } from 'next/navigation';

// 어떤 페이지와도 맞지 않는 주소는 모두 여기로 들어와서 404가 된다.
// Next는 알 수 없는 주소를 레이아웃 밖의 루트 not-found로 보내 헤더가 빠지는데,
// 이 라우트가 (main) 안에 있으면 (main) 레이아웃(헤더)을 거쳐 (main)/not-found.tsx 가 보인다. (상태 코드는 404 그대로이다.)
export default function UnknownRoutePage() {
   notFound();
}
