'use client';

import { X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { BLOCK_LIMITS } from '@/entities/block';
import { Button } from '@/shared/ui/Button';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { Input } from '@/shared/ui/Input';
import { FieldLabel } from './fields';

interface BadgesFieldProps {
   id: string;
   badges: string[] | undefined;
   onChange: (badges: string[] | undefined) => void;
}

// 히어로의 강조 특징(뱃지). 최대 3개, 각 12자까지 직접 입력하고, 칩의 ✕로 지운다. 같은 글은 두 번 넣을 수 없다.
export function BadgesField({ id, badges = [], onChange }: BadgesFieldProps) {
   const [adding, setAdding] = useState(false);
   const [draft, setDraft] = useState('');
   const [error, setError] = useState<string | null>(null);
   const full = badges.length >= BLOCK_LIMITS.heroBadgeCount;

   const submit = (event: FormEvent) => {
      event.preventDefault();
      const text = draft.trim();
      if (text === '') return;
      if (badges.some((badge) => badge.toLowerCase() === text.toLowerCase())) {
         setError('이미 있는 특징이에요.');
         return;
      }
      onChange([...badges, text]);
      setDraft('');
      setError(null);
      setAdding(false);
   };

   const remove = (text: string) => {
      const next = badges.filter((badge) => badge !== text);
      onChange(next.length > 0 ? next : undefined);
   };

   return (
      <div>
         <FieldLabel htmlFor={`${id}-input`} label="강조 특징" optional />
         <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
               <span
                  key={badge}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-brand-line bg-white pr-2 pl-3.5 text-xs text-brand-brown"
               >
                  {badge}
                  <button
                     type="button"
                     aria-label={`${badge} 삭제`}
                     onClick={() => remove(badge)}
                     className="flex size-5 cursor-pointer items-center justify-center rounded-full text-[#A6A09B] hover:bg-black/5 hover:text-black/70"
                  >
                     <X className="size-3.5" aria-hidden />
                  </button>
               </span>
            ))}
            {!full && (
               <button
                  type="button"
                  aria-expanded={adding}
                  onClick={() => {
                     setAdding((open) => !open);
                     setError(null);
                  }}
                  className="h-9 cursor-pointer rounded-full border border-dashed border-brand-line px-3.5 text-xs text-[#79716B] hover:border-brand-orange hover:text-brand-orange"
               >
                  + 추가
               </button>
            )}
         </div>

         {adding && !full && (
            <form onSubmit={submit} className="mt-2.5 flex gap-2">
               <Input
                  tone="brown"
                  id={`${id}-input`}
                  aria-label="강조 특징 입력"
                  placeholder="예: 주차 가능"
                  maxLength={BLOCK_LIMITS.heroBadge}
                  value={draft}
                  autoFocus
                  invalid={Boolean(error)}
                  className="px-4"
                  onChange={(event) => {
                     setDraft(event.target.value);
                     setError(null);
                  }}
               />
               <Button type="submit" size="field" disabled={draft.trim() === ''}>
                  추가
               </Button>
            </form>
         )}
         {error && <FieldMessage tone="error">{error}</FieldMessage>}
         <FieldMessage>
            최대 {BLOCK_LIMITS.heroBadgeCount}개, 첫 화면에 뱃지로 보여줘요. ({badges.length}/
            {BLOCK_LIMITS.heroBadgeCount})
         </FieldMessage>
      </div>
   );
}
