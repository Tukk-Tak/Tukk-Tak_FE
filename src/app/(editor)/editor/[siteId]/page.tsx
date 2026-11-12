// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.
import { getSite, getSiteTitle } from '@/entities/site';
import { getTemplate } from '@/entities/template';
import { EditorLayout } from '@/widgets/editor-layout';
import { SiteRenderer } from '@/widgets/site-renderer';

interface EditorPageProps {
   params: Promise<{ siteId: string }>;
   searchParams: Promise<{ mock?: string; template?: string }>;
}

// Next 15부터 params와 searchParams는 Promise라서 async 페이지로 만들고 await로 받는다.
export default async function EditorPage({ params, searchParams }: EditorPageProps) {
   const { siteId } = await params;
   const { mock, template: templateId } = await searchParams; // mock, template 전용. 실제 API 연동 때 없앤다.

   // TODO: 임시 연결이다. ?template= 이 있으면 그 템플릿의 내용으로 시작한다.
   // 사이트 생성 API가 생기면 서버가 템플릿으로 사이트를 만들어 주므로, 이 분기를 없애고 getSite만 쓴다.
   // 템플릿 원본은 모든 사용자가 같이 쓰는 값이라, 편집할 수 있도록 복사본을 쓴다.
   const template = getTemplate(templateId);
   const site = template ? structuredClone(template.content) : await getSite(siteId, mock);

   return (
      // TODO: 사이트 이름은 지금 헤더의 상호명에서 가져온다. 편집 중인 값을 따라가는 것과 별도 이름 필드 여부는 API 연동 때 정한다.
      <EditorLayout siteName={getSiteTitle(site)}>
         <SiteRenderer site={site} />
      </EditorLayout>
   );
}
