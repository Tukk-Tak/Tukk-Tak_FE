'use client';

import { useImageLoad } from '../../model/useImageLoad';
import type { HeroContent } from '../../types';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { HeroText } from './HeroText';

// 전면 이미지형: 사진을 배경으로 깔고 가운데에 글을 올린다.
// 배경이라 프레임을 꽉 채우는 cover를 쓰고(일부가 잘릴 수 있음), 글이 읽히도록 어두운 막을 덧씌운다.
// 사진이 없거나 불러오지 못하면 모양(최소 높이, 가운데 정렬)은 그대로 두고 배경만 이미지 대체 화면으로 바꾼다.
// 이때는 옅은 배경 위라 어두운 막과 흰 글자 대신 사이트 글자색을 쓴다.
export function FullImageHero({ content }: { content: HeroContent }) {
   const { title, subtitle, image, badges } = content;
   const { failed, imgRef, onError } = useImageLoad(image?.url ?? '');

   return (
      <div className="relative flex min-h-70 items-center justify-center overflow-hidden rounded-site px-6 py-12 @2xl:min-h-90 @2xl:px-12">
         {failed ? (
            <div className="absolute inset-0">
               <ImagePlaceholder />
            </div>
         ) : (
            <>
               {/* 사용자가 올린 이미지의 호스트를 미리 알 수 없어 next/image 대신 img를 쓴다. */}
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img
                  ref={imgRef}
                  src={image?.url}
                  alt=""
                  onError={onError}
                  className="absolute inset-0 size-full object-cover"
               />
               <div aria-hidden className="absolute inset-0 bg-black/40" />
            </>
         )}
         <HeroText
            title={title}
            subtitle={subtitle}
            badges={badges}
            align="center"
            tone={failed ? 'default' : 'onImage'}
         />
      </div>
   );
}
