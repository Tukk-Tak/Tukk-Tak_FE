import type { ListItem } from '../../types';

// 항목의 이름, 설명, 가격 글자. 값이 없는 줄은 보이지 않는다.
// 행형처럼 가격을 따로 놓는 variant는 showPrice를 끄고 가격을 직접 그린다.
export function ItemText({ item, showPrice = true }: { item: ListItem; showPrice?: boolean }) {
   const description = item.description?.trim();
   const price = item.price?.trim();

   return (
      <div className="flex min-w-0 flex-col gap-1">
         <p className="font-bold text-site-text">{item.name}</p>
         {/* 줄바꿈은 입력한 그대로 보여 준다. */}
         {description && (
            <p className="text-sm whitespace-pre-line text-site-text-muted">{description}</p>
         )}
         {showPrice && price && <ItemPrice>{price}</ItemPrice>}
      </div>
   );
}

// 가격은 "4,000원", "시가"처럼 입력한 문자열 그대로 보여 준다.
export function ItemPrice({ children }: { children: string }) {
   return <p className="text-sm font-medium text-site-text">{children}</p>;
}
