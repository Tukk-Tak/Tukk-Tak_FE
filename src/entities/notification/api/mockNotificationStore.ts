import type { NotificationData, NotificationMock } from '../types';

// TODO: 백엔드 API가 정해지면 이 파일은 삭제한다. 서버가 하는 일(알림 보관, 읽음·삭제 처리)을 메모리로 흉내 낸다.
// 새로고침하면 처음 모습으로 돌아간다.

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

let store: NotificationData[] | null = null;

function seed(): NotificationData[] {
   const now = Date.now();
   const ago = (ms: number) => new Date(now - ms).toISOString();

   return [
      {
         id: 'n-1',
         type: 'draft_failed',
         message: 'AI 초안을 만들지 못했어요. 다시 시도해주세요',
         createdAt: ago(10_000),
         isNew: true,
         href: null,
      },
      {
         id: 'n-2',
         type: 'comment',
         message: "사장님D님이 '동네 분식집 오픈했어요'에 댓글을 남겼어요",
         createdAt: ago(20_000),
         isNew: true,
         href: '/community/post-11',
      },
      {
         id: 'n-3',
         type: 'draft_done',
         message: 'AI 초안이 완성됐어요. 에디터에서 확인해보세요',
         createdAt: ago(3 * MINUTE),
         isNew: true,
         href: '/editor/demo',
      },
      {
         id: 'n-4',
         type: 'like',
         message: "3명이 '동네 분식집 오픈했어요'에 좋아요를 눌렀어요",
         createdAt: ago(HOUR),
         isNew: false,
         href: '/community/post-11',
      },
      {
         id: 'n-5',
         type: 'deployed',
         message: '사이트 배포가 완료됐어요',
         createdAt: ago(26 * HOUR),
         isNew: false,
         href: null,
      },
      {
         id: 'n-6',
         type: 'like',
         message: "2명이 '첫 홈페이지를 만들고 달라진 점'에 좋아요를 눌렀어요",
         createdAt: ago(3 * 24 * HOUR),
         isNew: false,
         href: '/community/post-11',
      },
   ];
}

export function getStore(): NotificationData[] {
   store ??= seed();
   return store;
}

export function setStore(next: NotificationData[]) {
   store = next;
}

// 개발 환경에서만 주소의 ?nmock= 을 읽는다. (헤더는 Suspense 밖이라 useSearchParams 대신 직접 읽는다.)
export function readNotificationMock(): NotificationMock | undefined {
   if (process.env.NODE_ENV === 'production' || typeof window === 'undefined') return undefined;
   const value = new URLSearchParams(window.location.search).get('nmock');
   return value === 'empty' || value === 'error' || value === 'slow' || value === 'deletefail'
      ? value
      : undefined;
}
