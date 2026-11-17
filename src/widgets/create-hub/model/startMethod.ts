// 허브에서 고를 수 있는 시작 방식. 주소의 ?start= 값으로 미리 선택해 둘 수 있다.
export type StartMethod = 'ai' | 'template';

// 주소에서 읽은 값을 시작 방식으로 바꾼다. 모르는 값이면 선택하지 않은 것(null)으로 본다.
export function parseStartMethod(value: string | string[] | undefined): StartMethod | null {
   return value === 'ai' || value === 'template' ? value : null;
}
