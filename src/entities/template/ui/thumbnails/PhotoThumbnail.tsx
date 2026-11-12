import { PHOTO_TEMPLATE } from '../../model/photo';
import { Col, Dot, Line, Pic, Row, ThumbFrame } from './parts';

// 감각적인 포토형 미리보기: 헤더, 전면 사진 히어로, 대표 사진과 작은 사진들, 짧은 글과 사진.
export function PhotoThumbnail() {
   return (
      <ThumbFrame theme={PHOTO_TEMPLATE.content.theme}>
         <Row className="justify-between">
            <Row>
               <Dot />
               <Line kind="title" width="34px" />
            </Row>
            <Line width="40px" />
         </Row>
         <div
            className="flex h-14 shrink-0 flex-col items-center justify-center gap-1"
            style={{
               borderRadius: 'var(--t-radius)',
               background: 'linear-gradient(135deg, #6b7280, #3f3f46)',
            }}
         >
            <span className="block h-1.5 rounded-sm bg-white" style={{ width: '50%' }} />
            <span
               className="block h-1 rounded-sm"
               style={{ width: '34%', background: 'rgba(255, 255, 255, 0.6)' }}
            />
         </div>
         <Col>
            <Pic className="h-6" />
            <Row>
               <Pic className="h-3.5 flex-1" />
               <Pic className="h-3.5 flex-1" />
               <Pic className="h-3.5 flex-1" />
               <Pic className="h-3.5 flex-1" />
            </Row>
         </Col>
         <Row>
            <Col className="min-w-0 flex-1">
               <Line kind="title" width="50%" />
               <Line kind="muted" width="80%" />
            </Col>
            <Pic className="h-5 shrink-0" style={{ flexBasis: '34%' }} />
         </Row>
      </ThumbFrame>
   );
}
