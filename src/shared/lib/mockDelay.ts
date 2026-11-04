// 백엔드 API가 준비되기 전, 응답을 기다리는 모습을 확인하기 위한 mock 전용 지연.
export function mockDelay(ms = 600) {
   return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
