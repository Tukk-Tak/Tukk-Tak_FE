// 결제가 끝까지 가지 못한 이유. 백엔드 에러코드가 정해지면 이 값을 맞춘다.
export const CHECKOUT_ERROR = {
   CANCELED: 'PAYMENT_CANCELED', // 사용자가 결제창에서 취소
   DECLINED: 'PAYMENT_DECLINED', // 카드사·결제사의 승인 거절
   TEMPORARY: 'PAYMENT_TEMPORARY_ERROR', // 일시적인 오류(다시 시도하면 될 수 있음)
} as const;
