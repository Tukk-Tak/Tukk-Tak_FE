// AI 초안 입력의 선택지와 글자 수 제한. 값(key)은 영문, 화면에 보이는 이름(label)은 한글이다.
// 값은 나중에 AI 서버로 넘기는 요청에 그대로 쓰이므로, 이름을 바꿔도 key는 바꾸지 않는다.

export const BUSINESS_TYPES = [
   { key: 'korean', label: '한식' },
   { key: 'cafe', label: '카페·디저트' },
   { key: 'snack', label: '분식' },
   { key: 'western', label: '양식' },
   { key: 'pub', label: '술집' },
   { key: 'other', label: '기타 (직접 입력)' },
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number]['key'];

export const STORE_NAME_MAX = 20;
export const BUSINESS_TYPE_CUSTOM_MAX = 10;
export const LOCATION_MAX = 20;

// 2단계 컨셉·분위기
// 분위기 키워드. 가게 분위기를 겹치지 않게 나눈 것으로, AI가 색·글꼴·여백·문구 톤을 정하는 데 쓴다.
export const MOOD_KEYWORDS = [
   { key: 'cozy', label: '아늑한' },
   { key: 'modern', label: '모던한' },
   { key: 'luxurious', label: '고급스러운' },
   { key: 'casual', label: '캐주얼한' },
   { key: 'trendy', label: '트렌디한' },
   { key: 'vintage', label: '빈티지한' },
   { key: 'natural', label: '내추럴한' },
   { key: 'emotional', label: '감성적인' },
   { key: 'lively', label: '활기찬' },
   { key: 'traditional', label: '전통적인' },
] as const;

export type MoodKeyword = (typeof MOOD_KEYWORDS)[number]['key'];

// 분위기에 맞는 색의 기본 팔레트. 색(hex)은 대문자로 쓰고, 선택한 색 목록에도 같은 형태로 담는다.
export const PALETTE_COLORS = [
   { hex: '#D13423', name: '빨강' },
   { hex: '#FFA623', name: '주황' },
   { hex: '#FFE473', name: '노랑' },
   { hex: '#59A866', name: '초록' },
   { hex: '#649AD1', name: '파랑' },
   { hex: '#4C57A9', name: '남색' },
   { hex: '#9375CA', name: '보라' },
   { hex: '#D993C0', name: '분홍' },
   { hex: '#1E1E1E', name: '검정' },
] as const;

export const MAX_MOOD_KEYWORDS = 3;
// 팔레트로 고른 색과 직접 고른 색을 합쳐서 셉니다.
export const MAX_MOOD_COLORS = 3;
export const MOOD_NOTE_MAX = 150;

// 참고 이미지. 지금은 한 장만 받는다. 늘리려면 이 값만 바꾸면 된다.
export const MAX_REFERENCE_IMAGES = 1;
export const REFERENCE_IMAGE_TYPES = ['image/png', 'image/jpeg'];
// TODO: 파일 크기 제한은 백엔드와 정해서 채운다. (지금은 형식만 검사한다.)

// 3단계 구조·스케일
// 소개할 메뉴·상품 개수. 목록 블록의 모양(variant)을 정하는 데 쓴다. result는 최종 확인 화면에서 "→" 뒤에 보여 줄 짧은 설명이다.
// few → 카드/지그재그(사진 크게), medium → 행 목록, many → 촘촘한 타일(이름·가격만)
export const MENU_COUNTS = [
   {
      key: 'few',
      label: '5개 이하',
      description: '하나하나 사진과 함께 크게 보여줘요',
      result: '사진과 함께 크게 보여줘요',
   },
   {
      key: 'medium',
      label: '6~15개',
      description: '사진과 가격을 목록으로 깔끔하게 보여줘요',
      result: '리스트로 보여줘요',
   },
   {
      key: 'many',
      label: '16개 이상',
      description: '이름과 가격 위주로 촘촘하게 보여줘요',
      result: '이름과 가격 위주로 촘촘하게 보여줘요',
   },
] as const;

export type MenuCount = (typeof MENU_COUNTS)[number]['key'];

// 가진 사진 개수. 갤러리 블록의 모양(variant)을 정하는 데 쓴다.
// none → 갤러리 없음, one → 단일 액자형, some → 대표+썸네일형, many → 균일 그리드형
export const PHOTO_COUNTS = [
   {
      key: 'none',
      label: '없어요',
      description: '큰 문구 중심으로 만들고 갤러리는 넣지 않아요',
      result: '갤러리 없이 글 중심으로 보여줘요',
   },
   {
      key: 'one',
      label: '1장',
      description: '대표 사진 한 장을 액자처럼 보여줘요',
      result: '대표 사진 한 장을 액자처럼 보여줘요',
   },
   {
      key: 'some',
      label: '2~5장',
      description: '대표 사진 1장과 작은 사진으로 보여줘요',
      result: '대표 사진 + 작은 사진',
   },
   {
      key: 'many',
      label: '6장 이상',
      description: '같은 크기의 사진을 격자로 보여줘요',
      result: '같은 크기의 격자 갤러리',
   },
] as const;

export type PhotoCount = (typeof PHOTO_COUNTS)[number]['key'];

// 4단계 포함 섹션
// 푸터에 보여줄 정보. 켜고 입력한 값만 푸터에 들어간다. (끄면 입력 칸이 사라지고 값도 비운다.)
export const FOOTER_ADDRESS_MAX = 60;
export const FOOTER_PHONE_MAX = 20;
export const FOOTER_HOURS_MAX = 40;

// 켰는데 비워 둔 항목은 초안 푸터에 이 문구로 자리를 잡아 준다. (템플릿 샘플 문구와 같은 방식)
// SNS 링크는 푸터가 올바른 링크만 그리므로 대체 문구를 넣을 수 없다. 켜고 비우면 푸터에 아무것도 나오지 않는다.
// TODO: 초안을 만들 때(AI 생성 작업) 이 문구를 푸터 내용에 넣는다.
export const FOOTER_PLACEHOLDERS = {
   address: '가게 주소를 입력해 주세요',
   phone: '전화번호를 입력해 주세요',
   hours: '영업시간을 입력해 주세요',
} as const;

// 강조 특징. 히어로 뱃지로 보여 준다. 프리셋과 직접 입력한 것을 합쳐 최대 3개이다.
export const HIGHLIGHT_PRESETS = [
   { key: 'takeout', label: '포장·배달 가능' },
   { key: 'parking', label: '주차 가능' },
   { key: 'pets', label: '반려동물 동반' },
   { key: 'reservation', label: '예약 가능' },
   { key: 'group', label: '단체석' },
   { key: 'wifi', label: '와이파이' },
] as const;

export type HighlightKey = (typeof HIGHLIGHT_PRESETS)[number]['key'];

export const MAX_HIGHLIGHTS = 3;
export const HIGHLIGHT_CUSTOM_MAX = 12;
