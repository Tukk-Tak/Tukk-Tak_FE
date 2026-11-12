'use client';

import { ArrowRight } from 'lucide-react';
import { useSession } from '@/entities/user/model/useSession';
import { CREATE_WITH_AI_PATH, LOGIN_PATH } from '@/shared/config/routes';
import { Button } from '@/shared/ui/Button';
import { ButtonLink } from '@/shared/ui/ButtonLink';

// 메인의 "AI로 초안 만들기". 로그인했으면 AI 카드가 선택된 허브로, 아니면 로그인 페이지로 보낸다.
// 로그인 여부를 확인하는 동안에는 잘못된 곳으로 가지 않도록 누를 수 없게 둔다.
export function StartWithAiButton() {
   const { status, user } = useSession();
   const content = (
      <>
         AI로 초안 만들기
         <ArrowRight className="size-4" />
      </>
   );

   if (status === 'loading') {
      return (
         <Button size="lg" className="mt-10" disabled>
            {content}
         </Button>
      );
   }

   return (
      <ButtonLink href={user ? CREATE_WITH_AI_PATH : LOGIN_PATH} size="lg" className="mt-10">
         {content}
      </ButtonLink>
   );
}
