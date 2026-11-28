import type { CommentStatus, CommentView } from '../commentTypes';

// 서버 응답(data) 중 화면이 쓰는 것. 댓글 id는 숫자로 온다.
// 삭제됐거나, 비공개인데 볼 권한이 없으면 닉네임·내용·작성 시각이 null이다.
export interface CommentData {
   id: number | string;
   nickname?: string | null;
   content?: string | null;
   createdAt?: string | null;
   // 최상위 댓글에만 있다.
   replyCount?: number;
   isPrivate?: boolean;
   isDeleted?: boolean;
   // 게시물 작성자가 쓴 댓글인지
   isWriter?: boolean;
   // 지금 보는 사람이 쓴 댓글인지
   isMine?: boolean;
}

function statusOf(data: CommentData): CommentStatus {
   if (data.isDeleted) return 'deleted';
   // 비공개인데 내용이 가려져 있으면 볼 권한이 없는 것이다. (권한 판단은 서버가 하고, 화면은 가려진 결과만 따른다.)
   if (data.isPrivate && data.content == null) return 'private_hidden';
   return 'visible';
}

// 서버의 댓글 한 건을 화면용으로 바꾼다. parentId가 null이면 최상위 댓글, 아니면 그 스레드의 대댓글이다.
export function toCommentView(
   data: CommentData,
   { postId, parentId }: { postId: string; parentId: string | null },
): CommentView {
   const status = statusOf(data);
   const visible = status === 'visible';

   return {
      id: String(data.id),
      postId,
      parentId,
      status,
      authorNickname: visible ? (data.nickname ?? '') : null,
      content: visible ? (data.content ?? '') : null,
      isPrivate: visible && data.isPrivate === true,
      isPostAuthor: visible && data.isWriter === true,
      // "2026-10-24T19:00:00"처럼 시각까지 온다.
      createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
      replyCount: data.replyCount ?? 0,
      canDelete: visible && data.isMine === true,
   };
}
