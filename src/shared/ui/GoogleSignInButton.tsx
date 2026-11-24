'use client';

import { useEffect, useRef, useState } from 'react';
import {
   GOOGLE_BUTTON_HEIGHT,
   GOOGLE_BUTTON_WIDTH,
   GOOGLE_CLIENT_ID,
   loadGoogleIdentity,
   renderGoogleButton,
   setGoogleCredentialHandler,
} from '../lib/googleIdentity';
import { FieldMessage } from './FieldMessage';
import { GoogleButton } from './GoogleButton';

type Status = 'loading' | 'ready' | 'unavailable' | 'failed';

interface GoogleSignInButtonProps {
   // 구글 계정 선택을 마치면 구글이 준 ID 토큰(credential)과 함께 불린다.
   onCredential: (credential: string) => void;
   // 로그인·가입을 처리하는 동안 다시 누르지 못하게 막는다.
   disabled?: boolean;
}

// 구글 로그인 버튼. 눈에 보이는 것은 시안 모양의 버튼(GoogleButton)이고, 그 위에 구글이 그려 주는 공식 버튼을
// 투명하게 늘려서 겹쳐 둔다. 사용자가 누르는 것은 실제로는 투명한 구글 버튼이라서 구글 계정 선택 창이 그대로 뜬다.
// (구글 버튼은 가로 400px, 높이 40px보다 크게 그릴 수 없어서, 시안 크기에 맞추려고 이렇게 한다.)
// 구글 클라이언트 ID가 없거나 스크립트를 불러오지 못하면, 누를 수 없는 버튼과 안내를 보여 준다.
export function GoogleSignInButton({ onCredential, disabled = false }: GoogleSignInButtonProps) {
   const wrapperRef = useRef<HTMLDivElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const handlerRef = useRef(onCredential);
   // 클라이언트 ID가 없으면 스크립트를 불러올 필요가 없으므로 처음부터 "사용할 수 없음"이다.
   const [status, setStatus] = useState<Status>(GOOGLE_CLIENT_ID ? 'loading' : 'unavailable');
   // 투명한 구글 버튼을 시안 버튼 크기에 맞추는 배율
   const [scale, setScale] = useState({ x: 1, y: 1 });

   // 구글이 토큰을 줄 때는 항상 가장 최근에 넘겨받은 함수를 부른다. (화면이 다시 그려져도 버튼을 다시 만들지 않는다.)
   useEffect(() => {
      handlerRef.current = onCredential;
   });

   useEffect(() => {
      if (!GOOGLE_CLIENT_ID) {
         // 설정을 비워 둔 개발 환경에서는 흔한 일이라, 개발 화면의 오류 표시(Issue)가 뜨지 않게 경고로만 남긴다.
         console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID 가 설정되지 않아 구글 로그인을 쓸 수 없어요.');
         return;
      }

      let cancelled = false;
      loadGoogleIdentity()
         .then((google) => {
            const container = containerRef.current;
            if (cancelled || !container) return;
            setGoogleCredentialHandler((credential) => handlerRef.current(credential));
            renderGoogleButton(google, container);
            setStatus('ready');
         })
         .catch(() => {
            if (!cancelled) setStatus('failed');
         });

      return () => {
         cancelled = true;
         setGoogleCredentialHandler(null);
      };
   }, []);

   // 시안 버튼의 크기(화면 폭에 따라 달라진다)에 맞춰 투명한 구글 버튼의 배율을 다시 계산한다.
   useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const update = () =>
         setScale({
            x: wrapper.clientWidth / GOOGLE_BUTTON_WIDTH,
            y: wrapper.clientHeight / GOOGLE_BUTTON_HEIGHT,
         });
      update();
      const observer = new ResizeObserver(update);
      observer.observe(wrapper);
      return () => observer.disconnect();
   }, [status]);

   if (status === 'unavailable' || status === 'failed') {
      return (
         <div>
            <GoogleButton disabled />
            <FieldMessage tone="error" className="mt-3 text-center">
               {status === 'unavailable'
                  ? '구글 로그인은 준비 중이에요'
                  : '구글 연결에 실패했어요. 잠시 후 다시 시도해주세요'}
            </FieldMessage>
         </div>
      );
   }

   // 구글 버튼이 나타나기 전이나 처리 중에는 눌러도 아무 일이 없으므로, 시안 버튼도 눌 수 없는 모양으로 보여 준다.
   const interactive = status === 'ready' && !disabled;

   return (
      <div ref={wrapperRef} className="group relative">
         {/* 눈에 보이는 시안 버튼. 구글 버튼이 위를 덮고 있어서 직접 눌리지 않으므로, 마우스를 올리거나 키보드로 이동했을 때의 모양은
             겹쳐진 구글 버튼이 들어 있는 이 바깥 요소(group)의 상태를 따라간다. */}
         <GoogleButton
            aria-hidden
            tabIndex={-1}
            disabled={!interactive}
            className={
               interactive
                  ? 'group-hover:bg-brand-orange-light/40 group-focus-within:ring-2 group-focus-within:ring-brand-orange/50'
                  : ''
            }
         />
         {/* 투명한 구글 버튼. 시안 버튼과 같은 자리를 덮고, 처리 중에는 눌리지 않게 한다. */}
         <div
            className={`absolute inset-0 overflow-hidden rounded-lg opacity-[0.01] ${
               interactive ? '' : 'pointer-events-none'
            }`}
         >
            <div
               ref={containerRef}
               style={{
                  width: GOOGLE_BUTTON_WIDTH,
                  height: GOOGLE_BUTTON_HEIGHT,
                  transform: `scale(${scale.x}, ${scale.y})`,
                  transformOrigin: 'top left',
               }}
            />
         </div>
      </div>
   );
}
