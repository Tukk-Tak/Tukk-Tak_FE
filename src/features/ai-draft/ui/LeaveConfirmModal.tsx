'use client';

import { ConfirmModal } from '@/shared/ui/ConfirmModal';

// page: 뒤로 가기·헤더 링크로 화면을 벗어날 때 / restart: 1단계에서 [이전]으로 시작 방식을 다시 고를 때 / skip: [건너뛰고 직접 편집하기]
export type LeaveModalKind = 'page' | 'restart' | 'skip';

const COPY: Record<LeaveModalKind, { title: string; description: string }> = {
   page: {
      title: '페이지를 벗어날까요?',
      description:
         "페이지를 벗어나면 입력한 내용이 저장되지 않아요.\n이전 단계로 돌아가려면\n화면 아래의 '이전' 버튼을 눌러 주세요.",
   },
   restart: {
      title: '시작 방식을 다시 고를까요?',
      description: '처음 화면으로 돌아가면 입력한 내용이 저장되지 않아요.',
   },
   skip: {
      title: '직접 편집으로 넘어갈까요?',
      description:
         'AI 초안 작성을 건너뛰고 직접 편집할 수 있어요.\n이 페이지를 벗어나면 입력한 내용은 저장되지 않아요.',
   },
};

interface LeaveConfirmModalProps {
   kind: LeaveModalKind;
   onConfirm: () => void;
   onCancel: () => void;
}

// AI 초안 입력 내용이 사라질 수 있는 이동 앞에서 확인을 받는 모달. 열려 있을 때만 렌더링해서 쓴다.
export function LeaveConfirmModal({ kind, onConfirm, onCancel }: LeaveConfirmModalProps) {
   const { title, description } = COPY[kind];

   return (
      <ConfirmModal
         title={title}
         description={description}
         confirmLabel="확인"
         cancelLabel="취소"
         onConfirm={onConfirm}
         onCancel={onCancel}
      />
   );
}
