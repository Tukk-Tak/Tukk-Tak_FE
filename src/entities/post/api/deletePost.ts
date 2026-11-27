import { apiFetch } from '@/shared/lib/apiClient';

// 게시물 삭제 DELETE /post/{postId}
// 작성자 본인과 관리자만 삭제할 수 있고, 서버는 글을 소프트 딜리트한다. (이후 목록·상세에서는 없는 글이다.)
// 성공하면 data는 비어 있다. 권한이 없으면 403, 글이 없거나 이미 삭제됐으면 404이고, 문구는 서버 message를 그대로 보여 준다.
// 삭제 버튼을 보여 줄지는 화면이 정하지만, 실제 권한은 여기서 서버가 다시 확인한다.
export async function deletePost(id: string): Promise<void> {
   await apiFetch<null>(`/post/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
