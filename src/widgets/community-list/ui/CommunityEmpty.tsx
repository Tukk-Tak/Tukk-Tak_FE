import { MessageCircle, Search } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';

// none: 올라온 글이 하나도 없음 / text: 글자 검색 결과 없음 / tag: 태그 검색 결과 없음
export type EmptyKind = 'none' | 'text' | 'tag';

interface CommunityEmptyProps {
   kind: EmptyKind;
   // 검색 중이던 글자 또는 태그 이름(# 없이)
   keyword: string;
   // 로그인한 사용자에게만 "글쓰기"를 보여 준다.
   canWrite: boolean;
   onReset: () => void;
}

// 보여 줄 글이 없을 때의 안내. 상황마다 문구와 이어서 할 수 있는 행동이 다르다.
export function CommunityEmpty({ kind, keyword, canWrite, onReset }: CommunityEmptyProps) {
   const Icon = kind === 'none' ? MessageCircle : Search;

   let title = '아직 올라온 글이 없어요';
   let description = '첫 번째 사장님이 되어보세요.';
   if (kind === 'text') {
      title = `'${keyword}'에 대한 결과가 없어요`;
      description = '검색어를 줄이거나 철자를 확인해보세요. 태그로 찾으려면 #를 붙여보세요.';
   } else if (kind === 'tag') {
      title = `'#${keyword}' 태그의 글이 아직 없어요`;
      // 글을 쓸 수 없는 방문자에게 "남겨보세요"라고 권하지 않는다.
      description = canWrite
         ? '첫 번째로 이 태그로 글을 남겨보세요.'
         : '다른 태그나 검색어로 찾아보세요.';
   }

   const showWrite = canWrite && kind !== 'text';
   const showReset = kind !== 'none';

   return (
      <div className="flex flex-col items-center px-4 py-16 text-center md:py-24">
         <div
            aria-hidden
            className="flex size-16 items-center justify-center rounded-full bg-field-readonly text-black/40"
         >
            <Icon className="size-6" />
         </div>
         <h2 className="mt-6 max-w-full text-base font-bold break-all text-black">{title}</h2>
         <p className="mt-2 text-sm text-black/40">{description}</p>

         {(showWrite || showReset) && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
               {showWrite && (
                  // TODO: 글쓰기 페이지(/community/write)가 만들어지면 연결이 동작한다.
                  <ButtonLink href="/community/write" size="field">
                     글쓰기
                  </ButtonLink>
               )}
               {showReset && (
                  <Button variant="outline" size="field" onClick={onReset}>
                     전체 글 보기
                  </Button>
               )}
            </div>
         )}
      </div>
   );
}
