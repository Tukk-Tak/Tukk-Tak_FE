export type AiDraftStepId = 'basic' | 'concept' | 'scale' | 'sections' | 'confirm';

interface AiDraftStep {
   id: AiDraftStepId;
   // 사이드바에 보이는 이름
   label: string;
   // 화면 제목. 없으면 label을 쓴다.
   title?: string;
}

// AI 초안 입력 5단계. 사이드바 순서와 각 단계 화면 제목에 쓴다.
export const AI_DRAFT_STEPS: readonly AiDraftStep[] = [
   { id: 'basic', label: '기본 정보' },
   { id: 'concept', label: '컨셉·분위기' },
   { id: 'scale', label: '구조·스케일' },
   { id: 'sections', label: '포함 섹션' },
   { id: 'confirm', label: '최종 확인', title: '마지막으로 확인해주세요' },
];

export const AI_DRAFT_STEP_COUNT = AI_DRAFT_STEPS.length;

// 화면 맨 위의 큰 흐름. 이 위저드는 항상 1번째(AI 초안) 단계이다.
export const FLOW_STEPS = ['AI 초안', '직접 수정'] as const;
