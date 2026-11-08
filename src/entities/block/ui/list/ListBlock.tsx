import type { ListSection } from '../../types';
import { CardList } from './CardList';
import { CompactList } from './CompactList';
import { RowList } from './RowList';
import { ZigzagList } from './ZigzagList';

// 제목(선택)과 항목 목록. 항목이 없으면 제목만 보이고, 제목도 없으면 아무것도 그리지 않는다.
// variant마다 배치가 크게 달라 파일을 나눴다. (card, row, compact, zigzag)
export function ListBlock({ section }: { section: ListSection }) {
   const { title, items } = section.content;
   const hasTitle = Boolean(title?.trim());

   if (!hasTitle && items.length === 0) return null;

   return (
      <div className="flex flex-col gap-6">
         {hasTitle && <h2 className="text-2xl font-bold text-site-text">{title}</h2>}
         {items.length > 0 && <Items section={section} />}
      </div>
   );
}

function Items({ section }: { section: ListSection }) {
   const { items } = section.content;

   switch (section.variant) {
      case 'card':
         return <CardList items={items} />;
      case 'row':
         return <RowList items={items} />;
      case 'compact':
         return <CompactList items={items} />;
      case 'zigzag':
         return <ZigzagList items={items} />;
   }
}
