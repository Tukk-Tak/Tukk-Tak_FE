import { useCallback, useEffect, useRef, useState } from 'react';
import { toApiError } from '@/shared/lib/apiClient';
import { uploadPhoto } from '../api/uploadPhoto';
import { validatePhoto, type PhotoErrorCode } from './validation';

export interface PhotoError {
   code: PhotoErrorCode;
   name: string;
   size: number;
}

// idle: 올리기 전 / uploading: 올리는 중(progress 0~100) / done: 올림(photoId) / failed: 올리지 못함(message)
export interface UploadState {
   status: 'idle' | 'uploading' | 'done' | 'failed';
   progress: number;
   photoId: string | null;
   message: string | null;
}

interface PhotoState {
   file: File | null;
   previewUrl: string | null;
   // 올릴 수 없는 파일(형식·용량)이라 고르자마자 거른 경우
   error: PhotoError | null;
   upload: UploadState;
}

const IDLE_UPLOAD: UploadState = { status: 'idle', progress: 0, photoId: null, message: null };
const EMPTY: PhotoState = { file: null, previewUrl: null, error: null, upload: IDLE_UPLOAD };

function isAbortError(error: unknown): boolean {
   return error instanceof DOMException && error.name === 'AbortError';
}

// 사진 한 장을 고르고(선택·끌어놓기), 형식과 용량을 검사하고, 통과하면 바로 올린다. 올리는 진행 상태와 미리보기 주소도 관리한다.
// - 올릴 수 없는 파일을 고르면 이전 사진은 비우고 오류 상태가 된다. (오류 화면과 등록 가능 여부가 어긋나지 않게)
// - 올리는 중에 사진을 바꾸거나 지우면 진행 중이던 업로드는 취소하고, 늦게 도착한 결과는 무시한다.
export function usePhotoPicker() {
   const [state, setState] = useState<PhotoState>(EMPTY);
   const urlRef = useRef<string | null>(null);
   const abortRef = useRef<AbortController | null>(null);
   // 업로드마다 올라가는 번호. 현재 번호와 다른 업로드의 진행률·결과는 버린다.
   const generationRef = useRef(0);

   // 미리보기 주소는 메모리를 잡고 있으므로 바뀌거나 화면을 떠날 때 반드시 해제한다.
   const revoke = useCallback(() => {
      if (urlRef.current) {
         URL.revokeObjectURL(urlRef.current);
         urlRef.current = null;
      }
   }, []);

   const cancelUpload = useCallback(() => {
      generationRef.current += 1;
      abortRef.current?.abort();
      abortRef.current = null;
   }, []);

   useEffect(
      () => () => {
         cancelUpload();
         revoke();
      },
      [cancelUpload, revoke],
   );

   const startUpload = useCallback(
      async (file: File) => {
         cancelUpload();
         const generation = generationRef.current;
         const controller = new AbortController();
         abortRef.current = controller;
         setState((prev) => ({ ...prev, upload: { ...IDLE_UPLOAD, status: 'uploading' } }));

         try {
            const { id } = await uploadPhoto(file, {
               signal: controller.signal,
               onProgress: (progress) => {
                  if (generationRef.current !== generation) return;
                  setState((prev) => ({ ...prev, upload: { ...prev.upload, progress } }));
               },
            });
            if (generationRef.current !== generation) return;
            setState((prev) => ({
               ...prev,
               upload: { status: 'done', progress: 100, photoId: id, message: null },
            }));
         } catch (error) {
            if (generationRef.current !== generation || isAbortError(error)) return;
            setState((prev) => ({
               ...prev,
               upload: {
                  status: 'failed',
                  progress: prev.upload.progress,
                  photoId: null,
                  message: toApiError(error).message,
               },
            }));
         }
      },
      [cancelUpload],
   );

   const select = useCallback(
      (file: File) => {
         revoke();
         cancelUpload();
         const code = validatePhoto(file);
         if (code) {
            setState({
               ...EMPTY,
               error: { code, name: file.name, size: file.size },
            });
            return;
         }
         const previewUrl = URL.createObjectURL(file);
         urlRef.current = previewUrl;
         setState({ ...EMPTY, file, previewUrl });
         void startUpload(file);
      },
      [revoke, cancelUpload, startUpload],
   );

   // 올리지 못한 사진을 같은 파일로 다시 올린다.
   const retry = useCallback(() => {
      if (state.file) void startUpload(state.file);
   }, [state.file, startUpload]);

   // 사진 삭제 또는 올리는 중 취소
   const remove = useCallback(() => {
      cancelUpload();
      revoke();
      setState(EMPTY);
   }, [cancelUpload, revoke]);

   return {
      ...state,
      uploading: state.upload.status === 'uploading',
      // 서버에 올라간 사진의 id. 올리기가 끝나야 값이 있다.
      photoId: state.upload.photoId,
      select,
      retry,
      remove,
   };
}
