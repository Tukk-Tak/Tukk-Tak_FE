import { ApiError, apiFetch } from '@/shared/lib/apiClient';
import type { NotificationData } from '../types';
import { toNotification, type NotificationRaw } from './notificationMapper';

// 알림 목록 조회 GET /notification
// 최신순(createdAt 내림차순)으로 페이지 없이 한 번에 받고, 알림이 없으면 빈 배열이다. (예외는 인증 오류 401·403뿐이다.)
// 서버가 오래된 알림을 정리하므로 페이지를 나누지 않는다.
export async function getNotifications(): Promise<NotificationData[]> {
   const data = await apiFetch<NotificationRaw[] | null>('/notification');
   if (!Array.isArray(data)) {
      throw new ApiError('UNKNOWN', '알림을 불러오지 못했어요. 잠시 후 다시 시도해주세요');
   }
   return data.map(toNotification);
}

// 읽지 않은 알림이 있는지 GET /notification/exists
// true이면 벨에 빨간 점을 띄운다. 목록을 받지 않고도 점만 정할 수 있다.
export async function fetchHasUnreadNotification(): Promise<boolean> {
   const data = await apiFetch<boolean | null>('/notification/exists');
   return data === true;
}
