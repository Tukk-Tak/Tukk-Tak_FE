const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

// 백엔드가 모든 응답에 쓰는 공통 모양. 성공이면 data에 결과가, 실패면 code·message에 이유가 담긴다.
interface ApiEnvelope<T> {
   timestamp?: string;
   status?: number;
   code?: string;
   message?: string;
   data?: T;
}

export class ApiError extends Error {
   constructor(
      public code: string,
      message: string,
      // HTTP 상태 코드. 서버가 공통 모양이 아닌 응답(프록시의 413 HTML 등)을 줄 때 상태로 분기하는 데 쓴다.
      public status?: number,
   ) {
      super(message);
   }
}

// ApiError가 아닌 예외(예상치 못한 오류)는 공통 메시지의 ApiError로 바꿔서 호출부가 한 가지만 다루게 한다.
export function toApiError(error: unknown): ApiError {
   if (error instanceof ApiError) return error;
   return new ApiError('UNKNOWN', '요청 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요');
}

// 경로(/post)를 서버 주소와 이어 붙인다. 서버 주소가 설정되지 않았으면 엉뚱한 곳(이 사이트 자신)으로 요청이 가므로 막는다.
export function apiUrl(path: string): string {
   if (!API_BASE_URL) {
      console.error('NEXT_PUBLIC_API_URL 이 설정되지 않았어요. .env.local 을 확인해주세요.');
      throw new ApiError('API_URL_MISSING', '서버 주소가 설정되지 않아 요청을 보낼 수 없어요');
   }
   return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// 응답 본문을 공통 모양으로 읽는다. 공통 모양이 아니면(HTML 등) null이다.
function parseEnvelope<T>(text: string): ApiEnvelope<T> | null {
   try {
      const parsed: unknown = JSON.parse(text);
      return typeof parsed === 'object' && parsed !== null ? (parsed as ApiEnvelope<T>) : null;
   } catch {
      return null;
   }
}

// 실패 응답을 ApiError로 바꾼다. 백엔드가 준 에러코드와 메시지를 그대로 쓰고, 공통 모양이 아니면 상태로 문구를 정한다.
function toFailure(status: number, body: ApiEnvelope<unknown> | null): ApiError {
   if (body?.code || body?.message) {
      return new ApiError(
         body.code ?? 'UNKNOWN',
         body.message ?? '요청 처리 중 오류가 발생했어요',
         status,
      );
   }
   if (status === 413) {
      return new ApiError('PAYLOAD_TOO_LARGE', '보내는 파일이 너무 커요', status);
   }
   return new ApiError('UNKNOWN', '요청 처리 중 오류가 발생했어요', status);
}

// 일반 요청. 성공하면 공통 모양의 data를 돌려준다.
// TODO: 로그인(인증) 연동 때 여기서 Authorization 헤더(Bearer 토큰)를 붙인다.
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
   let res: Response;
   try {
      res = await fetch(apiUrl(path), options);
   } catch (error) {
      if (error instanceof ApiError) throw error;
      // 네트워크 자체 실패는 백엔드 응답이 없으므로 프론트가 직접 메시지를 구성한다.
      throw new ApiError('NETWORK_ERROR', '네트워크 연결을 확인해주세요');
   }

   const body = parseEnvelope<T>(await res.text());
   if (!res.ok) throw toFailure(res.status, body);
   return body?.data as T;
}

// 파일을 올리는 요청이 이 시간(2분) 안에 끝나지 않으면 실패로 본다.
const UPLOAD_TIMEOUT_MS = 120_000;

interface UploadOptions {
   // 0~100. 브라우저가 보낸 만큼의 진행률이다. (100이 되어도 서버 처리가 끝난 것은 아니다.)
   onProgress?: (percent: number) => void;
   // 취소하면 요청을 중단하고 AbortError를 던진다.
   signal?: AbortSignal;
}

// 파일이 들어 있는 multipart(FormData) 요청. fetch는 올리는 진행률을 알 수 없어서 XMLHttpRequest를 쓴다.
// Content-Type은 브라우저가 경계값(boundary)과 함께 정하므로 직접 적지 않는다.
// TODO: 로그인(인증) 연동 때 apiFetch와 같은 방식으로 Authorization 헤더를 붙인다.
export function apiUploadForm<T>(
   path: string,
   form: FormData,
   { onProgress, signal }: UploadOptions = {},
): Promise<T> {
   return new Promise<T>((resolve, reject) => {
      let url: string;
      try {
         url = apiUrl(path);
      } catch (error) {
         reject(error);
         return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.onprogress = (event) => {
         if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
      };
      xhr.onload = () => {
         const body = parseEnvelope<T>(xhr.responseText);
         if (xhr.status >= 200 && xhr.status < 300) resolve(body?.data as T);
         else reject(toFailure(xhr.status, body));
      };
      xhr.onerror = () => reject(new ApiError('NETWORK_ERROR', '네트워크 연결을 확인해주세요'));
      // 서버가 연결만 받고 응답하지 않아도 "등록 중"에 영원히 머무르지 않게 한다. (사진이 커서 오래 걸리는 경우를 넉넉히 기다린다.)
      xhr.timeout = UPLOAD_TIMEOUT_MS;
      xhr.ontimeout = () =>
         reject(new ApiError('TIMEOUT', '응답이 너무 오래 걸려요. 잠시 후 다시 시도해주세요'));
      xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'));

      if (signal) {
         if (signal.aborted) {
            reject(new DOMException('Aborted', 'AbortError'));
            return;
         }
         signal.addEventListener('abort', () => xhr.abort(), { once: true });
      }

      xhr.send(form);
   });
}
