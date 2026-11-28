export const COMMENT_MAX_LENGTH = 100;
// 댓글은 한 페이지에 10개(대댓글 제외)씩 불러온다. 대댓글은 페이지 없이 한 번에 모두 받는다.
export const COMMENT_PAGE_SIZE = 10;

// visible: 보이는 댓글 / private_hidden: 비공개라 이 사용자는 볼 수 없음 / deleted: 삭제됨
export type CommentStatus = 'visible' | 'private_hidden' | 'deleted';

// 댓글·대댓글 한 건. 숨겨야 하는 값(닉네임·내용)은 서버가 null로 가려서 내려주고,
// 화면은 서버가 준 플래그(삭제·비공개·내 댓글)로 어떻게 보일지만 정한다. (열람 권한을 화면에서 계산하지 않는다.)
export interface CommentView {
   id: string;
   postId: string;
   // 대댓글이면 그 스레드의 최상위 댓글 id, 최상위 댓글이면 null
   parentId: string | null;
   status: CommentStatus;
   // 숨김·삭제면 null
   authorNickname: string | null;
   content: string | null;
   isPrivate: boolean;
   // 게시물 작성자가 쓴 댓글인지 ("작성자" 표시)
   isPostAuthor: boolean;
   // 작성 시각(ISO). 숨김·삭제면 서버가 주지 않아 빈 문자열이다.
   createdAt: string;
   // 최상위 댓글의 답글 수. 대댓글에는 없어서 0이다.
   replyCount: number;
   // 삭제 버튼을 보여 줄지. 내 댓글이고 아직 삭제되지 않았을 때만 true이다.
   // (글 작성자는 삭제 권한이 없다. 관리자 삭제는 관리자 화면 작업 때 함께 다룬다. 실제 권한은 서버가 다시 확인한다.)
   canDelete: boolean;
}

export interface CommentPage {
   comments: CommentView[];
   // 최상위 댓글의 총 개수. 서버가 대댓글까지 합친 개수는 주지 않는다.
   totalCount: number;
   page: number;
   // 댓글이 하나도 없으면 0이다.
   totalPages: number;
}

// 댓글·대댓글 작성 내용. 대댓글에 답해도 서버는 부모(최상위) 댓글에만 붙인다.
export interface CreateCommentPayload {
   content: string;
   isPrivate: boolean;
}
