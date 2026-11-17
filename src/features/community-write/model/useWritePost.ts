import { useCallback, useEffect, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { useSingleFlight } from '@/shared/lib/useSingleFlight';
import { createPost } from '../api/createPost';
import { usePhotoPicker } from './usePhotoPicker';

// id는 서버가 돌려준 새 글의 id이고, 서버가 아직 id를 주지 않으면 null이다.
type SubmitResult = { ok: true; id: string | null } | { ok: false } | null;

// 글쓰기 폼의 입력 상태와 제출을 맡는다.
// 제목·사진·내용이 모두 채워져야 등록할 수 있고(태그는 선택), 사진은 글과 함께 한 번에 보낸다.
// 등록 요청 중에는 입력을 잠그고 보내는 진행률을 알려 준다.
export function useWritePost() {
   const [title, setTitle] = useState('');
   const [content, setContent] = useState('');
   const [tags, setTags] = useState<string[]>([]);
   const photo = usePhotoPicker();
   const [error, setError] = useState<string | null>(null);
   // 글과 사진을 서버로 보내는 진행률(0~100). 보내기가 끝나도 서버가 처리를 마칠 때까지 100에서 멈춰 있다.
   const [progress, setProgress] = useState(0);
   // 성공하면 페이지를 떠날 때까지 제출 중 상태를 유지한다. (같은 글이 한 번 더 등록되는 것을 막는다.)
   const [completed, setCompleted] = useState(false);
   const { run, pending } = useSingleFlight();

   const submitting = pending || completed;
   const photoFile = photo.file;
   // 사진을 고르지 않았거나 올릴 수 없는 사진이면 등록할 수 없다.
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
      setProgress(0);
      const result = await run<SubmitResult>(async () => {
         try {
            const { id } = await createPost(
               { title: title.trim(), content: content.trim(), tags, image: photoFile },
               { onProgress: setProgress },
            );
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
      progress,
      canSubmit,
      dirty,
      changeTitle,
      changeContent,
      changeTags,
      submit,
   };
}
