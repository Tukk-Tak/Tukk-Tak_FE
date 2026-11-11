import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { NOTIFICATION_ERROR } from '../types';
import { getStore, readNotificationMock, setStore } from './mockNotificationStore';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다.
// mock 규칙: ?nmock=deletefail 이면 삭제가 실패한다. 그 밖에는 항상 성공한다.

// 알림 하나를 지운다. (DELETE /notifications/{id})
export async function deleteNotification(id: string): Promise<void> {
   await mockDelay(300);
   failIfMockDeleteFail();
   setStore(getStore().filter((item) => item.id !== id));
}

// 알림을 모두 지운다. (DELETE /notifications)
export async function deleteAllNotifications(): Promise<void> {
   await mockDelay(400);
   failIfMockDeleteFail();
   setStore([]);
}

// 알림을 모두 읽음으로 바꾼다. (PATCH /notifications/read)
export async function markAllNotificationsRead(): Promise<void> {
   await mockDelay(200);
   setStore(getStore().map((item) => ({ ...item, isNew: false })));
}

function failIfMockDeleteFail() {
   if (readNotificationMock() === 'deletefail') {
      throw new ApiError(NOTIFICATION_ERROR.DELETE_FAILED, '알림을 지우지 못했어요');
   }
}
