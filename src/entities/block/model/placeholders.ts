// 새로 추가한 블록이 처음에 담는 기본 문구. 무엇을 입력할 자리인지 알 수 있는 안내 문구이다.
// 한두 단어 자리는 짧은 이름, 문장 자리는 "~를 입력해 주세요" 말투이다.
// 사용자가 고치지 않고 배포하면 이 문구가 그대로 보이므로, 에디터는 값이 기본 문구 그대로인지 알려 주고
// 배포 점검에서도 같은 판단(isBlockPlaceholder)을 쓴다.
export const PLACEHOLDER = {
   brandName: '사이트 이름',
   heroTitle: '제목을 입력해 주세요',
   heroSubtitle: '소개 문구를 입력해 주세요',
   textTitle: '제목',
   textBody: '내용을 입력해 주세요',
   listTitle: '섹션 제목',
   itemName: '메뉴 이름',
   itemDescription: '설명',
   itemPrice: '가격',
   // TODO: 푸터 대체 문구는 AI 초안의 FOOTER_PLACEHOLDERS(features/ai-draft)와 같은 문구이다. 하나로 모을지 정한다.
   address: '가게 주소를 입력해 주세요',
   phone: '전화번호를 입력해 주세요',
   hours: '영업시간을 입력해 주세요',
} as const;

const PLACEHOLDER_TEXTS: ReadonlySet<string> = new Set(Object.values(PLACEHOLDER));

// 값이 기본 문구와 똑같은지. 사용자가 일부러 같은 글을 쓴 경우도 기본 문구로 보지만 드물어서 감수한다.
export function isBlockPlaceholder(value: string | undefined): boolean {
   return value !== undefined && PLACEHOLDER_TEXTS.has(value.trim());
}
