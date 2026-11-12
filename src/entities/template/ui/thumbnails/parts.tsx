import type { CSSProperties, ReactNode } from 'react';
import { DEFAULT_THEME, type ThemeConfig } from '@/entities/site';

// 템플릿 미리보기 그림을 그리는 작은 도형들. 색은 템플릿의 테마에서 가져와서,
// 미리보기가 실제 사이트와 같은 색 느낌을 갖는다. (도형은 CSS 변수 --t-* 를 읽는다)
const mix = (color: string, percent: number) =>
   `color-mix(in srgb, var(${color}) ${percent}%, transparent)`;

// 미리보기 한 장의 바깥 틀. 테마를 CSS 변수로 풀어 안쪽 도형들이 쓰게 한다.
export function ThumbFrame({ theme, children }: { theme: ThemeConfig; children: ReactNode }) {
   const t = { ...DEFAULT_THEME, ...theme };
   const style = {
      '--t-bg': t.bg,
      '--t-text': t.text,
      '--t-muted': t.textMuted,
      '--t-border': t.border,
      '--t-primary': t.primary,
      '--t-radius': t.radius,
      background: t.bg,
      borderColor: t.border,
      borderRadius: t.radius,
   } as CSSProperties;

   return (
      <div
         aria-hidden
         style={style}
         className="flex size-full flex-col gap-2 overflow-hidden border p-2.5"
      >
         {children}
      </div>
   );
}

export function Row({ children, className = '' }: { children: ReactNode; className?: string }) {
   return <div className={`flex items-center gap-1.5 ${className}`}>{children}</div>;
}

export function Col({
   children,
   className = '',
   style,
}: {
   children: ReactNode;
   className?: string;
   style?: CSSProperties;
}) {
   return (
      <div className={`flex flex-col gap-1 ${className}`} style={style}>
         {children}
      </div>
   );
}

// 글줄. title은 제목처럼 굵고 진하게, muted는 보조 글처럼 연하게 그린다.
export function Line({
   width,
   kind = 'body',
}: {
   width: string;
   kind?: 'title' | 'body' | 'muted';
}) {
   const style: CSSProperties =
      kind === 'title'
         ? { height: 6, background: mix('--t-text', 62) }
         : kind === 'muted'
           ? { height: 4, background: mix('--t-muted', 30) }
           : { height: 4, background: mix('--t-text', 22) };
   return <span className="block shrink-0 rounded-sm" style={{ width, ...style }} />;
}

// 사진 자리
export function Pic({ className = '', style }: { className?: string; style?: CSSProperties }) {
   return (
      <div
         className={className}
         style={{
            borderRadius: 'var(--t-radius)',
            background: mix('--t-text', 12),
            border: `1px solid ${mix('--t-text', 8)}`,
            ...style,
         }}
      />
   );
}

export function Dot() {
   return (
      <span
         className="block size-3 shrink-0 rounded-full"
         style={{ background: 'var(--t-primary)' }}
      />
   );
}

// 히어로의 라벨(뱃지)
export function Pill() {
   return (
      <span
         className="block h-1.5 w-5 rounded-full"
         style={{ background: mix('--t-primary', 30), border: '1px solid var(--t-primary)' }}
      />
   );
}
