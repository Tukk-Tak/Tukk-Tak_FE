import { apiFetch } from '@/shared/lib/apiClient';

// 알림 읽음 처리 PATCH /notification/{notificationId}/read
// 한 번에 하나만 읽음으로 바꿀 수 있다. 없는 알림은 404, 남의 알림은 403이다.
export async function markNotificationRead(id: string): Promise<void> {
   await apiFetch<null>(`/notification/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
}

// 알림 삭제 DELETE /notification?ids=1,2,3
// 한 개여도 되고 여러 개여도 되며, 0개는 400이라 부르지 않는다.
// - 내 알림과 남의 알림이 섞이면 서버가 오류 없이 내 것만 지운다. (전부 남의 것이면 403, 없는 id가 섞이면 404)
// - 실패하면 서버 message를 그대로 보여 준다.
export async function deleteNotifications(ids: string[]): Promise<void> {
   if (ids.length === 0) return;
   await apiFetch<null>(`/notification?ids=${ids.map(encodeURIComponent).join(',')}`, {
      method: 'DELETE',
   });
}
