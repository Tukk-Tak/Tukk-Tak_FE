import type { ListItem } from '../../types';
import { BlockImageFrame } from '../BlockImageFrame';
import { ItemText } from './ItemText';

// 이미지 중심 카드. 블록 폭이 넓으면 4열, 반폭이나 모바일처럼 좁으면 2열이라 카드 크기가 크게 변하지 않는다.
// 이미지가 없는 항목은 이미지 칸 없이 글만 보인다.
export function CardList({ items }: { items: ListItem[] }) {
   return (
      <ul className="grid grid-cols-2 gap-4 @4xl:grid-cols-4">
         {items.map((item) => (
            <li
               key={item.id}
               className="flex flex-col gap-3 rounded-site border border-site-border bg-site-surface p-3"
            >
               {item.image && (
                  <BlockImageFrame
                     image={item.image}
                     alt={item.name}
                     className="aspect-[3/2] w-full"
                  />
               )}
               <ItemText item={item} />
            </li>
         ))}
      </ul>
   );
}
