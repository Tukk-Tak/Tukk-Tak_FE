import { isPaletteColor } from './color';
import type { BusinessType, HighlightKey, MenuCount, MoodKeyword, PhotoCount } from './options';

// AI 초안 입력 화면에서 사용자가 고른 값 전체. 단계가 늘어나면 이 타입에 항목을 더한다.
export interface AiDraftValues {
   // 1단계 기본 정보
   storeName: string;
   businessType: BusinessType | null;
   // 업종을 '기타'로 골랐을 때 직접 적는 값
   businessTypeCustom: string;
   // 대략적 위치(선택)
   location: string;

   // 2단계 컨셉·분위기
   moodKeywords: MoodKeyword[];
   // 선택한 색(대문자 hex). 팔레트로 고른 색과 직접 고른 색이 함께 들어 있다.
   moodColors: string[];
   // 보완 설명(선택)
   moodNote: string;
   // 참고 이미지(선택)
   referenceImages: File[];

   // 3단계 구조·스케일
   menuCount: MenuCount | null;
   photoCount: PhotoCount | null;

   // 4단계 포함 섹션: 푸터에 보여줄 정보. 켠 항목만 푸터에 들어가고, 끄면 값은 비운다.
   footerAddressOn: boolean;
   footerAddress: string;
   footerPhoneOn: boolean;
   footerPhone: string;
   footerHoursOn: boolean;
   footerHours: string;
   // SNS 링크는 입력 칸이 없다. 켜면 편집 단계에서 직접 입력한다.
   footerSocialOn: boolean;
   // 강조 특징(선택). 프리셋 key와 직접 입력한 문구를 합쳐 최대 3개이다.
   highlightKeys: HighlightKey[];
   highlightCustoms: string[];
}

export const EMPTY_AI_DRAFT_VALUES: AiDraftValues = {
   storeName: '',
   businessType: null,
   businessTypeCustom: '',
   location: '',
   moodKeywords: [],
   moodColors: [],
   moodNote: '',
   referenceImages: [],
   menuCount: null,
   photoCount: null,
   footerAddressOn: false,
   footerAddress: '',
   footerPhoneOn: false,
   footerPhone: '',
   footerHoursOn: false,
   footerHours: '',
   footerSocialOn: false,
   highlightKeys: [],
   highlightCustoms: [],
};

// 1단계의 필수 항목(상호명, 업종)을 모두 채웠는지. 업종이 '기타'이면 직접 적은 값도 있어야 한다.
export function isBasicInfoComplete(values: AiDraftValues) {
   if (values.storeName.trim() === '' || values.businessType === null) return false;
   return values.businessType !== 'other' || values.businessTypeCustom.trim() !== '';
}

// 2단계의 필수 항목(분위기 키워드, 색)을 각각 하나 이상 골랐는지.
export function isMoodComplete(values: AiDraftValues) {
   return values.moodKeywords.length > 0 && values.moodColors.length > 0;
}

// 3단계의 필수 항목(메뉴 개수, 사진 개수)을 모두 골랐는지.
export function isScaleComplete(values: AiDraftValues) {
   return values.menuCount !== null && values.photoCount !== null;
}

// 4단계의 필수 조건: 푸터에 보여줄 정보를 하나 이상 켰는지. 켜기만 해도 되고, 항목별 필수는 없다.
export function isSectionsComplete(values: AiDraftValues) {
   return (
      values.footerAddressOn ||
      values.footerPhoneOn ||
      values.footerHoursOn ||
      values.footerSocialOn
   );
}

// 직접 고른 색. 팔레트에 없는 색을 고른 순서대로 돌려준다.
export function getCustomColors(values: AiDraftValues) {
   return values.moodColors.filter((hex) => !isPaletteColor(hex));
}

// 사이드바의 완료 표시(✓)에 쓴다. 필수 항목이 없거나 아직 정해지지 않은 단계는 완료로 보지 않는다.
// TODO: 최종 확인 단계는 필수 항목이 없어 완료로 보지 않는다.
export function isStepComplete(stepId: string, values: AiDraftValues) {
   if (stepId === 'basic') return isBasicInfoComplete(values);
   if (stepId === 'concept') return isMoodComplete(values);
   if (stepId === 'scale') return isScaleComplete(values);
   if (stepId === 'sections') return isSectionsComplete(values);
   return false;
}

// 사용자가 하나라도 입력했는지. 나가기 확인 모달을 띄울지 정할 때 쓴다.
export function hasAiDraftInput(values: AiDraftValues) {
   return (
      values.storeName.trim() !== '' ||
      values.businessType !== null ||
      values.businessTypeCustom.trim() !== '' ||
      values.location.trim() !== '' ||
      values.moodKeywords.length > 0 ||
      values.moodColors.length > 0 ||
      values.moodNote.trim() !== '' ||
      values.referenceImages.length > 0 ||
      values.menuCount !== null ||
      values.photoCount !== null ||
      isSectionsComplete(values) ||
      values.highlightKeys.length > 0 ||
      values.highlightCustoms.length > 0
   );
}
