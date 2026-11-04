import { useState } from 'react';
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

   const handleNameChange = (name: string) => {
      setValue({ name });
      // 대표자명(=이름)이 바뀌면 이전 사업자 인증 결과는 무효다.
      if (businessVerify.status !== 'idle') businessVerify.reset();
   };

   const handleNicknameChange = (nickname: string) => {
      setValue({ nickname });
      // 한글 입력 조합이 끝날 때처럼 같은 값으로 다시 호출되는 경우에는 확인 결과를 지우지 않는다.
      if (nickname !== values.nickname) nicknameCheck.reset();
   };

   const handleBusinessChange = (patch: Partial<StoreValues>) => {
      setValue(patch);
      if (businessVerify.status !== 'idle') businessVerify.reset();
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
      business: businessVerified
         ? { businessNumber: onlyDigits(values.businessNumber), openDate: values.openDate }
         : undefined,
      store: hasStoreInfoInput(values)
         ? { address: values.storeAddress.trim(), phone: values.storePhone }
         : undefined,
      agreedToTerms: true,
   });

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
   };
}

export type StoreFormState = ReturnType<typeof useStoreForm>;
