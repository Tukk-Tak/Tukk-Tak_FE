export type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

function range(from: number, to: number): number[] {
   return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

// 페이지 버튼에 보여 줄 항목을 계산한다. 페이지가 많으면 처음·끝·현재 주변만 보이고 나머지는 말줄임(…)으로 줄인다.
// 예) 현재 10 / 전체 20 → 1 … 9 10 11 … 20
// 버튼 개수가 페이지를 넘나들어도 같게(최대 siblings*2 + 5개) 유지해서 누를 때마다 위치가 흔들리지 않게 한다.
export function getPageItems(page: number, totalPages: number, siblings = 1): PageItem[] {
   const maxItems = siblings * 2 + 5;
   if (totalPages <= maxItems) return range(1, totalPages);

   const left = Math.max(page - siblings, 1);
   const right = Math.min(page + siblings, totalPages);
   const showStartEllipsis = left > 2;
   const showEndEllipsis = right < totalPages - 1;
   const edgeCount = siblings * 2 + 3;

   if (!showStartEllipsis && showEndEllipsis) {
      return [...range(1, edgeCount), 'ellipsis-end', totalPages];
   }
   if (showStartEllipsis && !showEndEllipsis) {
      return [1, 'ellipsis-start', ...range(totalPages - edgeCount + 1, totalPages)];
   }
   return [1, 'ellipsis-start', ...range(left, right), 'ellipsis-end', totalPages];
}
