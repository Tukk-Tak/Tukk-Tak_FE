// 9900 → '9,900원'
export function formatWon(amount: number): string {
   return `${amount.toLocaleString('ko-KR')}원`;
}
