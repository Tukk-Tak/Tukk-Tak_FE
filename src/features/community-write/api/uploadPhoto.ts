import { ApiError } from '@/shared/lib/apiClient';

const STEPS = 15;
const STEP_MS = 100;
// 실패를 한 번 겪은 파일 이름. 같은 파일을 다시 시도하면 성공하게 해서 "다시 시도"를 확인할 수 있다.
const failedOnce = new Set<string>();

// 중간에 취소하면 기다림을 바로 끝내고 AbortError를 던진다.
function sleep(ms: number, signal: AbortSignal): Promise<void> {
   return new Promise((resolve, reject) => {
      const abort = () => {
         clearTimeout(timer);
         reject(new DOMException('Aborted', 'AbortError'));
      };
      const timer = setTimeout(() => {
         signal.removeEventListener('abort', abort);
         resolve();
      }, ms);
      if (signal.aborted) abort();
      else signal.addEventListener('abort', abort, { once: true });
   });
}

interface UploadOptions {
   // 0~100
   onProgress: (percent: number) => void;
   signal: AbortSignal;
}

// TODO: 백엔드 업로드 API가 정해지면 교체한다. 지금은 UI 확인용 mock이다.
// 실제로는 진행률을 받을 수 있게 XMLHttpRequest(upload.onprogress)로 올리고, 서버가 파일 형식·크기·내용을 다시 검사한다.
// 올린 사진은 서버가 주소(또는 id)를 돌려주고, 글을 등록할 때는 파일이 아니라 그 값을 보낸다.
// mock 규칙: 약 1.5초 동안 진행률이 올라가며 성공한다. 파일 이름에 "fail"이 들어 있으면 처음 올릴 때 60%쯤에서 네트워크
//            오류가 나고, 같은 파일을 다시 시도하면 성공한다.
export async function uploadPhoto(
   file: File,
   { onProgress, signal }: UploadOptions,
): Promise<{ id: string }> {
   const shouldFail = file.name.toLowerCase().includes('fail') && !failedOnce.has(file.name);

   for (let step = 1; step <= STEPS; step++) {
      await sleep(STEP_MS, signal);

      if (shouldFail && step === 9) {
         failedOnce.add(file.name);
         throw new ApiError('NETWORK_ERROR', '네트워크 연결을 확인해주세요');
      }
      onProgress(Math.round((step / STEPS) * 100));
   }

   return { id: `photo-${Date.now()}` };
}
