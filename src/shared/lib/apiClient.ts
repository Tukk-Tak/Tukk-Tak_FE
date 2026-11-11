export class ApiError extends Error {
   constructor(
      public code: string,
      message: string,
   ) {
      super(message);
   }
}

// ApiError가 아닌 예외(예상치 못한 오류)는 공통 메시지의 ApiError로 바꿔서 호출부가 한 가지만 다루게 한다.
export function toApiError(error: unknown): ApiError {
   if (error instanceof ApiError) return error;
   return new ApiError('UNKNOWN', '요청 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요');
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
   let res: Response;
   try {
      res = await fetch(url, options);
   } catch {
      // 네트워크 자체 실패는 백엔드 응답이 없으므로 프론트가 직접 메시지를 구성한다.
      throw new ApiError('NETWORK_ERROR', '네트워크 연결을 확인해주세요');
   }

   if (!res.ok) {
      const body = await res.json().catch(() => null);
      // 그 외 오류는 백엔드가 내려준 에러코드와 메시지를 그대로 사용한다.
      throw new ApiError(
         body?.code ?? 'UNKNOWN',
         body?.message ?? '요청 처리 중 오류가 발생했어요',
      );
   }

   return res.json();
}
