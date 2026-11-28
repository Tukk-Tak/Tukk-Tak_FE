import { NOTIFICATION_TYPES, type NotificationData, type NotificationType } from '../types';

// 서버 응답(data) 중 화면이 쓰는 것. id는 숫자로 온다.
export interface NotificationRaw {
   id: number | string;
   type?: string;
   // 알림이 가리키는 대상의 id. 댓글·좋아요 알림에서는 글 id이다.
   targetId?: number | string | null;
   message?: string;
   isRead?: boolean;
   createdAt?: string;
}

function toType(value: string | undefined): NotificationType {
   return (NOTIFICATION_TYPES as readonly string[]).includes(value ?? '')
      ? (value as NotificationType)
      : 'UNKNOWN';
}

// 눌렀을 때 이동할 곳. 댓글·좋아요 알림은 그 글로 이동한다. (삭제된 글이면 글 상세가 "삭제되었거나 없는 게시물이에요"를 보여 준다.)
// 나머지 종류(AI·배포·결제)는 targetId가 무엇을 가리키는지 정해지지 않아서 아직 이동하지 않는다.
// TODO: 서버가 이 종류들을 보내기 시작하면 targetId의 뜻에 맞춰 이동 주소를 추가한다.
function toHref(
   type: NotificationType,
   targetId: number | string | null | undefined,
): string | null {
   if ((type === 'COMMENT' || type === 'LIKE') && targetId != null) {
      return `/community/${encodeURIComponent(String(targetId))}`;
   }
   return null;
}

// 서버 시각은 "2026-11-23T14:21:28"처럼 오는데, 실시간 알림 쪽은 소수점이 7자리까지("…28.1403809") 온다.
// 일부 브라우저(Safari)는 소수점 3자리를 넘으면 읽지 못해서 3자리로 줄인다.
function normalizeTime(value: string | undefined): string {
   return (value ?? '').replace(/(\.\d{3})\d+/, '$1');
}

export function toNotification(raw: NotificationRaw): NotificationData {
   const type = toType(raw.type);
   return {
      id: String(raw.id),
      type,
      message: raw.message ?? '',
      createdAt: normalizeTime(raw.createdAt),
      isNew: raw.isRead !== true,
      href: toHref(type, raw.targetId),
   };
}
