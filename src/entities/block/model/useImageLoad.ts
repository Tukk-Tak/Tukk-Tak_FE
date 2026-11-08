import { useEffect, useRef, useState } from 'react';

// SVG는 크기 정보가 없으면 정상 이미지도 naturalWidth가 0이라, 이 방식으로 실패 여부를 가리지 않는다.
const isSvg = (url: string) => /\.svg(\?|#|$)/i.test(url) || url.startsWith('data:image/svg');

// 이미지를 불러오지 못했는지 알려 준다. 주소가 비어 있는 경우도 불러오지 못한 것으로 본다.
// 실패한 주소를 기억하므로, 같은 자리의 이미지가 다른 주소로 바뀌면 다시 시도한다.
export function useImageLoad(url: string) {
   const [failedUrl, setFailedUrl] = useState<string | null>(null);
   const imgRef = useRef<HTMLImageElement>(null);

   useEffect(() => {
      const img = imgRef.current;
      // 서버에서 그려진 이미지가 화면이 살아나기(하이드레이션) 전에 이미 실패했다면 onError를 놓치므로 한 번 확인한다.
      if (img?.complete && img.naturalWidth === 0 && !isSvg(url)) setFailedUrl(url);
   }, [url]);

   return {
      failed: url.trim() === '' || failedUrl === url,
      imgRef,
      onError: () => setFailedUrl(url),
   };
}
