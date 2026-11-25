'use client';

import { Heart } from 'lucide-react';
import { useRef, useState } from 'react';
import { togglePostLike } from '@/entities/post';
import { useSession } from '@/entities/user/model/useSession';
import { isUnauthorizedError, toApiError } from '@/shared/lib/apiClient';
import { formatCount } from '@/shared/lib/formatCount';
import { LoginRequiredModal } from '@/shared/ui/LoginRequiredModal';
import { useToast } from '@/shared/ui/toastContext';

interface LikeButtonProps {
   postId: string;
   // 서버가 내려준 처음 상태. 이후에는 이 버튼이 직접 들고 있는다. (글이 바뀌면 key로 새로 만든다.)
   initialLiked: boolean;
   initialCount: number;
   // 서버 결과가 화면 예상과 달라서 좋아요 개수가 서버와 어긋났을 가능성이 있을 때 불린다. (호출한 쪽이 상세를 다시 받는다.)
   onOutOfSync?: () => void;
}

// 좋아요 버튼. 누르면 바로 바뀌고(낙관적 갱신), 서버 요청이 실패하면 되돌리고 서버 문구로 알려 준다.
// 서버는 토글로 처리해서 "원하는 상태"를 보낼 수 없고 결과(눌렸는지)만 돌려준다. 개수는 돌려주지 않아서 이쪽에서 계산한다.
// 로그인하지 않았으면 눌렀을 때 로그인 안내를 띄운다.
export function LikeButton({ postId, initialLiked, initialCount, onOutOfSync }: LikeButtonProps) {
   const session = useSession();
   const toast = useToast();
   const [liked, setLiked] = useState(initialLiked);
   const [count, setCount] = useState(initialCount);
   const [loginPrompt, setLoginPrompt] = useState(false);
   // 요청 중 연타를 막는 동기 가드. (state는 비동기로 갱신되어 빠른 연타를 막지 못한다.)
   // 토글이라서 연타가 겹치면 서버에서 눌렀다 취소되는 일이 생기므로 꼭 막아야 한다.
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
      const before = { liked, count };
      const next = !liked;
      setLiked(next);
      setCount(Math.max(0, count + (next ? 1 : -1)));
      try {
         const nowLiked = await togglePostLike(postId);
         // 서버 결과가 예상과 다르면(다른 곳에서 이미 바꿔 둔 경우) 서버가 알려 준 상태에 맞춘다.
         // 이때 서버 상태는 누르기 전 화면과 같은 쪽이므로 개수도 일단 누르기 전 값으로 돌린다.
         // 다만 그 값은 누르기 전의 스냅샷이라 그 사이 다른 사용자가 바꾼 개수가 빠져 있을 수 있다.
         // 좋아요 응답에는 개수가 없으므로, 호출한 쪽이 상세를 다시 받아 서버의 개수로 맞추게 알린다.
         if (nowLiked !== next) {
            setLiked(nowLiked);
            setCount(before.count);
            onOutOfSync?.();
         }
      } catch (error) {
         setLiked(before.liked);
         setCount(before.count);
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
            aria-pressed={liked}
            onClick={toggle}
            className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold hover:bg-black/5 ${
               liked ? 'text-brand-orange' : 'text-black/60'
            }`}
         >
            <Heart aria-hidden className={`size-5 ${liked ? 'fill-brand-orange' : ''}`} />
            좋아요 {formatCount(count)}
         </button>

         {loginPrompt && <LoginRequiredModal onCancel={() => setLoginPrompt(false)} />}
      </>
   );
}
