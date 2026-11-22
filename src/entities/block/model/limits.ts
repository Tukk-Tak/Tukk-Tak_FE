// 블록 내용의 글자 수와 개수 제한. 에디터 입력창의 maxLength와 개수 제한에 쓰고, 서버도 같은 기준으로 검증해야 한다.
// 값은 팀과 정한 제안값이고, 서버와 정한 뒤 바뀔 수 있다.
export const BLOCK_LIMITS = {
   headerBrandName: 20,

   heroTitle: 30,
   heroSubtitle: 100,
   heroBadgeCount: 3,
   heroBadge: 12,

   textTitle: 30,
   textBody: 1000,

   listTitle: 20,
   listItemCount: 30,
   itemName: 20,
   itemDescription: 40,
   itemPrice: 12,

   galleryImageCount: 12,

   footerBrandName: 20,
   footerAddress: 60,
   footerPhone: 20,
   footerHours: 40,
   footerSocialCount: 5,
   footerSocialUrl: 200,
   footerCopyright: 40,
   footerEmail: 50,
   footerRepresentative: 20,
   // 사업자등록번호는 숫자 10자리이고 000-00-00000 형태로 보여 준다.
   footerRegistrationDigits: 10,
} as const;

// 사진 크기(scale) 조절 범위. 1이 사진 전체가 보이는 기본 상태이고, 더 키우면 가운데 부분이 확대된다.
export const IMAGE_SCALE = { min: 1, max: 2, step: 0.05 } as const;

// 올릴 수 있는 사진 형식. AI 초안의 참고 이미지와 같다.
// TODO: 파일 크기 제한은 백엔드와 정해서 채운다. (지금은 형식만 검사한다.)
export const BLOCK_IMAGE_TYPES = ['image/png', 'image/jpeg'] as const;
