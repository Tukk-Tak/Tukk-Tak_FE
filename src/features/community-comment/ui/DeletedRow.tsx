// 삭제된 댓글. 한 줄만 남기고, 답글 버튼은 두지 않는다. (아래에 남은 답글에는 답글을 달 수 있다.)
export function DeletedRow({ compact = false }: { compact?: boolean }) {
   return (
      <div className={`py-4 text-sm text-black/50 ${compact ? 'px-4' : 'px-5'}`}>
         삭제된 댓글입니다.
      </div>
   );
}
