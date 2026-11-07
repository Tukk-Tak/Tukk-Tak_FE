export interface CreatePostPayload {
   title: string;
   content: string;
   // '#' 없이 보관한다.
   tags: string[];
   photo: File;
}
