'use client';

import { Bookmark } from 'lucide-react';
import { useRef, useState } from 'react';
import { togglePostBookmark } from '@/entities/post';
import { useSession } from '@/entities/user/model/useSession';
import { isUnauthorizedError, toApiError } from '@/shared/lib/apiClient';
import { LoginRequiredModal } from '@/shared/ui/LoginRequiredModal';
import { useToast } from '@/shared/ui/toastContext';

interface BookmarkButtonProps {
   postId: string;
   // 서버가 내려준 처음 상태. 이후에는 이 버튼이 직접 들고 있는다. (글이 바뀌면 key로 새로 만든다.)
   initialBookmarked: boolean;
}

// 북마크 버튼. 좋아요 버튼과 같은 방식이다. 누르면 바로 바뀌고(낙관적 갱신), 서버 요청이 실패하면 되돌리고 서버 문구로 알려 준다.
// 서버는 토글로 처리해서 "원하는 상태"를 보낼 수 없고 결과(북마크했는지)만 돌려준다.
// 로그인하지 않았으면 눌렀을 때 로그인 안내를 띄운다. (북마크한 글은 마이페이지의 북마크 목록에서 모아 본다.)
export function BookmarkButton({ postId, initialBookmarked }: BookmarkButtonProps) {
   const session = useSession();
   const toast = useToast();
   const [bookmarked, setBookmarked] = useState(initialBookmarked);
   const [loginPrompt, setLoginPrompt] = useState(false);
   // 요청 중 연타를 막는 동기 가드. 토글이라서 연타가 겹치면 서버에서 북마크했다 취소되는 일이 생긴다.
   const busyRef = useRef(false);

   const toggle = async () => {
      // 세션을 확인하는 동안에는 로그인 여부를 모른다.
      if (session.status === 'loading') return;
      if (!session.user) {
         setLoginPrompt(true);
         return;
      }
      if (busyRef.current) return;

      busyRef.current = true;
      const before = bookmarked;
      const next = !bookmarked;
      setBookmarked(next);
      try {
         // 서버 결과가 예상과 다르면(다른 곳에서 이미 바꿔 둔 경우) 서버가 알려 준 상태에 맞춘다.
         setBookmarked(await togglePostBookmark(postId));
      } catch (error) {
         setBookmarked(before);
         // 로그인 시간이 지난 경우는 apiClient가 이미 안내했다. 그 밖에는 서버가 준 문구를 그대로 보여 준다.
         if (!isUnauthorizedError(error)) toast.show(toApiError(error).message, { tone: 'error' });
      } finally {
         busyRef.current = false;
      }
   };

   return (
      <>
         <button
            type="button"
            aria-pressed={bookmarked}
            onClick={toggle}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold hover:bg-black/5 ${
               bookmarked ? 'text-brand-orange' : 'text-black/60'
            }`}
         >
            <Bookmark aria-hidden className={`size-5 ${bookmarked ? 'fill-brand-orange' : ''}`} />
            북마크
         </button>

         {loginPrompt && <LoginRequiredModal onCancel={() => setLoginPrompt(false)} />}
      </>
   );
}
