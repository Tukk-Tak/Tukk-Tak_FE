import type { Section } from '../types';

// 아직 만들지 않은 블록 자리에 type과 variant를 표시한다. 블록이 하나씩 추가되면서 쓸 일이 줄어든다.
export function BlockPlaceholder({ section }: { section: Section }) {
   return (
      <div className="border-site-border text-site-text-muted flex min-h-24 items-center justify-center rounded-lg border border-dashed p-4 text-sm">
         {section.type} / {section.variant}
      </div>
   );
}
