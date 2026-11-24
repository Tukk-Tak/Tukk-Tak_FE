import { useEffect, useRef, useState } from 'react';
import type { SignupPayloadBase, StoreValues } from '../types';
import { useBusinessVerify } from './useBusinessVerify';
import { useNicknameCheck } from './useNicknameCheck';
import {
   getStoreStepErrors,
   hasBusinessInput,
   hasStoreInfoInput,
   isValidBusinessNumber,
   onlyDigits,
} from './validation';

const EMPTY_VALUES: StoreValues = {
   name: '',
   nickname: '',
   phone: '',
   businessNumber: '',
   openDate: '',
   storeAddress: '',
   storePhone: '',
   agreed: false,
};

type Touched = Partial<Record<keyof StoreValues, boolean>>;

// 가입을 요청한 시점의 닉네임·사업자 입력. 가입 요청이 오래 걸리는 동안 입력을 고칠 수 있으므로,
// 늦게 도착한 실패 응답이 고친 입력에 적용되지 않게 "지금 입력이 그때와 같은지" 비교하는 데 쓴다.
export interface SubmittedInputs {
   nickname: string;
   name: string;
   businessNumber: string;
   openDate: string;
}

interface UseStoreFormOptions {
   // 구글 가입처럼 이름을 미리 채워 두는 경우
   initialName?: string;
   // 입력을 고칠 때마다 호출한다. (직전 제출의 오류 문구를 지우는 데 쓴다.)
   onEdit?: () => void;
}

// 가게 정보 입력(이름~동의)의 상태와 검증. 이메일 가입의 2단계와 구글 가입이 함께 쓴다.
export function useStoreForm({ initialName = '', onEdit }: UseStoreFormOptions = {}) {
   const [values, setValues] = useState<StoreValues>({ ...EMPTY_VALUES, name: initialName });
   const [touched, setTouched] = useState<Touched>({});

   const nicknameCheck = useNicknameCheck();
   const businessVerify = useBusinessVerify();

   // 비동기 응답이 도착했을 때 가장 최근 입력을 읽기 위한 참조. (응답을 처리하는 함수는 요청 당시 화면의 값을 들고 있어서 낡았다.)
   const latestValuesRef = useRef(values);
   useEffect(() => {
      latestValuesRef.current = values;
   });

   const errors = getStoreStepErrors(values);
   // 입력 칸을 벗어난 뒤에야 오류를 보여준다. (입력 도중에는 아직 쓰는 중이므로)
   const showError = (key: keyof StoreValues) => (touched[key] ? errors[key] : undefined);

   const setValue = (patch: Partial<StoreValues>) => {
      setValues((prev) => ({ ...prev, ...patch }));
      onEdit?.();
   };
   const touch = (...keys: Array<keyof StoreValues>) =>
      setTouched((prev) => ({ ...prev, ...Object.fromEntries(keys.map((key) => [key, true])) }));

   const trimmedName = values.name.trim();
   const businessVerified = businessVerify.status === 'verified';
   const canVerifyBusiness =
      trimmedName !== '' &&
      isValidBusinessNumber(values.businessNumber) &&
      !errors.openDate &&
      values.openDate !== '';

   // 사업자 인증은 선택이지만, 입력을 시작했다면 인증까지 마쳐야 한다.
   const businessReady = !hasBusinessInput(values) || businessVerified;
   const hasStoreInfoErrors = Boolean(errors.storeAddress || errors.storePhone);
   const isValid =
      !errors.name &&
      !errors.nickname &&
      !errors.phone &&
      nicknameCheck.status === 'available' &&
      businessReady &&
      !hasStoreInfoErrors &&
      values.agreed;

   // 한글 입력 조합이 끝날 때처럼 같은 값으로 다시 호출되는 경우를 걸러낸다.
   const hasChanged = (patch: Partial<StoreValues>) =>
      Object.entries(patch).some(([key, value]) => values[key as keyof StoreValues] !== value);

   const handleNameChange = (name: string) => {
      setValue({ name });
      // 대표자명(=이름)이 바뀌면 이전 사업자 인증 결과는 무효다.
      // 인증 요청이 진행 중일 때(status가 아직 idle)도 그 응답을 무효로 만들어야 하므로 상태와 상관없이 호출한다.
      if (hasChanged({ name })) businessVerify.reset();
   };

   const handleNicknameChange = (nickname: string) => {
      setValue({ nickname });
      // 같은 값으로 다시 호출되는 경우에는 확인 결과를 지우지 않는다.
      if (hasChanged({ nickname })) nicknameCheck.reset();
   };

   const handleBusinessChange = (patch: Partial<StoreValues>) => {
      setValue(patch);
      if (hasChanged(patch)) businessVerify.reset();
   };

   const handleVerifyBusiness = () =>
      businessVerify.verify({
         businessNumber: onlyDigits(values.businessNumber),
         openDate: values.openDate,
         representativeName: trimmedName,
      });

   // 가입 방식(이메일/구글)에 상관없이 같은 부분의 요청 내용
   const buildPayloadBase = (): SignupPayloadBase => ({
      name: trimmedName,
      nickname: values.nickname,
      phone: values.phone,
      // 사업자 번호와 개업일자는 인증 때 서버에 이미 보냈으므로, 가입에는 인증 결과로 받은 토큰만 보낸다.
      businessToken: businessVerified ? (businessVerify.token ?? undefined) : undefined,
      store: hasStoreInfoInput(values)
         ? { address: values.storeAddress.trim(), phone: values.storePhone }
         : undefined,
      agreedToTerms: true,
   });

   // 가입을 요청하기 직전에 부른다. 돌려준 값을 아래 두 함수에 그대로 넘긴다.
   const snapshotInputs = (): SubmittedInputs => ({
      nickname: values.nickname,
      name: trimmedName,
      businessNumber: values.businessNumber,
      openDate: values.openDate,
   });

   // 가입 요청이 "이미 쓰는 닉네임"이라고 돌아왔을 때, 요청한 닉네임이 지금도 입력칸의 값일 때만 "사용 불가"로 바꾼다.
   // 그 사이에 닉네임을 고쳤다면 이 실패는 옛 닉네임의 것이라서 무시한다. (고친 닉네임의 확인 결과를 지우지 않는다.)
   const rejectNickname = (submitted: SubmittedInputs, reason: string) => {
      if (latestValuesRef.current.nickname === submitted.nickname) nicknameCheck.reject(reason);
   };

   // 가입 요청이 사업자 인증 때문에 거절됐을 때, 인증에 쓴 값(이름, 사업자 번호, 개업일자)이 지금도 같을 때만 실패로 바꾼다.
   // 그 사이에 고쳤다면 이 실패는 옛 입력의 것이라서 무시한다.
   const failBusiness = (submitted: SubmittedInputs, reason: string) => {
      const latest = latestValuesRef.current;
      const unchanged =
         latest.name.trim() === submitted.name &&
         latest.businessNumber === submitted.businessNumber &&
         latest.openDate === submitted.openDate;
      if (unchanged) businessVerify.fail(reason);
   };

   return {
      values,
      errors,
      touched,
      showError,
      setValue,
      touch,
      nicknameCheck,
      businessVerify,
      canVerifyBusiness,
      isValid,
      handleNameChange,
      handleNicknameChange,
      handleBusinessChange,
      handleVerifyBusiness,
      buildPayloadBase,
      snapshotInputs,
      rejectNickname,
      failBusiness,
   };
}

export type StoreFormState = ReturnType<typeof useStoreForm>;
