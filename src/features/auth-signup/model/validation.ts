import type { StoreValues } from '../types';

// 서버 검증 규칙이 확정되면 이 파일의 규칙만 맞춰서 바꾼다.

export const onlyDigits = (value: string) => value.replace(/\D/g, '');

// 이메일 형식 검사(isValidEmail)는 로그인과 함께 쓰므로 shared/lib에 있다.

// 비밀번호 규칙은 재설정과 함께 쓰므로 shared/lib/passwordRules에 있다.

// ── 전화번호 ──
const MOBILE_PATTERN = /^01[016789]\d{7,8}$/;
const PHONE_PATTERN = /^0\d{8,10}$/;

export const isValidMobilePhone = (value: string) => MOBILE_PATTERN.test(onlyDigits(value));
export const isValidPhone = (value: string) => PHONE_PATTERN.test(onlyDigits(value));

// 입력하는 동안에는 숫자와 하이픈만 허용한다. (하이픈은 입력 칸을 벗어날 때 자리수에 맞게 넣는다.)
export const sanitizePhoneInput = (value: string) => value.replace(/[^\d-]/g, '').slice(0, 13);

// 입력 중에는 자리수가 정해지지 않아 하이픈 위치가 모호하므로, 완성된 번호일 때만 맞춰서 바꾼다.
export function formatPhone(value: string) {
   const digits = onlyDigits(value);
   if (digits.length < 9) return value;

   if (digits.startsWith('02')) {
      return digits.length === 9
         ? `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`
         : `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6)}`;
   }
   return digits.length === 10
      ? `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
      : `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

// ── 사업자 등록번호, 개업일자 ──
// 사업자 등록번호: 000-00-00000
export function formatBusinessNumber(value: string) {
   const digits = onlyDigits(value).slice(0, 10);
   return [digits.slice(0, 3), digits.slice(3, 5), digits.slice(5)].filter(Boolean).join('-');
}

export const isValidBusinessNumber = (value: string) => onlyDigits(value).length === 10;

function todayString() {
   const now = new Date();
   const month = String(now.getMonth() + 1).padStart(2, '0');
   const day = String(now.getDate()).padStart(2, '0');
   return `${now.getFullYear()}-${month}-${day}`;
}

export function isValidOpenDate(value: string) {
   if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

   const date = new Date(`${value}T00:00:00`);
   if (Number.isNaN(date.getTime())) return false;
   // Date는 2023-02-30 같은 날짜를 3월 2일로 자동 보정하므로, 입력한 연·월·일과 같은지 다시 확인한다.
   const [year, month, day] = value.split('-').map(Number);
   if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
      return false;
   }
   // 같은 형식의 문자열은 사전순 비교가 곧 날짜순 비교다. 미래 날짜는 개업일자가 될 수 없다.
   return value >= '1900-01-01' && value <= todayString();
}

// ── 닉네임 / 사업장명 ──
const NICKNAME_MAX_LENGTH = 15;

export function getNicknameError(nickname: string) {
   if (!nickname.trim()) return '닉네임 / 사업장명을 입력해주세요';
   if (/\s/.test(nickname) || nickname.length > NICKNAME_MAX_LENGTH) {
      return '공백 없이 15자 이내로 입력해주세요';
   }
   return undefined;
}

// ── 2단계 입력값 전체 ──
export type StoreErrors = Partial<Record<keyof StoreValues, string>>;

// 사업자 인증과 업장 정보는 선택이지만, 하나라도 입력했다면 나머지도 필수가 된다.
export const hasBusinessInput = (values: StoreValues) =>
   Boolean(values.businessNumber || values.openDate);
export const hasStoreInfoInput = (values: StoreValues) =>
   Boolean(values.storeAddress.trim() || values.storePhone.trim());

export function getStoreStepErrors(values: StoreValues): StoreErrors {
   const errors: StoreErrors = {};

   if (!values.name.trim()) errors.name = '이름을 입력해주세요';

   const nicknameError = getNicknameError(values.nickname);
   if (nicknameError) errors.nickname = nicknameError;

   if (!values.phone.trim()) errors.phone = '전화번호를 입력해주세요';
   else if (!isValidMobilePhone(values.phone)) errors.phone = '전화번호 형식이 맞지 않아요';

   if (hasBusinessInput(values)) {
      if (!values.businessNumber) errors.businessNumber = '사업자 등록번호를 입력해주세요';
      else if (!isValidBusinessNumber(values.businessNumber)) {
         errors.businessNumber = '사업자 등록번호 10자리를 입력해주세요';
      }

      if (!values.openDate) errors.openDate = '개업일자를 입력해주세요';
      else if (!isValidOpenDate(values.openDate))
         errors.openDate = '올바른 개업일자를 입력해주세요';
   }

   if (hasStoreInfoInput(values)) {
      if (!values.storeAddress.trim()) errors.storeAddress = '업장 주소를 입력해주세요';

      if (!values.storePhone.trim()) errors.storePhone = '업장 전화번호를 입력해주세요';
      else if (!isValidPhone(values.storePhone)) errors.storePhone = '전화번호 형식이 맞지 않아요';
   }

   return errors;
}
