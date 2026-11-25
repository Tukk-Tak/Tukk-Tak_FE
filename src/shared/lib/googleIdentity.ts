// 구글 로그인(Google Identity Services)을 불러오고 초기화한다.
// 구글이 그려 주는 로그인 버튼을 누르면 구글 계정 선택 창이 뜨고, 선택을 마치면 ID 토큰(credential)을 콜백으로 준다.
// 이 토큰을 백엔드(POST /auth/google)로 보내면 서버가 구글에 확인하고 로그인·가입 여부를 알려 준다.
// 구글은 허용 출처(Authorized JavaScript origins)에 등록된 https 도메인이나 localhost에서만 동작한다.

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

// 쓰는 부분만 적은 타입이다. (구글 스크립트가 window.google에 붙인다.)
interface GoogleCredentialResponse {
   credential?: string;
}

interface GoogleButtonOptions {
   type: 'standard';
   theme: 'outline';
   size: 'large';
   text: 'continue_with';
   shape: 'rectangular';
   logo_alignment: 'center';
   width: number;
   locale: 'ko';
}

interface GoogleIdentity {
   accounts: {
      id: {
         initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
         }) => void;
         renderButton: (parent: HTMLElement, options: GoogleButtonOptions) => void;
      };
   };
}

declare global {
   interface Window {
      google?: GoogleIdentity;
   }
}

let loading: Promise<GoogleIdentity> | null = null;

// 구글 스크립트를 한 번만 불러온다. 이미 불러왔다면 바로 돌려주고, 실패하면 다음에 다시 시도할 수 있게 비워 둔다.
export function loadGoogleIdentity(): Promise<GoogleIdentity> {
   if (window.google?.accounts?.id) return Promise.resolve(window.google);
   if (loading) return loading;

   loading = new Promise<GoogleIdentity>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => {
         if (window.google?.accounts?.id) resolve(window.google);
         else {
            loading = null;
            reject(new Error('구글 로그인 스크립트를 읽지 못했어요'));
         }
      };
      script.onerror = () => {
         loading = null;
         reject(new Error('구글 로그인 스크립트를 불러오지 못했어요'));
      };
      document.head.appendChild(script);
   });
   return loading;
}

// 구글은 초기화(initialize)를 여러 번 하면 경고하므로 한 번만 하고, 받은 토큰은 지금 화면이 등록한 함수로 넘긴다.
let initialized = false;
let credentialHandler: ((credential: string) => void) | null = null;

export function setGoogleCredentialHandler(handler: ((credential: string) => void) | null) {
   credentialHandler = handler;
}

// 구글 버튼이 그려지는 크기. 구글이 정한 최대값이라 이보다 크게는 그릴 수 없다. (size: 'large'가 가장 큰 크기다.)
// 화면에 보이는 버튼은 시안 모양을 따로 그리고, 구글 버튼은 투명하게 그 위에 늘려 겹치므로 이 크기를 기준으로 배율을 계산한다.
export const GOOGLE_BUTTON_WIDTH = 400;
export const GOOGLE_BUTTON_HEIGHT = 40;

export function renderGoogleButton(google: GoogleIdentity, parent: HTMLElement) {
   if (!initialized) {
      google.accounts.id.initialize({
         client_id: GOOGLE_CLIENT_ID,
         callback: ({ credential }) => {
            if (credential) credentialHandler?.(credential);
         },
      });
      initialized = true;
   }

   google.accounts.id.renderButton(parent, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      logo_alignment: 'center',
      width: GOOGLE_BUTTON_WIDTH,
      locale: 'ko',
   });
}
