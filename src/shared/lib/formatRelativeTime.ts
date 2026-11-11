import { formatDotDate, parseIsoDate } from './date';

const KST_DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
   timeZone: 'Asia/Seoul',
   year: 'numeric',
   month: '2-digit',
   day: '2-digit',
});

// 댓글 시간처럼 "얼마나 전인지"를 보여 준다. 방금 전 → N분 전 → N시간 전 → N일 전, 일주일이 넘으면 날짜(2026.10.12)이다.
// iso는 시각이 들어 있는 ISO 문자열이다. 읽을 수 없는 값이면 빈 문자열을 돌려준다.
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
   const time = Date.parse(iso);
   if (Number.isNaN(time)) return '';

   // 서버와 시계가 조금 어긋나 미래로 보여도 "방금 전"으로 본다.
   const seconds = Math.max(0, Math.floor((now - time) / 1000));
   if (seconds < 60) return '방금 전';

   const minutes = Math.floor(seconds / 60);
   if (minutes < 60) return `${minutes}분 전`;

   const hours = Math.floor(minutes / 60);
   if (hours < 24) return `${hours}시간 전`;

   const days = Math.floor(hours / 24);
   if (days < 7) return `${days}일 전`;

   const date = parseIsoDate(KST_DATE_FORMAT.format(new Date(time)));
   return date ? formatDotDate(date) : '';
}
