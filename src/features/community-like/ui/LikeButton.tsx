'use client';

import { Heart } from 'lucide-react';
import { useRef, useState } from 'react';
import { setPostLike } from '@/entities/post';
import { useSession } from '@/entities/user/model/useSession';
import { formatCount } from '@/shared/lib/formatCount';
import { LoginRequiredModal } from '@/shared/ui/LoginRequiredModal';
import { useToast } from '@/shared/ui/toastContext';

interface LikeButtonProps {
   postId: string;
   // 서버가 내려준 처음 상태. 이후에는 이 버튼이 직접 들고 있는다. (글이 바뀌면 key로 새로 만든다.)
   initialLiked: boolean;
   initialCount: number;
}

// 좋아요 버튼. 누르면 바로 바뀌고(낙관적 갱신), 서버 요청이 실패하면 되돌리고 알려 준다.
// 로그인하지 않았으면 눌렀을 때 로그인 안내를 띄운다.
export function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
   const session = useSession();
   const toast = useToast();
   const [liked, setLiked] = useState(initialLiked);
   const [count, setCount] = useState(initialCount);
   const [loginPrompt, setLoginPrompt] = useState(false);
   // 요청 중 연타를 막는 동기 가드. (state는 비동기로 갱신되어 빠른 연타를 막지 못한다.)
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
      const next = !liked;
      setLiked(next);
      setCount((value) => value + (next ? 1 : -1));
      try {
         const result = await setPostLike(postId, next);
         setLiked(result.liked);
         setCount(result.likeCount);
      } catch {
         setLiked(!next);
         setCount((value) => value + (next ? -1 : 1));
         toast.show('좋아요를 반영하지 못했어요. 잠시 후 다시 시도해주세요', { tone: 'error' });
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
