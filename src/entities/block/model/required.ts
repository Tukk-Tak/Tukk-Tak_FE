import type { BlockType } from '../types';

// 배포할 때 반드시 채워져 있어야 하는 필드. 이 목록이 에디터의 "필수" 표시와 배포 점검의 기준이 되는 한 곳이다.
// 편집 중에는 비워 둬도 되고(저장도 가능), 비어 있거나 기본 문구 그대로이면 배포 점검에서 막는다.
// 키는 "블록 종류.필드" 형태이다.
export type RequiredFieldKey =
   'header.brandName' | 'hero.title' | 'text.body' | 'list.itemName' | 'footer.brandName';

const REQUIRED: ReadonlySet<string> = new Set<RequiredFieldKey>([
   'header.brandName',
   'hero.title',
   'text.body',
   'list.itemName',
   'footer.brandName',
]);

export function isRequiredField(type: BlockType, field: string): boolean {
   return REQUIRED.has(`${type}.${field}`);
}
