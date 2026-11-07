'use client';

import { Search, X } from 'lucide-react';
import { useId, useRef, useState, type FormEvent } from 'react';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { Input } from '@/shared/ui/Input';
import { MAX_QUERY_LENGTH, normalizeQueryInput, parseQuery } from '../model/parseQuery';

interface SearchBarProps {
   // 지금 적용된 검색어(주소의 q). 뒤로 가기나 초기화로 바뀌면 입력창도 따라 바뀐다.
   value: string;
   onSearch: (query: string) => void;
}

// 검색창. Enter로 검색하고, 입력 중에는 목록을 바꾸지 않는다.
// 포커스가 있고 입력이 비어 있을 때 검색 방법을 안내한다.
export function SearchBar({ value, onSearch }: SearchBarProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const hintId = useId();
   const messageId = useId();
   const [draft, setDraft] = useState(value);
   const [appliedValue, setAppliedValue] = useState(value);
   const [focused, setFocused] = useState(false);
   const [error, setError] = useState<string | null>(null);

   // 적용된 검색어가 바깥에서 바뀌면(뒤로 가기, 초기화 등) 입력창을 맞춘다. (입력 도중의 포커스는 유지된다.)
   if (value !== appliedValue) {
      setAppliedValue(value);
      setDraft(value);
      setError(null);
   }

   const showHint = focused && draft.length === 0;

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const normalized = normalizeQueryInput(draft);

      // '#'만 입력한 경우처럼 찾을 말이 없는 검색은 하지 않고 안내한다. (빈 입력은 검색 해제이다.)
      if (normalized && parseQuery(normalized).kind === 'none') {
         setError('태그 이름을 함께 입력해주세요. 예: #맛집');
         return;
      }
      setError(null);
      setDraft(normalized);
      onSearch(normalized);
   };

   const handleClear = () => {
      setDraft('');
      setError(null);
      inputRef.current?.focus();
      // 이미 검색 중이었다면 검색을 해제한다.
      if (value) onSearch('');
   };

   return (
      <form role="search" onSubmit={handleSubmit} className="relative">
         <label htmlFor="community-search" className="sr-only">
            글 검색
         </label>
         <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-black/40"
         />
         <Input
            ref={inputRef}
            id="community-search"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            maxLength={MAX_QUERY_LENGTH}
            placeholder="제목, 닉네임, #태그로 검색"
            value={draft}
            invalid={Boolean(error)}
            aria-describedby={error ? messageId : showHint ? hintId : undefined}
            onChange={(event) => {
               setDraft(event.target.value);
               setError(null);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="pr-10 pl-11 [&::-webkit-search-cancel-button]:hidden"
         />
         {draft && (
            <button
               type="button"
               aria-label="검색어 지우기"
               onClick={handleClear}
               className="absolute top-1/2 right-3 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-black/50 hover:bg-black/5 hover:text-black"
            >
               <X className="size-4" />
            </button>
         )}

         {error && (
            <FieldMessage id={messageId} tone="error">
               {error}
            </FieldMessage>
         )}

         {/* 목록 위에 겹쳐 뜨는 안내. 입력을 시작하거나 포커스를 잃으면 사라진다. */}
         {showHint && (
            <div
               id={hintId}
               className="absolute top-full right-0 left-0 z-20 mt-1 rounded-xl border border-brand-line bg-white px-4 py-3 shadow-card"
            >
               <p className="text-xs font-bold text-black">제목, 닉네임, 태그에서 찾아요</p>
               <p className="mt-1 text-xs text-black/50">#를 붙이면 태그만 검색해요 · 예: #맛집</p>
            </div>
         )}
      </form>
   );
}
