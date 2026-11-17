import { COZY_TEMPLATE } from '../../model/cozy';
import { Col, Dot, Line, Pic, Pill, Row, ThumbFrame } from './parts';

// 아늑한 기본형 미리보기: 헤더, 분할 히어로, 이야기, 사진 줄.
export function CozyThumbnail() {
   return (
      <ThumbFrame theme={COZY_TEMPLATE.content.theme}>
         <Row className="justify-between">
            <Row>
               <Dot />
               <Line kind="title" width="34px" />
            </Row>
            <Line width="40px" />
         </Row>
         <Row>
            <Col className="min-w-0 flex-1">
               <Line kind="title" width="85%" />
               <Line kind="title" width="60%" />
               <Line kind="muted" width="70%" />
               <Row>
                  <Pill />
                  <Pill />
               </Row>
            </Col>
            <Pic className="h-11 shrink-0" style={{ flexBasis: '42%' }} />
         </Row>
         <Row>
            <Pic className="h-8 shrink-0" style={{ flexBasis: '40%' }} />
            <Col className="min-w-0 flex-1">
               <Line kind="title" width="60%" />
               <Line kind="muted" width="90%" />
               <Line kind="muted" width="70%" />
            </Col>
         </Row>
         <Row>
            <Pic className="h-6 flex-1" />
            <Pic className="h-6 flex-1" />
            <Pic className="h-6 flex-1" />
            <Pic className="h-6 flex-1" />
         </Row>
      </ThumbFrame>
   );
}
