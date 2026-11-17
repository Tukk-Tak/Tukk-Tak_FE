import { ApiError, apiUploadForm } from '@/shared/lib/apiClient';
import type { CreatePostPayload } from '../types';

interface CreatePostOptions {
   // 0~100. 글과 사진을 보내는 진행률이다.
   onProgress?: (percent: number) => void;
}

// 서버가 글 등록 성공 때 data에 돌려주기로 한(요청 예정) 모양이다. 아직 data가 null이라, 지금은 id가 없을 수 있다.
interface CreatePostData {
   postId?: number | string;
}

// 글 등록 POST /post (multipart/form-data)
// TODO: 로그인(인증) 연동 때 Authorization 헤더가 붙는다. (apiClient)
export async function createPost(
   { title, content, tags, image }: CreatePostPayload,
   { onProgress }: CreatePostOptions = {},
): Promise<{ id: string | null }> {
   const form = new FormData();
   form.append('title', title);
   form.append('content', content);
   // 서버가 태그를 반복 필드로도, 쉼표로 이은 한 값으로도 받는다. 태그에는 쉼표가 들어갈 수 없어서 반복 필드가 안전하다.
   tags.forEach((tag) => form.append('tags', tag));
   form.append('image', image);

   try {
      const data = await apiUploadForm<CreatePostData | null>('/post', form, { onProgress });
      const id = data?.postId;
      return { id: id === undefined || id === null ? null : String(id) };
   } catch (error) {
      // 서버나 앞단 프록시가 공통 모양이 아닌 413을 줄 수 있다. 글 등록에서 너무 큰 것은 사진이므로 같은 문구로 보여 준다.
      if (error instanceof ApiError && error.code === 'PAYLOAD_TOO_LARGE') {
         throw new ApiError('INVALID_IMAGE', '사진은 최대 5MB까지 올릴 수 있어요.', 413);
      }
      throw error;
   }
}
