import { useCallback, useEffect, useRef, useState } from 'react';
import { validatePhoto, type PhotoErrorCode } from './validation';

export interface PhotoError {
   code: PhotoErrorCode;
   name: string;
   size: number;
}

interface PhotoState {
   file: File | null;
   previewUrl: string | null;
   error: PhotoError | null;
}

const EMPTY: PhotoState = { file: null, previewUrl: null, error: null };

// 사진 한 장을 고르고(선택·끌어놓기), 형식과 용량을 검사하고, 미리보기 주소를 관리한다.
// 올릴 수 없는 파일을 고르면 이전 사진은 비우고 오류 상태가 된다. (오류 화면과 등록 가능 여부가 어긋나지 않게)
export function usePhotoPicker() {
   const [state, setState] = useState<PhotoState>(EMPTY);
   const urlRef = useRef<string | null>(null);

   // 미리보기 주소는 메모리를 잡고 있으므로 바뀌거나 화면을 떠날 때 반드시 해제한다.
   const revoke = useCallback(() => {
      if (urlRef.current) {
         URL.revokeObjectURL(urlRef.current);
         urlRef.current = null;
      }
   }, []);

   useEffect(() => revoke, [revoke]);

   const select = useCallback(
      (file: File) => {
         revoke();
         const code = validatePhoto(file);
         if (code) {
            setState({
               file: null,
               previewUrl: null,
               error: { code, name: file.name, size: file.size },
            });
            return;
         }
         const previewUrl = URL.createObjectURL(file);
         urlRef.current = previewUrl;
         setState({ file, previewUrl, error: null });
      },
      [revoke],
   );

   const remove = useCallback(() => {
      revoke();
      setState(EMPTY);
   }, [revoke]);

   return { ...state, select, remove };
}
