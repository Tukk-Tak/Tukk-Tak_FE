// 알림 종류. 아이콘과 색을 정하는 데만 쓴다. (문구는 서버가 완성해서 내려준다.)
export type NotificationType = 'draft_failed' | 'draft_done' | 'comment' | 'like' | 'deployed';

export interface NotificationData {
   id: string;
   type: NotificationType;
   // 서버가 만든 완성된 문구. 글자 그대로만 보여 준다. (HTML로 해석하지 않는다.)
   message: string;
   // ISO 문자열
   createdAt: string;
   // 아직 읽지 않은 알림인지 (서버가 알려 준다.)
   isNew: boolean;
   // 눌렀을 때 이동할 주소. 이동할 곳이 없는 알림은 null이다.
   href: string | null;
}

// 최신순이다. 오래된 알림은 서버가 일정 기간 뒤 지우므로 페이지를 나누지 않고 한 번에 받는다.
export interface NotificationList {
   notifications: NotificationData[];
}

// 개발 환경에서 주소의 ?nmock= 으로 켜는 mock 스위치 (deletefail: 불러오기는 되고 삭제만 실패)
export type NotificationMock = 'empty' | 'error' | 'slow' | 'deletefail';

export const NOTIFICATION_ERROR = {
   LOAD_FAILED: 'NOTIFICATION_LOAD_FAILED',
   DELETE_FAILED: 'NOTIFICATION_DELETE_FAILED',
} as const;
