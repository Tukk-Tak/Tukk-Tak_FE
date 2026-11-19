import type { ReactNode } from 'react';
import type { BlockType } from '../types';

// 블록 추가와 구조 선택 화면에 쓰는 썸네일. 실제 블록의 배치를 단순한 도형으로 그린 와이어프레임이고, 3:2 비율이다.
// 이미지 자리는 상자 안의 X 표시, 글은 막대, 버튼은 주황 알약으로 나타낸다.
const C = {
   bg: '#F6EFE8',
   img: '#E2D8CC',
   imgDark: '#C9BCAD',
   icon: '#CBBFB1',
   strong: '#B5A798',
   light: '#D9CFC2',
   accent: '#E8622C',
   card: '#FFFFFF',
   line: '#EAD8C2',
};

interface Box {
   x: number;
   y: number;
   w: number;
   h?: number;
}

function Bar({ x, y, w, h = 3, fill = C.light }: Box & { fill?: string }) {
   return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />;
}

function Pill({ x, y, w, h = 6 }: Box) {
   return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={C.accent} />;
}

function Outline({ x, y, w, h = 6 }: Box) {
   return (
      <rect
         x={x}
         y={y}
         width={w}
         height={h}
         rx={3}
         fill="none"
         stroke={C.strong}
         strokeWidth={0.8}
      />
   );
}

function Card({ x, y, w, h = 0 }: Box) {
   return (
      <rect
         x={x}
         y={y}
         width={w}
         height={h}
         rx={3}
         fill={C.card}
         stroke={C.line}
         strokeWidth={0.8}
      />
   );
}

function Rule({ x, y, w }: Box) {
   return <rect x={x} y={y} width={w} height={0.8} fill={C.line} />;
}

function Img({ x, y, w, h = 0, fill = C.img }: Box & { fill?: string }) {
   const cx = x + w / 2;
   const cy = y + h / 2;
   const d = Math.min(w, h) * 0.18;
   return (
      <>
         <rect x={x} y={y} width={w} height={h} rx={2} fill={fill} />
         {w >= 10 && h >= 8 && (
            <path
               d={`M${cx - d} ${cy - d} L${cx + d} ${cy + d} M${cx + d} ${cy - d} L${cx - d} ${cy + d}`}
               stroke={C.icon}
               strokeWidth={1.2}
               strokeLinecap="round"
               fill="none"
            />
         )}
      </>
   );
}

const DRAWINGS: Record<string, () => ReactNode> = {
   'header/horizontal': () => (
      <>
         <circle cx={16} cy={30} r={6} fill={C.strong} />
         <Bar x={27} y={27} w={36} h={6} fill={C.strong} />
         <Rule x={8} y={44} w={104} />
      </>
   ),
   'header/centered': () => (
      <>
         <circle cx={60} cy={24} r={6} fill={C.strong} />
         <Bar x={44} y={36} w={32} h={6} fill={C.strong} />
         <Rule x={8} y={52} w={104} />
      </>
   ),

   'hero/fullImage': () => (
      <>
         <Img x={6} y={8} w={108} h={64} fill={C.imgDark} />
         <Bar x={26} y={30} w={68} h={7} fill="#FFFFFF" />
         <Bar x={38} y={42} w={44} h={3.5} fill="#F4EEE7" />
         <Pill x={48} y={52} w={24} h={7} />
      </>
   ),
   'hero/split': () => (
      <>
         <Bar x={10} y={20} w={46} h={7} fill={C.strong} />
         <Bar x={10} y={32} w={38} h={3.5} />
         <Bar x={10} y={38} w={32} h={3.5} />
         <Pill x={10} y={48} w={22} h={7} />
         <Img x={64} y={12} w={48} h={56} />
      </>
   ),
   'hero/textOnly': () => (
      <>
         <Bar x={24} y={20} w={72} h={7} fill={C.strong} />
         <Bar x={34} y={33} w={52} h={3.5} />
         <Pill x={46} y={44} w={28} h={7} />
         <Outline x={32} y={58} w={24} />
         <Outline x={64} y={58} w={24} />
      </>
   ),

   'text/single': () => (
      <>
         <Bar x={12} y={14} w={40} h={6} fill={C.strong} />
         <Bar x={12} y={28} w={96} />
         <Bar x={12} y={36} w={96} />
         <Bar x={12} y={44} w={96} />
         <Bar x={12} y={52} w={62} />
      </>
   ),
   'text/withImage': () => (
      <>
         <Img x={10} y={12} w={44} h={56} />
         <Bar x={62} y={20} w={38} h={6} fill={C.strong} />
         <Bar x={62} y={34} w={48} />
         <Bar x={62} y={42} w={48} />
         <Bar x={62} y={50} w={34} />
      </>
   ),

   'list/card': () => (
      <>
         <Bar x={8} y={6} w={30} h={4} fill={C.strong} />
         {[0, 1, 2, 3].map((i) => {
            const x = 8 + i * 27;
            return (
               <g key={i}>
                  <Card x={x} y={16} w={24} h={58} />
                  <Img x={x + 2} y={18} w={20} h={26} />
                  <Bar x={x + 2} y={48} w={15} fill={C.strong} />
                  <Bar x={x + 2} y={54} w={11} />
                  <Bar x={x + 2} y={62} w={13} fill={C.strong} />
               </g>
            );
         })}
      </>
   ),
   'list/row': () => (
      <>
         <Bar x={8} y={6} w={30} h={4} fill={C.strong} />
         {[0, 1, 2].map((i) => {
            const y = 16 + i * 21;
            return (
               <g key={i}>
                  <Img x={8} y={y} w={15} h={15} />
                  <Bar x={29} y={y + 3} w={36} h={3.5} fill={C.strong} />
                  <Bar x={29} y={y + 9} w={26} />
                  <Bar x={88} y={y + 5} w={24} h={3.5} fill={C.strong} />
                  {i < 2 && <Rule x={8} y={y + 18} w={104} />}
               </g>
            );
         })}
      </>
   ),
   'list/compact': () => (
      <>
         <Bar x={8} y={6} w={30} h={4} fill={C.strong} />
         {[0, 1].flatMap((row) =>
            [0, 1, 2, 3].map((i) => {
               const x = 8 + i * 27;
               const y = 18 + row * 28;
               return (
                  <g key={`${row}-${i}`}>
                     <Card x={x} y={y} w={24} h={24} />
                     <Bar x={x + 3} y={y + 6} w={16} h={3.5} fill={C.strong} />
                     <Bar x={x + 3} y={y + 14} w={11} />
                  </g>
               );
            }),
         )}
      </>
   ),
   'list/zigzag': () => (
      <>
         <Img x={8} y={8} w={46} h={30} />
         <Bar x={62} y={14} w={36} h={4} fill={C.strong} />
         <Bar x={62} y={23} w={44} />
         <Bar x={62} y={29} w={30} />
         <Bar x={10} y={52} w={36} h={4} fill={C.strong} />
         <Bar x={10} y={61} w={44} />
         <Bar x={10} y={67} w={30} />
         <Img x={66} y={44} w={46} h={28} />
      </>
   ),

   'gallery/grid': () => (
      <>
         {[0, 1].flatMap((row) =>
            [0, 1, 2].map((i) => (
               <Img key={`${row}-${i}`} x={8 + i * 37} y={8 + row * 33} w={34} h={30} />
            )),
         )}
      </>
   ),
   'gallery/featured': () => (
      <>
         <Img x={8} y={8} w={104} h={40} />
         <Img x={8} y={52} w={33} h={20} />
         <Img x={43.5} y={52} w={33} h={20} />
         <Img x={79} y={52} w={33} h={20} />
      </>
   ),
   'gallery/single': () => (
      <>
         <Card x={20} y={10} w={80} h={60} />
         <Img x={26} y={16} w={68} h={46} />
      </>
   ),

   'footer/simple': () => (
      <>
         <Rule x={8} y={14} w={104} />
         <Bar x={44} y={26} w={32} h={6} fill={C.strong} />
         <Bar x={22} y={40} w={76} />
         <Bar x={38} y={52} w={44} />
      </>
   ),
   'footer/info': () => (
      <>
         <Rule x={8} y={10} w={104} />
         <Bar x={10} y={20} w={26} h={5} fill={C.strong} />
         <Bar x={10} y={30} w={32} />
         <Bar x={46} y={20} w={18} h={3.5} fill={C.strong} />
         <Bar x={46} y={28} w={28} />
         <Bar x={46} y={34} w={24} />
         <Bar x={84} y={20} w={18} h={3.5} fill={C.strong} />
         <Bar x={84} y={28} w={26} />
         <Bar x={84} y={34} w={20} />
         <Rule x={8} y={56} w={104} />
         <Bar x={10} y={64} w={40} />
      </>
   ),
};

// 블록 종류를 대표하는 구조. 블록 추가 목록(종류 선택)에서 쓴다.
const REPRESENTATIVE_VARIANT: Record<BlockType, string> = {
   header: 'horizontal',
   hero: 'split',
   text: 'withImage',
   list: 'card',
   gallery: 'featured',
   footer: 'info',
};

interface BlockThumbnailProps {
   type: BlockType;
   // 없으면 그 종류를 대표하는 구조를 그린다.
   variant?: string;
   className?: string;
}

export function BlockThumbnail({ type, variant, className }: BlockThumbnailProps) {
   const draw = DRAWINGS[`${type}/${variant ?? REPRESENTATIVE_VARIANT[type]}`];

   return (
      <svg viewBox="0 0 120 80" className={className} aria-hidden>
         <rect width={120} height={80} rx={6} fill={C.bg} />
         {draw?.()}
      </svg>
   );
}
