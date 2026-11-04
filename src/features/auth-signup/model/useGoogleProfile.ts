import { useEffect, useState } from 'react';
import { getGoogleProfile } from '../api/getGoogleProfile';
import type { GoogleProfile } from '../types';

export type GoogleProfileState =
   { status: 'loading' } | { status: 'ready'; profile: GoogleProfile } | { status: 'failed' };

export function useGoogleProfile(): GoogleProfileState {
   const [state, setState] = useState<GoogleProfileState>({ status: 'loading' });

   useEffect(() => {
      let cancelled = false;

      getGoogleProfile()
         .then((profile) => {
            if (!cancelled) setState({ status: 'ready', profile });
         })
         .catch(() => {
            if (!cancelled) setState({ status: 'failed' });
         });

      return () => {
         cancelled = true;
      };
   }, []);

   return state;
}
