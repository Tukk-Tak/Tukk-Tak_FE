import { BlockRenderer } from '@/entities/block';
import { themeToCssVars, type SiteContent } from '@/entities/site';

// 테마 변수는 래퍼에 주입해서 이 안에서만 적용한다. (한 화면에 여러 사이트가 있어도 서로 섞이지 않는다)
// 배치는 화면이 아니라 래퍼 너비 기준(컨테이너 쿼리)이라 에디터 캔버스 안에서도 같게 동작한다.
export function SiteRenderer({ site }: { site: SiteContent }) {
   return (
      <div style={themeToCssVars(site.theme)} className="bg-site-bg text-site-text @container">
         {site.rows.map((row) => (
            <div key={row.id} className="flex flex-col @3xl:flex-row">
               {row.sections.map((section) => (
                  <div key={section.id} className="min-w-0 flex-1 @container">
                     <BlockRenderer section={section} />
                  </div>
               ))}
            </div>
         ))}
      </div>
   );
}
