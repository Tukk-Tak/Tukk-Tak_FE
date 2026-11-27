'use client';

import { createContext, useContext } from 'react';

// 열려 있는 답글 입력창이 가리키는 곳. 입력창은 한 번에 하나만 열린다.
// 대댓글에 답해도 서버는 그 스레드의 최상위 댓글에만 붙이므로(멘션 필드도 없다) 스레드만 가리키면 된다.
export interface ComposerTarget {
   // 입력창이 붙는 스레드의 최상위 댓글 id
   rootId: string;
}

// 댓글 카드 안의 여러 컴포넌트가 함께 쓰는 화면 상태와 동작.
export interface CommentUi {
   loggedIn: boolean;
   composer: ComposerTarget | null;
   openComposer: (target: ComposerTarget) => void;
   // rootId를 넘기면 그 스레드의 입력창이 열려 있을 때만 닫는다. (등록이 끝나길 기다리는 사이 사용자가 다른 스레드의 입력창을 열었다면 그것은 두어야 한다.)
   // 넘기지 않으면 어느 입력창이든 닫는다.
   closeComposer: (rootId?: string) => void;
   // 잠깐 강조할 댓글 id (2초 뒤 사라진다.)
   // 서버가 댓글 작성 뒤 만든 댓글의 id를 주지 않아서 등록 직후에는 쓰지 않는다. 알림에서 특정 댓글로 들어올 때 쓸 수 있게 남겨 둔다.
   highlightId: string | null;
   highlight: (id: string) => void;
   // 댓글·답글을 쓰거나 지운 뒤 목록(개수)을 다시 불러온다.
   refresh: () => void;
   // 로그인하지 않은 사용자가 로그인이 필요한 동작을 눌렀을 때
   requireLogin: () => void;
}

export const CommentUiContext = createContext<CommentUi | null>(null);

export function useCommentUi(): CommentUi {
   const value = useContext(CommentUiContext);
   if (!value) throw new Error('useCommentUi는 CommentCard 안에서만 사용할 수 있어요');
   return value;
}
