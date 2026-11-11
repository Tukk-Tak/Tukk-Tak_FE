'use client';

import { X } from 'lucide-react';
import {
   useId,
   useRef,
   useState,
   type ChangeEvent,
   type ClipboardEvent,
   type KeyboardEvent,
} from 'react';
import {
   addTagTokens,
   hasInvalidTypingChars,
   normalizeTag,
   splitTags,
   TAG_SEPARATOR,
   type TagError,
} from '../lib/tagRules';

interface TagInputProps {
   id: string;
   label: string;
   // 라벨 옆에 작게 붙는 글. 예: '(선택)'
   labelSuffix?: string;
   tags: string[];
   onChange: (tags: string[]) => void;
   maxTags: number;
   // 태그 하나의 최대 글자 수
   maxLength: number;
   placeholder?: string;
   disabled?: boolean;
}

// 태그를 칩으로 입력하는 컴포넌트.
// - 스페이스·쉼표·엔터로 입력 중인 글자가 칩이 되고, 앞의 #은 자동으로 지운다.
// - 붙여넣으면 공백·쉼표·줄바꿈 기준으로 나뉘어 한꺼번에 칩이 된다.
// - 입력이 비어 있을 때 백스페이스를 누르면 마지막 칩이 입력창으로 돌아와 고칠 수 있다.
// - 개수, 글자 수, 문자(한글·영문·숫자), 중복 규칙은 tagRules에서 검사한다.
export function TagInput({
   id,
   label,
   labelSuffix,
   tags,
   onChange,
   maxTags,
   maxLength,
   placeholder = '태그를 입력하고 스페이스나 엔터를 눌러주세요',
   disabled = false,
}: TagInputProps) {
   const inputRef = useRef<HTMLInputElement>(null);
   const messageId = useId();
   const [draft, setDraft] = useState('');
   // 입력 시도에서 막힌 이유. 다음 입력을 하면 지워진다.
   const [error, setError] = useState<TagError | null>(null);

   const limits = { maxTags, maxLength };
   const atMax = tags.length >= maxTags;

   // 입력 도중의 허용되지 않는 문자(예: 마포!)는 칩으로 확정하기 전에도 바로 알려 준다.
   const shownError: TagError | null =
      error ?? (hasInvalidTypingChars(draft) ? 'INVALID_CHARS' : null);

   const MESSAGE: Record<TagError, string> = {
      DUPLICATE: '이미 추가한 태그예요',
      INVALID_CHARS: '한글, 영문, 숫자만 쓸 수 있어요',
      TOO_LONG: `태그는 ${maxLength}자까지 입력할 수 있어요 (${maxLength} / ${maxLength})`,
      MAX_COUNT: `태그는 최대 ${maxTags}개까지 추가할 수 있어요. 새로 넣으려면 하나를 지워주세요.`,
   };

   // 입력 중인 글자 하나를 칩으로 만든다. 규칙에 어긋나면 글자는 그대로 두고 이유만 알려 준다.
   const commitDraft = () => {
      if (!normalizeTag(draft)) {
         // '#'만 입력한 경우처럼 만들 태그가 없으면 입력만 비운다.
         if (draft) setDraft('');
         return;
      }
      const result = addTagTokens(tags, [draft], limits);
      if (result.rejected.length > 0) {
         setError(result.error);
         return;
      }
      onChange(result.tags);
      setDraft('');
      setError(null);
   };

   // 입력값이 바뀔 때마다 호출된다. 한글 조합 중에는 글자를 건드리지 않고(조합이 깨지므로), 조합이 끝난 뒤에 처리한다.
   const applyInput = (value: string, isPaste: boolean, isComposing: boolean) => {
      setError(null);
      // 앞쪽의 #과 공백은 입력되는 즉시 지운다.
      const text = value.replace(/^[#\s]+/, '');

      if (isComposing) {
         setDraft(text);
         return;
      }

      if (!isPaste && !TAG_SEPARATOR.test(text)) {
         // 구분자 없이 한 글자를 쓰는 중이면 글자 수만 제한한다.
         if (text.length > maxLength) {
            setDraft(text.slice(0, maxLength));
            setError('TOO_LONG');
         } else {
            setDraft(text);
         }
         return;
      }

      // 구분자가 들어왔다: 앞의 글자들은 칩으로 만들고, 구분자 뒤에 쓰던 글자는 입력창에 남긴다.
      // 붙여넣기는 마지막 글자까지 모두 칩으로 만든다.
      const tokens = splitTags(text);
      const endsWithSeparator = /[\s,]$/.test(text);
      const commitAll = isPaste || endsWithSeparator;
      const toCommit = commitAll ? tokens : tokens.slice(0, -1);
      const remainder = commitAll ? '' : (tokens[tokens.length - 1] ?? '');

      const result = addTagTokens(tags, toCommit, limits);
      if (result.tags.length !== tags.length) onChange(result.tags);
      setError(result.error);

      // 직접 타이핑하다 한 글자가 막힌 경우에는 고칠 수 있게 입력창에 남기고, 붙여넣기에서 막힌 것은 버린다.
      const keepRejected = !isPaste && toCommit.length === 1 && result.rejected.length === 1;
      setDraft(keepRejected ? normalizeTag(result.rejected[0]) : remainder);
   };

   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const native = event.nativeEvent as InputEvent;
      applyInput(event.target.value, native.inputType === 'insertFromPaste', native.isComposing);
   };

   // 한 줄 입력칸은 값에서 줄바꿈을 지워 버리므로, 붙여넣은 글은 이벤트에서 원문 그대로 읽어 처리한다.
   // (줄바꿈으로 나뉜 태그 목록도 칩으로 나뉘게 하려는 것이다.)
   const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      const pasted = event.clipboardData.getData('text');
      if (!pasted) return;

      event.preventDefault();
      if (atMax) {
         setError('MAX_COUNT');
         return;
      }
      const input = event.currentTarget;
      const start = input.selectionStart ?? draft.length;
      const end = input.selectionEnd ?? start;
      applyInput(draft.slice(0, start) + pasted + draft.slice(end), true, false);
   };

   const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      // keyCode 229는 일부 브라우저(Safari)에서 한글 조합 중임을 알려 주는 값이다.
      const composing = event.nativeEvent.isComposing || event.keyCode === 229;

      if (event.key === 'Enter') {
         // 태그를 입력하다 누른 엔터로 글이 등록되면 안 된다.
         event.preventDefault();
         if (!composing) commitDraft();
         return;
      }

      if (event.key === 'Backspace' && !composing && draft === '' && tags.length > 0) {
         // 마지막 칩을 입력창으로 되돌려 바로 고칠 수 있게 한다.
         event.preventDefault();
         const last = tags[tags.length - 1];
         onChange(tags.slice(0, -1));
         setDraft(last);
         setError(null);
      }
   };

   const removeTag = (index: number) => {
      onChange(tags.filter((_, position) => position !== index));
      setError(null);
      inputRef.current?.focus();
   };

   const invalid = shownError !== null && shownError !== 'MAX_COUNT';

   return (
      <div>
         <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor={id} className="text-xs font-bold text-black">
               {label}
               {labelSuffix && (
                  <span className="ml-1 font-normal text-black/50">{labelSuffix}</span>
               )}
            </label>
            <span className={`text-xs font-bold ${atMax ? 'text-brand-orange' : 'text-black/50'}`}>
               {tags.length} / {maxTags}
            </span>
         </div>

         {/* 칸의 빈 곳을 눌러도 입력창에 포커스가 가게 한다. */}
         <div
            onClick={() => inputRef.current?.focus()}
            className={`flex min-h-12 cursor-text flex-wrap items-center gap-2 rounded-xl border bg-white px-3 py-2 ${
               invalid ? 'border-state-error' : 'border-brand-line focus-within:border-brand-orange'
            } ${disabled ? 'bg-field-disabled' : ''}`}
         >
            {tags.length > 0 && (
               <ul aria-label="추가한 태그" className="contents">
                  {tags.map((tag, index) => (
                     <li
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-brand-orange-light py-1 pr-1.5 pl-3 text-xs font-bold text-brand-brown"
                     >
                        #{tag}
                        <button
                           type="button"
                           aria-label={`#${tag} 태그 삭제`}
                           disabled={disabled}
                           onClick={(event) => {
                              event.stopPropagation();
                              removeTag(index);
                           }}
                           className="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-black/10 disabled:cursor-not-allowed"
                        >
                           <X aria-hidden className="size-3.5" />
                        </button>
                     </li>
                  ))}
               </ul>
            )}
            <input
               ref={inputRef}
               id={id}
               type="text"
               autoComplete="off"
               // 최대 개수에 닿으면 더 입력하지 못하게 한다. (백스페이스로 칩을 지우는 것은 그대로 된다.)
               readOnly={atMax}
               disabled={disabled}
               value={draft}
               placeholder={tags.length === 0 ? placeholder : undefined}
               aria-invalid={invalid || undefined}
               aria-describedby={messageId}
               onChange={handleChange}
               onCompositionEnd={(event) => applyInput(event.currentTarget.value, false, false)}
               onKeyDown={handleKeyDown}
               onPaste={handlePaste}
               onBlur={commitDraft}
               className="min-w-24 flex-1 bg-transparent px-2 py-1 text-sm text-black outline-none placeholder:text-black/25"
            />
         </div>

         {shownError ? (
            <p
               id={messageId}
               role="alert"
               className={`mt-1.5 text-xs ${shownError === 'MAX_COUNT' ? 'text-black/50' : 'text-state-error'}`}
            >
               {MESSAGE[shownError]}
            </p>
         ) : (
            <p id={messageId} className="mt-1.5 text-xs text-black/50">
               {atMax
                  ? MESSAGE.MAX_COUNT
                  : `스페이스나 엔터를 누르면 태그가 추가돼요. 띄어쓰기 없이 ${maxLength}자까지 쓸 수 있어요.`}
            </p>
         )}
      </div>
   );
}
