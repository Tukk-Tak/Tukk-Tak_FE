import { Image as ImageIcon } from 'lucide-react';

// 이미지가 없을 때 쓰는 색 블록. 글마다 같은 색이 나오도록 id로 고른다.
const PLACEHOLDER_TONES = ['bg-brand-orange-light', 'bg-field-readonly', 'bg-brand-line/40'];

function pickTone(id: string): string {
   let hash = 0;
   for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 997;
   return PLACEHOLDER_TONES[hash % PLACEHOLDER_TONES.length];
}

interface PostThumbnailProps {
   id: string;
   thumbnailUrl: string | null;
   // 크기와 모양은 호출하는 쪽이 정한다. (카드는 4:3 비율, 목록 행은 정사각형)
   className?: string;
}

// 글의 대표 이미지. 이미지가 없으면 색 블록과 아이콘으로 대신한다. (장식이라 스크린 리더는 건너뛴다.)
export function PostThumbnail({ id, thumbnailUrl, className = '' }: PostThumbnailProps) {
   if (thumbnailUrl) {
      return (
         // TODO: 백엔드 이미지 주소가 정해지면 next/image로 바꾼다. (images.remotePatterns 설정이 필요하다.)
         // eslint-disable-next-line @next/next/no-img-element
         <img src={thumbnailUrl} alt="" loading="lazy" className={`object-cover ${className}`} />
      );
   }

   return (
      <div
         aria-hidden
         className={`flex items-center justify-center text-black/25 ${pickTone(id)} ${className}`}
      >
         <ImageIcon className="size-1/4 max-h-10 max-w-10 min-h-5 min-w-5" strokeWidth={1.5} />
      </div>
   );
}
