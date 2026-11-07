// 좋아요·댓글 수처럼 좁은 자리에 들어가는 숫자를 줄여 쓴다. 999 → '999', 1234 → '1.2k', 15000 → '15k'
export function formatCount(count: number): string {
   if (count < 1000) return String(count);
   const thousands = count / 1000;
   // 소수 첫째 자리까지만 보여 주되, 10k 이상은 정수로 줄인다. (.0은 붙이지 않는다.)
   const text =
      thousands >= 10 ? String(Math.floor(thousands)) : thousands.toFixed(1).replace(/\.0$/, '');
   return `${text}k`;
}
