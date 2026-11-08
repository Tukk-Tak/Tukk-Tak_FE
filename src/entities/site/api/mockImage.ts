// 목업용 이미지. 네트워크 없이 보이도록 data URI로 만든 3:2 가로형 회색 X 박스이다.
const SVG =
   '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">' +
   '<rect width="600" height="400" fill="#e5e7eb"/>' +
   '<path d="M0 0L600 400M600 0L0 400" stroke="#cbd5e1" stroke-width="4"/></svg>';

export const MOCK_IMAGE_URL = `data:image/svg+xml;utf8,${encodeURIComponent(SVG)}`;
