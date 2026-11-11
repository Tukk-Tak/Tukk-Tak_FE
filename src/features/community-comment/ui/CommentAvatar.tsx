// 닉네임의 첫 글자를 담은 동그란 아바타. 장식이라 스크린 리더는 건너뛴다.
// TODO: 프로필 사진이 확정되면 사진으로 바꾼다.
export function CommentAvatar({ nickname, size }: { nickname: string; size: 'md' | 'sm' }) {
   return (
      <span
         aria-hidden
         className={`flex shrink-0 items-center justify-center rounded-full bg-brand-orange-light font-bold text-brand-orange ${
            size === 'md' ? 'size-8 text-xs' : 'size-7 text-[11px]'
         }`}
      >
         {nickname.charAt(0)}
      </span>
   );
}
