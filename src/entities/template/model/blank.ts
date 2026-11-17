import type { Template } from '../types';

// 빈 템플릿: 블록이 하나도 없는 상태로 에디터를 시작한다. 테마는 기본값을 쓴다.
export const BLANK_TEMPLATE: Template = {
   id: 'blank',
   name: '빈 템플릿 (템플릿 없이 바로 편집)',
   description: '처음부터 직접 만들어요',
   content: { theme: {}, rows: [] },
};
