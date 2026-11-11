'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { POST_SORTS, type PostSort } from '@/entities/post';

const SORT_LABEL: Record<PostSort, string> = {
   popular: '인기순',
   latest: '최신순',
};

interface SortSelectProps {
   value: PostSort;
   disabled?: boolean;
   onChange: (sort: PostSort) => void;
}

// 정렬 선택 드롭다운. 목록 모양을 꾸미려고 기본 select 대신 직접 만들었다.
// 스크린 리더와 키보드가 기본 select처럼 쓰도록 콤보박스 + 리스트박스 패턴을 따른다.
// - 버튼에 포커스가 머문 채 화살표로 항목을 고르고(aria-activedescendant), Enter/Space로 선택한다.
// - Esc나 바깥 클릭, Tab으로 닫는다. (Esc는 닫고 포커스를 버튼에 둔다.)
export function SortSelect({ value, disabled = false, onChange }: SortSelectProps) {
   const rootRef = useRef<HTMLDivElement>(null);
   const listId = useId();
   const [open, setOpen] = useState(false);
   const [activeIndex, setActiveIndex] = useState(0);

   const selectedIndex = POST_SORTS.indexOf(value);

   useEffect(() => {
      if (!open) return;

      const closeOnOutsidePointer = (event: PointerEvent) => {
         if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
      };
      document.addEventListener('pointerdown', closeOnOutsidePointer);
      return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
   }, [open]);

   // 정렬이 비활성(글이 없음)으로 바뀌면 열려 있던 목록도 닫는다.
   const isOpen = open && !disabled;

   const openList = () => {
      setActiveIndex(selectedIndex);
      setOpen(true);
   };

   const choose = (index: number) => {
      const next = POST_SORTS[index];
      setOpen(false);
      if (next !== value) onChange(next);
   };

   const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      const last = POST_SORTS.length - 1;

      switch (event.key) {
         case 'ArrowDown':
         case 'ArrowUp': {
            event.preventDefault();
            if (!isOpen) {
               openList();
               return;
            }
            const step = event.key === 'ArrowDown' ? 1 : -1;
            setActiveIndex((index) => Math.min(last, Math.max(0, index + step)));
            return;
         }
         case 'Home':
         case 'End':
            if (!isOpen) return;
            event.preventDefault();
            setActiveIndex(event.key === 'Home' ? 0 : last);
            return;
         case 'Enter':
         case ' ':
            // 열려 있을 때는 버튼 기본 동작(토글)이 아니라 항목 선택으로 쓴다.
            if (!isOpen) return;
            event.preventDefault();
            choose(activeIndex);
            return;
         case 'Escape':
            if (!isOpen) return;
            event.preventDefault();
            setOpen(false);
            return;
         case 'Tab':
            setOpen(false);
            return;
      }
   };

   return (
      <div ref={rootRef} className="relative shrink-0">
         <button
            type="button"
            role="combobox"
            aria-label="정렬"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
            disabled={disabled}
            onClick={() => (isOpen ? setOpen(false) : openList())}
            onKeyDown={handleKeyDown}
            className={`flex h-10 min-w-28 cursor-pointer items-center justify-between gap-3 rounded-xl border bg-white pr-3 pl-4 text-sm text-brand-brown outline-none focus-visible:border-brand-orange disabled:cursor-not-allowed disabled:bg-field-disabled disabled:text-black/30 ${
               isOpen ? 'border-brand-orange' : 'border-brand-line'
            }`}
         >
            {SORT_LABEL[value]}
            <ChevronDown
               aria-hidden
               className={`size-4 shrink-0 text-black/50 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
         </button>

         {isOpen && (
            <ul
               id={listId}
               role="listbox"
               aria-label="정렬 방식"
               className="absolute top-full left-0 z-20 mt-1 min-w-full overflow-hidden rounded-xl border border-brand-line bg-white py-1 shadow-card"
            >
               {POST_SORTS.map((sort, index) => {
                  const selected = sort === value;
                  return (
                     <li
                        key={sort}
                        id={`${listId}-${index}`}
                        role="option"
                        aria-selected={selected}
                        // 마우스를 누를 때 버튼의 포커스가 사라지지 않게 한다.
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => choose(index)}
                        className={`cursor-pointer px-4 py-2.5 text-sm whitespace-nowrap ${
                           index === activeIndex ? 'bg-brand-orange-light/60' : ''
                        } ${selected ? 'font-bold text-brand-brown' : 'text-black/50'}`}
                     >
                        {SORT_LABEL[sort]}
                     </li>
                  );
               })}
            </ul>
         )}
      </div>
   );
}
