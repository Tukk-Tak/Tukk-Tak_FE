import type { TextAlign, TextSection } from '../../types';
import { BlockImageFrame } from '../BlockImageFrame';

// align: 줄글의 글 정렬(왼쪽, 가운데, 오른쪽). 이미지 병행형에서는 글 쪽에만 적용된다.
// single: 제목과 본문만 보여 준다. (이미지 값은 보존하고 표시하지 않는다)
// withImage: 이미지(가로 3 : 세로 2)와 글을 1:1로 나란히 놓고, 블록 폭이 좁으면 이미지가 위, 글이 아래로 쌓인다.
//            이미지 프레임은 비율이 고정이라 블록 폭에 맞춰 크기만 변한다. 이미지가 비어 있으면 single과 같은 모양이 된다.
const ALIGN_CLASS: Record<TextAlign, string> = {
   left: 'text-left',
   center: 'text-center',
   right: 'text-right',
};

export function TextBlock({ section }: { section: TextSection }) {
   const { title, body, image, align = 'left' } = section.content;
   const hasTitle = Boolean(title?.trim());

   const text = (
      <div className={`flex flex-col gap-3 ${ALIGN_CLASS[align] ?? ALIGN_CLASS.left}`}>
         {hasTitle && <h2 className="text-2xl font-bold text-site-text">{title}</h2>}
         {/* 서식은 없고 줄바꿈만 그대로 보여 준다. */}
         <p className="leading-relaxed whitespace-pre-line text-site-text-muted">{body}</p>
      </div>
   );

   if (section.variant === 'withImage' && image) {
      return (
         <div className="grid items-center gap-8 @2xl:grid-cols-2">
            <BlockImageFrame image={image} alt={title ?? ''} className="aspect-[3/2] w-full" />
            {text}
         </div>
      );
   }

   return text;
}
