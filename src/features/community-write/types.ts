export interface CreatePostPayload {
   title: string;
   content: string;
   // '#' 없이 보관한다.
   tags: string[];
   // 서버에 먼저 올린 사진의 id. (파일 자체는 업로드 단계에서 따로 올린다.)
   photoId: string;
}
