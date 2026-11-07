'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useMemberOnly } from '@/entities/user/model/useMemberOnly';
import { Button } from '@/shared/ui/Button';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { FieldMessage } from '@/shared/ui/FieldMessage';
import { FormField } from '@/shared/ui/FormField';
import { Input } from '@/shared/ui/Input';
import { TagInput } from '@/shared/ui/TagInput';
import { Textarea } from '@/shared/ui/Textarea';
import { useToast } from '@/shared/ui/toastContext';
import { useWritePost } from '../model/useWritePost';
import {
   CONTENT_MAX_LENGTH,
   TAG_MAX_COUNT,
   TAG_MAX_LENGTH,
   TITLE_MAX_LENGTH,
} from '../model/validation';
import { PhotoField } from './PhotoField';

// 등록을 마치거나 취소하면 돌아가는 곳.
// TODO: 글 상세 페이지(/community/[postId])가 만들어지면, 등록 후에는 방금 쓴 글의 상세로 이동하도록 바꾼다.
const COMMUNITY_PATH = '/community';

function Counter({ length, max }: { length: number; max: number }) {
   return (
      <p className="mt-1.5 text-right text-xs text-black/40">
         {length}/{max}
      </p>
   );
}

// 커뮤니티 글쓰기 폼. 로그인한 사용자만 볼 수 있다.
export function WritePostForm() {
   const router = useRouter();
   const toast = useToast();
   const { allowed } = useMemberOnly();
   const post = useWritePost();
   const [confirmingCancel, setConfirmingCancel] = useState(false);

   // 비로그인 사용자에게는 세션을 확인하는 동안과 로그인으로 이동하는 동안 폼을 보여 주지 않는다.
   if (!allowed) return null;

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const result = await post.submit();
      if (!result?.ok) return;

      toast.show('글을 등록했어요', { tone: 'success' });
      router.push(COMMUNITY_PATH);
   };

   // 쓰던 내용이 있으면 한 번 더 확인하고, 없으면 바로 나간다.
   const handleCancel = () => {
      if (post.dirty) setConfirmingCancel(true);
      else router.push(COMMUNITY_PATH);
   };

   return (
      <>
         <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-brand-line bg-white p-6 sm:p-9"
         >
            <h1 className="text-2xl font-bold text-black">우리 가게 소개하기</h1>
            <p className="mt-2 text-xs text-black/50">사장님들과 가게 이야기를 나눠보세요.</p>

            <div className="mt-8 space-y-6">
               <FormField label="제목" htmlFor="post-title" required>
                  <Input
                     id="post-title"
                     maxLength={TITLE_MAX_LENGTH}
                     autoComplete="off"
                     value={post.title}
                     disabled={post.submitting}
                     onChange={(event) => post.changeTitle(event.target.value)}
                     className="h-12"
                  />
                  <Counter length={post.title.length} max={TITLE_MAX_LENGTH} />
               </FormField>

               <PhotoField photo={post.photo} disabled={post.submitting} />

               <FormField label="내용" htmlFor="post-content" required>
                  <Textarea
                     id="post-content"
                     rows={10}
                     maxLength={CONTENT_MAX_LENGTH}
                     value={post.content}
                     disabled={post.submitting}
                     onChange={(event) => post.changeContent(event.target.value)}
                  />
                  <Counter length={post.content.length} max={CONTENT_MAX_LENGTH} />
               </FormField>

               <TagInput
                  id="post-tags"
                  label="태그"
                  labelSuffix="(선택)"
                  tags={post.tags}
                  onChange={post.changeTags}
                  maxTags={TAG_MAX_COUNT}
                  maxLength={TAG_MAX_LENGTH}
                  disabled={post.submitting}
               />
            </div>

            <p className="mt-6 rounded-lg bg-field-readonly px-4 py-3.5 text-xs text-black/60">
               등록한 글은 수정할 수 없어요. 삭제만 할 수 있으니 한 번 더 확인해주세요.
            </p>

            {post.error && (
               <FieldMessage tone="error" className="mt-4">
                  {post.error}
               </FieldMessage>
            )}

            <div className="mt-6 flex justify-end gap-3">
               <Button
                  variant="outline"
                  size="form"
                  disabled={post.submitting}
                  onClick={handleCancel}
               >
                  취소
               </Button>
               <Button type="submit" size="form" disabled={!post.canSubmit} className="min-w-34">
                  {post.submitting ? '등록 중' : '등록하기'}
               </Button>
            </div>
         </form>

         {confirmingCancel && (
            <ConfirmModal
               title="작성을 취소할까요?"
               description="지금 나가면 작성한 내용이 사라져요."
               confirmLabel="나가기"
               cancelLabel="계속 작성"
               onConfirm={() => router.push(COMMUNITY_PATH)}
               onCancel={() => setConfirmingCancel(false)}
            />
         )}
      </>
   );
}
