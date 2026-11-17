import type { SiteContent } from '@/entities/site';

// 템플릿 선택 화면에 보이는 템플릿 한 종류.
export type TemplateId = 'cozy' | 'menu' | 'photo' | 'blank';

export interface Template {
   id: TemplateId;
   name: string;
   description: string;
   // 이 템플릿으로 시작할 때 사이트에 채워지는 테마와 블록. 빈 템플릿은 블록이 하나도 없다.
   content: SiteContent;
}
