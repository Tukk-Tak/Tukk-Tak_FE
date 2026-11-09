import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import { NOTIFICATION_ERROR, type NotificationList } from '../types';
import { getStore, readNotificationMock } from './mockNotificationStore';

// TODO: 백엔드 API가 정해지면 apiFetch 호출로 교체한다. (GET /notifications) 최신순으로 한 번에 받는다.
// mock 규칙: ?nmock=empty 는 알림 없음, ?nmock=error 는 불러오기 실패, ?nmock=slow 는 느린 응답이다.
export async function getNotifications(): Promise<NotificationList> {
   const mock = readNotificationMock();
   await mockDelay(mock === 'slow' ? 3000 : 400);

   if (mock === 'error') {
      throw new ApiError(
         NOTIFICATION_ERROR.LOAD_FAILED,
         '알림을 불러오지 못했어요. 잠시 후 다시 시도해주세요',
      );
   }
   if (mock === 'empty') return { notifications: [] };

   return { notifications: [...getStore()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
}
