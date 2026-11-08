'use client';

import { createContext, useContext } from 'react';

// 열려 있는 답글 입력창이 가리키는 곳. 입력창은 한 번에 하나만 열린다.
export interface ComposerTarget {
   // 입력창이 붙는 스레드의 최상위 댓글 id
   rootId: string;
   // 멘션 칩으로 붙일 닉네임. 최상위 댓글에 바로 답할 때는 null
   mention: string | null;
   // 멘션 대상이 내가 쓰는 비공개 답글을 볼 수 있는지 (서버가 계산한 값)
   mentionCanViewPrivateReply: boolean;
}

// 댓글 카드 안의 여러 컴포넌트가 함께 쓰는 화면 상태와 동작.
export interface CommentUi {
   loggedIn: boolean;
   composer: ComposerTarget | null;
   openComposer: (target: ComposerTarget) => void;
   closeComposer: () => void;
   // 방금 쓴 댓글처럼 잠깐 강조할 댓글 id (2초 뒤 사라진다.)
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
