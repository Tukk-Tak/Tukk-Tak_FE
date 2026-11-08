'use client';

import { Lock, Send } from 'lucide-react';
import { useRef, useState, type FocusEvent, type KeyboardEvent } from 'react';
import { COMMENT_MAX_LENGTH, createComment, type CommentView } from '@/entities/post';
import { Button } from '@/shared/ui/Button';
import { Checkbox } from '@/shared/ui/Checkbox';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { Textarea } from '@/shared/ui/Textarea';
import { useCommentSubmit } from '../model/useCommentSubmit';

interface CommentInputProps {
   postId: string;
   onCreated: (comment: CommentView) => void;
}

// 댓글 입력창. 평소에는 한 줄로 접혀 있고, 누르면 3줄 입력칸과 비공개 선택, 글자 수, 등록 버튼이 펼쳐진다.
// Enter는 등록, Shift+Enter는 줄바꿈이다. 한글을 입력하는 중(조합 중)의 Enter는 글자를 확정할 뿐이라 등록하지 않는다.
// 등록에 실패하면 입력한 내용을 그대로 두고 이유를 보여 준다.
export function CommentInput({ postId, onCreated }: CommentInputProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [expanded, setExpanded] = useState(false);
   const [content, setContent] = useState('');
   const [isPrivate, setIsPrivate] = useState(false);
   const { submit, submitting, error, clearError } = useCommentSubmit();

   const canSubmit = content.trim().length > 0 && !submitting;

   const handleSubmit = async () => {
      if (!canSubmit) return;
      const created = await submit(() =>
         createComment(postId, { content: content.trim(), isPrivate }),
      );
      if (!created) return;

      setContent('');
      setIsPrivate(false);
      setExpanded(false);
      onCreated(created);
   };

   const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      // keyCode 229는 일부 브라우저(Safari)에서 한글 조합 중임을 알려 주는 값이다.
      const composing = event.nativeEvent.isComposing || event.keyCode === 229;
      if (event.key === 'Enter' && !event.shiftKey && !composing) {
         event.preventDefault();
         void handleSubmit();
      }
   };

   // 입력창 밖으로 포커스가 나가면, 쓴 내용이 없을 때만 다시 한 줄로 접는다. (쓰던 내용은 지우지 않는다.)
   const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
      if (containerRef.current?.contains(event.relatedTarget)) return;
      if (content === '' && !submitting) setExpanded(false);
   };

   if (!expanded) {
      return (
         <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-brand-line bg-white px-4 text-sm text-black/40 hover:bg-brand-orange-light/30"
         >
            댓글을 남겨보세요
            <Send aria-hidden className="size-4" />
         </button>
      );
   }

   return (
      <div ref={containerRef} onBlur={handleBlur}>
         <Textarea
            autoFocus
            aria-label="댓글 입력"
            rows={3}
            maxLength={COMMENT_MAX_LENGTH}
            placeholder="댓글을 남겨보세요"
            value={content}
            // disabled로 막으면 포커스를 잃어 실패 뒤 바로 재시도할 수 없어서, 읽기 전용으로 막는다.
            readOnly={submitting}
            onChange={(event) => {
               setContent(event.target.value);
               clearError();
            }}
            onKeyDown={handleKeyDown}
            className="px-4 py-3"
         />

         <div className="mt-2 flex items-center justify-between">
            <Checkbox
               checked={isPrivate}
               disabled={submitting}
               onChange={(event) => setIsPrivate(event.target.checked)}
            >
               <Lock aria-hidden className="size-3.5" />
               <span className="font-bold">비공개 댓글</span>
            </Checkbox>
            <span className="text-xs text-black/40">
               {content.length}/{COMMENT_MAX_LENGTH}
            </span>
         </div>

         {error && (
            <FieldMessage tone="error" className="mt-2">
               {error}
            </FieldMessage>
         )}

         <div className="mt-2 flex items-start justify-between gap-3">
            <p className="text-xs leading-relaxed text-black/50">
               게시물 작성자와 참여자만 볼 수 있어요. 등록한 댓글은 수정할 수 없어요.
            </p>
            <Button size="field" disabled={!canSubmit} onClick={handleSubmit} className="shrink-0">
               {submitting ? '등록 중' : '등록'}
            </Button>
         </div>
      </div>
   );
}
