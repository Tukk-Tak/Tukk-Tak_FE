import type { ListItem } from '../../types';
import { BlockImageFrame } from '../BlockImageFrame';
import { ItemText } from './ItemText';

// 항목마다 이미지(가로 3 : 세로 2)가 왼쪽, 오른쪽으로 번갈아 놓이고 이미지와 글은 1:1이다.
// 블록 폭이 좁으면(모바일) 번갈아 놓지 않고 모든 항목이 이미지 위, 글 아래로 쌓인다.
// 이미지가 없는 항목은 글만 전체 폭으로 보인다.
export function ZigzagList({ items }: { items: ListItem[] }) {
   return (
      <ul className="flex flex-col gap-8">
         {items.map((item, index) => (
            <li
               key={item.id}
               className={item.image ? 'grid items-center gap-4 @2xl:grid-cols-2 @2xl:gap-8' : ''}
            >
               {item.image && (
                  <BlockImageFrame
                     image={item.image}
                     alt={item.name}
                     className={`aspect-[3/2] w-full ${index % 2 === 1 ? '@2xl:order-2' : ''}`}
                  />
               )}
               <ItemText item={item} />
            </li>
         ))}
      </ul>
   );
}
