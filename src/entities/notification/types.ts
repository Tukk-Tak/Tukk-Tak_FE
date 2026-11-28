// 알림 종류. 서버의 알림 타입 그대로이고, 아이콘과 색을 정하는 데만 쓴다. (문구는 서버가 완성해서 내려준다.)
// 서버가 나중에 종류를 늘릴 수 있어서, 모르는 종류는 UNKNOWN으로 받아 기본 아이콘으로 보여 준다.
export const NOTIFICATION_TYPES = [
   // 내 글에 댓글이 달렸을 때
   'COMMENT',
   // 내 글에 좋아요를 눌렀을 때
   'LIKE',
   // 결제 만료일이 다가올 때
   'PAYMENT_EXPIRE',
   // AI 초안 백그라운드 생성이 완료됐을 때 / 실패했을 때
   'AI_COMPLETE',
   'AI_FAILED',
   // 백그라운드 배포가 완료됐을 때 / 실패했을 때
   'DEPLOY_COMPLETE',
   'DEPLOY_FAILED',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number] | 'UNKNOWN';

export interface NotificationData {
   id: string;
   type: NotificationType;
   // 서버가 만든 완성된 문구. 글자 그대로만 보여 준다. (HTML로 해석하지 않는다.)
   message: string;
   // ISO 문자열
   createdAt: string;
   // 아직 읽지 않은 알림인지 (서버가 알려 준다.)
   isNew: boolean;
   // 눌렀을 때 이동할 주소. 이동할 곳이 없는 알림은 null이다. (서버는 주소를 주지 않고 종류와 대상 id만 줘서, 화면이 만든다.)
   href: string | null;
}
