import { isBlockPlaceholder } from '@/entities/block';
import { isTemplateSampleText } from '@/entities/template';

// 값이 아직 고치지 않은 기본 문구인지. 새 블록의 기본 문구와 템플릿의 샘플 문구를 함께 본다.
// 편집 화면의 "기본 문구" 표시에 쓰고, 배포 점검에서도 같은 판단을 쓴다.
export function isDefaultText(value: string | undefined): boolean {
   return isBlockPlaceholder(value) || isTemplateSampleText(value);
}
