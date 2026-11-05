// 날짜는 시간대에 흔들리지 않도록 { year, month, day }로 다룬다. 서비스 기준 시간대는 한국(KST)이다.
export interface YmdDate {
   year: number;
   month: number; // 1~12
   day: number;
}

const KST_DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
   timeZone: 'Asia/Seoul',
   year: 'numeric',
   month: '2-digit',
   day: '2-digit',
});

export function getTodayKst(): YmdDate {
   // en-CA 형식은 항상 YYYY-MM-DD이다.
   return parseIsoDate(KST_DATE_FORMAT.format(new Date())) as YmdDate;
}

// 같은 날짜로 N개월 뒤를 구한다. 그 달에 같은 날이 없으면(예: 1/31 + 1개월) 그 달의 말일로 맞춘다.
export function addMonths(date: YmdDate, months: number): YmdDate {
   const total = date.year * 12 + (date.month - 1) + months;
   const year = Math.floor(total / 12);
   const month = (total % 12) + 1;
   const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
   return { year, month, day: Math.min(date.day, lastDay) };
}

// 'YYYY-MM-DD' (정렬하면 날짜 순서와 같아서 문자열 그대로 비교할 수 있다.)
export function toIsoDate({ year, month, day }: YmdDate): string {
   return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseIsoDate(value: string): YmdDate | null {
   const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
   if (!match) return null;
   return { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
}

// 화면에 보여 주는 형식: 2026.10.12
export function formatDotDate({ year, month, day }: YmdDate): string {
   return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
}
