import type { ListItem } from '../../types';
import { ItemPrice } from './ItemText';

// 이름과 가격만 촘촘하게 보여 주는 타일. 설명과 이미지는 값만 보존하고 표시하지 않는다.
// 블록 폭이 넓으면 4열, 좁으면 2열이다.
export function CompactList({ items }: { items: ListItem[] }) {
   return (
      <ul className="grid grid-cols-2 gap-3 @4xl:grid-cols-4">
         {items.map((item) => {
            const price = item.price?.trim();
            return (
               <li
                  key={item.id}
                  className="flex flex-col gap-1 rounded-site border border-site-border bg-site-surface p-4"
               >
                  <p className="font-bold text-site-text">{item.name}</p>
                  {price && <ItemPrice>{price}</ItemPrice>}
               </li>
            );
         })}
      </ul>
   );
}
