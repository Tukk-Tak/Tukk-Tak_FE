import { ApiError } from '@/shared/lib/apiClient';
import { mockDelay } from '@/shared/lib/mockDelay';
import type { CreatePostPayload } from '../types';

// TODO: 백엔드 API가 정해지면 교체한다. 지금은 UI 확인용 mock이다.
// 실제로는 사진을 포함한 multipart 요청이고, 제목·내용 길이, 태그 규칙, 사진 형식·크기는 서버가 다시 검사한다.
// 오류 메시지도 백엔드가 내려주는 메시지를 쓴다.
// mock 규칙: 제목이 "등록실패"이면 오류가 나고, 그 외에는 약 1초 뒤 성공한다. (등록한 글은 목록 mock에 반영되지 않는다.)
export async function createPost({ title }: CreatePostPayload): Promise<{ id: string }> {
   await mockDelay(1000);

   if (title === '등록실패') {
      throw new ApiError('POST_CREATE_FAILED', '글을 등록하지 못했어요. 잠시 후 다시 시도해주세요');
   }

   return { id: `post-${Date.now()}` };
}
