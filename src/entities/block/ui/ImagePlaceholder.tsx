import { Image as ImageIcon } from 'lucide-react';

// 이미지가 비어 있거나 불러오지 못했을 때 프레임을 채우는 대체 화면. (장식이라 스크린 리더는 건너뛴다.)
// 서비스의 PostThumbnail과 같은 모양(색 블록 + 이미지 아이콘)이고, 색은 사이트 테마의 글자색을 옅게 써서 테마를 따른다.
export function ImagePlaceholder() {
   return (
      <div
         aria-hidden
         className="flex size-full items-center justify-center bg-site-text/5 text-site-text/25"
      >
         <ImageIcon className="size-1/4 max-h-10 max-w-10 min-h-5 min-w-5" strokeWidth={1.5} />
      </div>
   );
}
