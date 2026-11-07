// 파일 크기를 사람이 읽기 쉽게 보여 준다. 8598323 → '8.2MB', 350000 → '342KB'
export function formatFileSize(bytes: number): string {
   const MB = 1024 * 1024;
   if (bytes >= MB) return `${(bytes / MB).toFixed(1)}MB`;
   return `${Math.max(1, Math.round(bytes / 1024))}KB`;
}
