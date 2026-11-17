export interface CreatePostPayload {
   title: string;
   content: string;
   // '#' 없이 보관한다.
   tags: string[];
   // 대표 사진 파일. 글과 함께 한 번의 요청(multipart)으로 보낸다.
   image: File;
}
