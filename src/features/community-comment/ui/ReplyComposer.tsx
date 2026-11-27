'use client';

import { Lock } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { COMMENT_MAX_LENGTH, createReply } from '@/entities/post';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import type { ComposerTarget } from '../model/commentUi';
import { useCommentSubmit } from '../model/useCommentSubmit';

interface ReplyComposerProps {
   postId: string;
   target: ComposerTarget;
   // 스레드의 최상위 댓글이 비공개인지. 비공개 댓글의 답글은 비공개로만 등록한다.
   rootPrivate: boolean;
   // 등록 뒤 화면을 갱신하는 일(답글 불러오기 등). 끝날 때까지 입력창은 "등록 중"으로 남는다.
   onSubmitted: () => Promise<void>;
   onCancel: () => void;
}

// 스레드 맨 끝에 열리는 답글 입력창. 대댓글에 답해도 스레드의 최상위 댓글에 붙는다. (서버에 멘션 기능이 없다.)
// - 비공개 댓글의 답글: 비공개 체크가 고정되고 안내가 나온다. (서버 규칙이 아니라, 비공개 대화가 공개로 새지 않게 화면에서 고정한다.)
// Enter는 등록, Shift+Enter는 줄바꿈, Esc는 닫기이다.
export function ReplyComposer({
   postId,
   target,
   rootPrivate,
   onSubmitted,
   onCancel,
}: ReplyComposerProps) {
   const [content, setContent] = useState('');
   const [isPrivateChecked, setIsPrivateChecked] = useState(false);
   const { submit, submitting, error, clearError } = useCommentSubmit();

   const isPrivate = rootPrivate || isPrivateChecked;
   const canSubmit = content.trim().length > 0 && !submitting;

   const handleSubmit = async () => {
      if (!canSubmit) return;
      // 등록 뒤 갱신까지 한 번에 맡겨서, 새 답글이 보이기 전에 입력창이 비거나 다시 눌리지 않게 한다.
      await submit(async () => {
         await createReply(postId, target.rootId, { content: content.trim(), isPrivate });
         await onSubmitted();
         return true;
      });
   };

   const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      // keyCode 229는 일부 브라우저(Safari)에서 한글 조합 중임을 알려 주는 값이다.
      const composing = event.nativeEvent.isComposing || event.keyCode === 229;
      // 등록 중에는 읽기 전용이라 입력은 막히지만, 키 동작(Esc 닫기 등)은 오므로 따로 막는다.
      if (composing || submitting) return;

      if (event.key === 'Enter' && !event.shiftKey) {
         event.preventDefault();
         void handleSubmit();
      } else if (event.key === 'Escape') {
         event.preventDefault();
         onCancel();
      }
   };

   return (
      <div className="mx-4 mt-2 mb-4 rounded-xl bg-field-readonly/60 p-3 sm:ml-12">
         <div className="flex flex-wrap items-center gap-2 rounded-lg border border-brand-line bg-white px-3 py-2 focus-within:border-brand-orange">
            <textarea
               autoFocus
               aria-label="답글 입력"
               rows={1}
               maxLength={COMMENT_MAX_LENGTH}
               placeholder="답글을 남겨보세요"
               value={content}
               // disabled로 막으면 포커스를 잃어 실패 뒤 바로 재시도할 수 없어서, 읽기 전용으로 막는다.
               readOnly={submitting}
               onChange={(event) => {
                  setContent(event.target.value);
                  clearError();
               }}
               onKeyDown={handleKeyDown}
               className="field-sizing-content max-h-28 min-h-6 min-w-32 flex-1 resize-none bg-transparent text-sm text-black outline-none placeholder:text-black/25"
            />
         </div>

         {error && (
            <FieldMessage tone="error" className="mt-2">
               {error}
            </FieldMessage>
         )}

         <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Checkbox
               checked={isPrivate}
               disabled={submitting || rootPrivate}
               onChange={(event) => setIsPrivateChecked(event.target.checked)}
            >
               <Lock aria-hidden className="size-3.5" />
               <span className="font-bold">비공개 댓글</span>
            </Checkbox>
            <span className="ml-auto text-xs text-black/40">
               {content.length}/{COMMENT_MAX_LENGTH}
            </span>
            <button
               type="button"
               disabled={submitting}
               onClick={onCancel}
               className="cursor-pointer text-xs text-black/50 hover:text-black disabled:cursor-not-allowed"
            >
               취소
            </button>
            <Button size="field" disabled={!canSubmit} onClick={handleSubmit}>
               {submitting ? '등록 중' : '등록'}
            </Button>
         </div>

         {rootPrivate && (
            <p className="mt-2 text-xs text-black/50">비공개 댓글의 답글은 비공개로 등록돼요</p>
         )}
         <p className="mt-2 text-xs leading-relaxed text-black/40">
            답글은 {COMMENT_MAX_LENGTH}자까지 입력할 수 있으며 등록 후 수정할 수 없어요.
         </p>
      </div>
   );
}
