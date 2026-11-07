import { useCallback, useEffect, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { createPost } from '../api/createPost';
import { usePhotoPicker } from './usePhotoPicker';

type SubmitResult = { ok: true; id: string } | { ok: false } | null;

// 글쓰기 폼의 입력 상태와 제출을 맡는다.
// 제목·사진·내용이 모두 채워져야 등록할 수 있고(태그는 선택), 등록 요청 중에는 입력을 잠근다.
export function useWritePost() {
   const [title, setTitle] = useState('');
   const [content, setContent] = useState('');
   const [tags, setTags] = useState<string[]>([]);
   const photo = usePhotoPicker();
   const [error, setError] = useState<string | null>(null);
   // 성공하면 페이지를 떠날 때까지 제출 중 상태를 유지한다. (같은 글이 한 번 더 등록되는 것을 막는다.)
   const [completed, setCompleted] = useState(false);
   const { run, pending } = useSingleFlight();

   const submitting = pending || completed;
   const photoFile = photo.file;
   const canSubmit =
      title.trim().length > 0 && content.trim().length > 0 && photoFile !== null && !submitting;
   // 쓰던 내용이 있는지. 취소나 페이지 이탈 때 확인하는 데 쓴다.
   const dirty = title !== '' || content !== '' || tags.length > 0 || photoFile !== null;

   // 새로고침이나 탭 닫기로 쓰던 글이 사라지지 않게 브라우저의 확인 창을 띄운다.
   // (헤더의 링크 등 앱 안의 이동은 막지 않는다.)
   useEffect(() => {
      if (!dirty || completed) return;

      const warn = (event: BeforeUnloadEvent) => {
         event.preventDefault();
         event.returnValue = '';
      };
      window.addEventListener('beforeunload', warn);
      return () => window.removeEventListener('beforeunload', warn);
   }, [dirty, completed]);

   const submit = useCallback(async (): Promise<SubmitResult> => {
      if (!canSubmit || photoFile === null) return null;

      setError(null);
      const result = await run<SubmitResult>(async () => {
         try {
            const { id } = await createPost({
               title: title.trim(),
               content: content.trim(),
               tags,
               photo: photoFile,
            });
            setCompleted(true);
            return { ok: true, id };
         } catch (caught) {
            setError(toApiError(caught).message);
            return { ok: false };
         }
      });
      return result ?? null;
   }, [canSubmit, photoFile, run, title, content, tags]);

   // 입력을 고치면 직전 등록 오류는 더 이상 현재 상태를 설명하지 않는다.
   const changeTitle = (value: string) => {
      setTitle(value);
      setError(null);
   };
   const changeContent = (value: string) => {
      setContent(value);
      setError(null);
   };
   const changeTags = (value: string[]) => {
      setTags(value);
      setError(null);
   };

   return {
      title,
      content,
      tags,
      photo,
      error,
      submitting,
      canSubmit,
      dirty,
      changeTitle,
      changeContent,
      changeTags,
      submit,
   };
}
