import type { CommunityView } from '@/features/community-search';

const SKELETON_COUNT = 6;

// 글 목록을 불러오는 동안 보이는 자리 표시. 카드형/목록형 모양을 그대로 따라 그려서 불러온 뒤 화면이 덜 흔들린다.
export function PostListSkeleton({ view }: { view: CommunityView }) {
   const items = Array.from({ length: SKELETON_COUNT }, (_, index) => index);

   return (
      <div role="status">
         <span className="sr-only">글 목록을 불러오는 중이에요</span>
         {view === 'card' ? (
            <ul aria-hidden className="grid animate-pulse gap-5 sm:grid-cols-2 lg:grid-cols-3">
               {items.map((item) => (
                  <li
                     key={item}
                     className="overflow-hidden rounded-2xl border border-brand-line bg-white"
                  >
                     <div className="aspect-4/3 bg-field-readonly" />
                     <div className="space-y-3 p-4">
                        <div className="h-4 w-4/5 rounded bg-field-readonly" />
                        <div className="h-3 w-1/3 rounded bg-field-readonly" />
                        <div className="h-3 w-1/2 rounded bg-field-readonly" />
                     </div>
                  </li>
               ))}
            </ul>
         ) : (
            <ul
               aria-hidden
               className="animate-pulse divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line bg-white"
            >
               {items.map((item) => (
                  <li key={item} className="flex items-center gap-4 px-4 py-3">
                     <div className="size-16 shrink-0 rounded-lg bg-field-readonly sm:size-20" />
                     <div className="flex-1 space-y-3">
                        <div className="h-4 w-3/5 rounded bg-field-readonly" />
                        <div className="h-3 w-1/4 rounded bg-field-readonly" />
                     </div>
                  </li>
               ))}
            </ul>
         )}
      </div>
   );
}
