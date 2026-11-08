import { BlockRenderer } from '@/entities/block';
import { themeToCssVars, type SiteContent } from '@/entities/site';

// 테마 변수는 래퍼에 주입해서 이 안에서만 적용한다. (한 화면에 여러 사이트가 있어도 서로 섞이지 않는다)
// 배치는 화면이 아니라 래퍼 너비 기준(컨테이너 쿼리)이라 에디터 캔버스 안에서도 같게 동작한다.
// 컨테이너(@container)가 안쪽 여백의 영향을 받지 않도록 여백은 한 단계 안쪽 div에 둔다.
// 여백과 간격: PC(@3xl 이상) 좌우 56px, 위아래 64px, 줄 사이 64px, 나란히 놓인 블록 사이 32px
//             모바일 좌우 24px, 위아래 40px, 줄 사이 40px
// break-keep: 한글이 단어(띄어쓰기) 단위로 줄바뀜되게 한다. 띄어쓰기 없는 긴 글자는 wrap-anywhere로 넘치지 않게 자른다.
export function SiteRenderer({ site }: { site: SiteContent }) {
   return (
      <div
         style={themeToCssVars(site.theme)}
         className="bg-site-bg text-site-text wrap-anywhere break-keep @container"
      >
         <div className="flex flex-col gap-10 px-6 py-10 @3xl:gap-16 @3xl:px-14 @3xl:py-16">
            {site.rows.map((row) => (
               <div key={row.id} className="flex flex-col gap-10 @3xl:flex-row @3xl:gap-8">
                  {row.sections.map((section) => (
                     <div key={section.id} className="min-w-0 flex-1 @container">
                        <BlockRenderer section={section} />
                     </div>
                  ))}
               </div>
            ))}
         </div>
      </div>
   );
}
