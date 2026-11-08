export const COMMENT_MAX_LENGTH = 100;
// 댓글은 한 페이지에 10개(대댓글 제외), 대댓글은 한 번에 5개씩 불러온다.
export const COMMENT_PAGE_SIZE = 10;
export const REPLY_PAGE_SIZE = 5;

// visible: 보이는 댓글 / private_hidden: 비공개라 이 사용자는 볼 수 없음 / deleted: 삭제됨
export type CommentStatus = 'visible' | 'private_hidden' | 'deleted';

// 댓글·대댓글 한 건. 보는 사람에 따라 달라지는 값(status, canReply, canDelete 등)과 숨겨야 하는 값(닉네임·내용)은
// 서버가 계산해서 내려주고, 화면은 그대로 그린다. (비공개 판단을 화면에서 하지 않는다.)
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
   // 이 대댓글이 답한 사람. 멘션 칩으로 보여 준다. (내용 글자 수에 포함하지 않는다.)
   mentionNickname: string | null;
   // 작성 시각(ISO)
   createdAt: string;
   // 최상위 댓글의 답글 수. 숨김이면 0이다. (삭제·비공개로 보이는 답글 줄도 개수에 포함한다.)
   replyCount: number;
   // 지금 보는 사람이 이 댓글에 답글을 달 수 있는지. 삭제·숨김이거나 로그인하지 않았으면 false
   canReply: boolean;
   canDelete: boolean;
   // 이 댓글 작성자가, 지금 보는 사람이 이 스레드에 쓰는 "비공개 답글"을 볼 수 있는지.
   // 공개 댓글 아래에 비공개 답글을 달 때 멘션 대상이 볼 수 없으면 경고하는 데 쓴다. (서버가 열람 범위로 계산한다.)
   authorCanViewPrivateReply: boolean;
}

export interface CommentPage {
   comments: CommentView[];
   // "댓글 N" 표시용: 댓글 + 대댓글 (삭제된 것은 빼고 비공개는 포함)
   totalCount: number;
   page: number;
   totalPages: number;
}

export interface ReplyPage {
   replies: CommentView[];
   nextCursor: string | null;
   hasNext: boolean;
}

export interface CreateCommentPayload {
   content: string;
   isPrivate: boolean;
}

export interface CreateReplyPayload extends CreateCommentPayload {
   // 답한 사람의 닉네임. 없으면 멘션 없는 답글이다.
   mentionNickname?: string;
}

// TODO: mock 동작 확인용 스위치이다. 백엔드 연동 때 삭제한다. (개발 환경에서만 주소의 ?cmock= 로 켠다.)
// empty: 댓글 없음 / error: 불러오기 실패 / slow: 느린 응답
export type CommentMock = 'empty' | 'error' | 'slow';

// 에러코드가 정해지면 이 값을 맞춘다.
export const COMMENT_ERROR = {
   LOAD_FAILED: 'COMMENT_LOAD_FAILED',
   UNAUTHENTICATED: 'COMMENT_UNAUTHENTICATED',
   FORBIDDEN: 'COMMENT_FORBIDDEN',
   NOT_FOUND: 'COMMENT_NOT_FOUND',
   INVALID: 'COMMENT_INVALID',
   CREATE_FAILED: 'COMMENT_CREATE_FAILED',
} as const;
