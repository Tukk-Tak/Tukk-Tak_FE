import type { ListItem } from '../../types';
import { BlockImageFrame } from '../BlockImageFrame';
import { ItemPrice, ItemText } from './ItemText';

// 한 행에 썸네일, 이름과 설명, 오른쪽에 가격. 행 사이에만 구분선이 있다.
// 이미지가 없는 항목은 썸네일 자리 없이 글부터 시작한다.
export function RowList({ items }: { items: ListItem[] }) {
   return (
      <ul className="flex flex-col">
         {items.map((item) => {
            const price = item.price?.trim();
            return (
               <li
                  key={item.id}
                  className="flex items-center gap-4 border-b border-site-border py-4 first:pt-0 last:border-b-0 last:pb-0"
               >
                  {item.image && (
                     <BlockImageFrame
                        image={item.image}
                        alt={item.name}
                        className="size-16 shrink-0"
                     />
                  )}
                  <div className="min-w-0 flex-1">
                     <ItemText item={item} showPrice={false} />
                  </div>
                  {price && (
                     <div className="shrink-0 text-right">
                        <ItemPrice>{price}</ItemPrice>
                     </div>
                  )}
               </li>
            );
         })}
      </ul>
   );
}
