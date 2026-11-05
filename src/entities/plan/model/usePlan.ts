import { useSyncExternalStore } from 'react';
import { getServerSnapshot, getSnapshot, subscribe } from './planStore';

// 현재 이용 중인 플랜. status가 'loading'인 동안에는 아직 모른다.
export function usePlan() {
   return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
