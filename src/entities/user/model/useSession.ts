import { useSyncExternalStore } from 'react';
import { getServerSnapshot, getSnapshot, subscribe } from './sessionStore';

// 현재 로그인 상태. status가 'loading'인 동안에는 로그인 여부를 아직 모른다.
export function useSession() {
   return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
