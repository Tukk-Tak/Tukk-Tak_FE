import { MENU_TEMPLATE } from '../../model/menu';
import { Col, Dot, Line, Pic, Pill, Row, ThumbFrame } from './parts';

// 깔끔한 메뉴형 미리보기: 가운데 정렬 헤더, 텍스트 히어로, 메뉴 행, 반폭 목록 2개.
export function MenuThumbnail() {
   return (
      <ThumbFrame theme={MENU_TEMPLATE.content.theme}>
         <Col className="items-center">
            <Dot />
            <Line kind="title" width="40px" />
         </Col>
         <Col
            className="items-center p-2"
            style={{
               borderRadius: 'var(--t-radius)',
               background: 'color-mix(in srgb, var(--t-text) 6%, transparent)',
            }}
         >
            <Line kind="title" width="70%" />
            <Line kind="muted" width="50%" />
            <Row>
               <Pill />
               <Pill />
            </Row>
         </Col>
         <Col>
            {[0, 1, 2].map((index) => (
               <Row key={index}>
                  <Pic className="size-3.5 shrink-0" />
                  <span className="min-w-0 flex-1">
                     <Line width="100%" />
                  </span>
                  <Line kind="muted" width="18px" />
               </Row>
            ))}
         </Col>
         <Row className="items-start">
            {[0, 1].map((index) => (
               <Col key={index} className="min-w-0 flex-1">
                  <Line kind="title" width="50%" />
                  <Row>
                     <Pic className="h-4 flex-1" />
                     <Pic className="h-4 flex-1" />
                  </Row>
               </Col>
            ))}
         </Row>
      </ThumbFrame>
   );
}
