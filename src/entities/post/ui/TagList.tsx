import type { TagHighlight } from '../types';

const MAX_VISIBLE_TAGS = 3;

function normalize(value: string): string {
   return value.normalize('NFC').trim().toLowerCase();
}

function isHighlighted(tag: string, highlight?: TagHighlight): boolean {
   if (!highlight) return false;
   const a = normalize(tag);
   const b = normalize(highlight.value);
   return highlight.exact ? a === b : a.includes(b);
}

interface TagListProps {
   tags: string[];
   // 검색에 일치한 태그는 맨 앞으로 옮겨 굵은 주황색으로 보여 준다. (줄여서 숨겨지는 태그도 일치하면 앞에 보인다.)
   highlight?: TagHighlight;
   // 태그를 누르면 그 태그로 검색하게 한다. 없으면 글자로만 보여 준다.
   onTagClick?: (tag: string) => void;
}

// 태그 목록. 3개까지 보여 주고 나머지는 +N으로 줄인다. 태그가 없어도 한 줄 높이를 비워 두어 카드 높이가 맞는다.
export function TagList({ tags, highlight, onTagClick }: TagListProps) {
   const ordered = [
      ...tags.filter((tag) => isHighlighted(tag, highlight)),
      ...tags.filter((tag) => !isHighlighted(tag, highlight)),
   ];
   const visible = ordered.slice(0, MAX_VISIBLE_TAGS);
   const hiddenCount = ordered.length - visible.length;

   return (
      <ul className="flex min-h-5 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
         {visible.map((tag) => {
            const emphasized = isHighlighted(tag, highlight);
            const className = emphasized ? 'font-bold text-brand-orange' : 'text-black/40';
            return (
               <li key={tag}>
                  {onTagClick ? (
                     // 카드 전체를 덮는 링크보다 위에 놓여야 눌린다. (relative z-10)
                     <button
                        type="button"
                        aria-label={`#${tag} 태그로 검색`}
                        onClick={() => onTagClick(tag)}
                        className={`relative z-10 cursor-pointer hover:underline ${className}`}
                     >
                        #{tag}
                     </button>
                  ) : (
                     <span className={className}>#{tag}</span>
                  )}
               </li>
            );
         })}
         {hiddenCount > 0 && (
            <li className="text-black/30">
               <span aria-hidden>+{hiddenCount}</span>
               <span className="sr-only">외 태그 {hiddenCount}개</span>
            </li>
         )}
      </ul>
   );
}
