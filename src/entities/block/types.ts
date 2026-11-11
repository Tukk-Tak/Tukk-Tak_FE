// 블록 명세(block-spec.md) 기준 타입. 백엔드와 스키마를 맞추는 중이라 확정 전 값은 바뀔 수 있다.

// DOM의 전역 Image와 이름이 겹치지 않도록 BlockImage로 쓴다.
export interface BlockImage {
   url: string;
   scale?: number; // 고정 프레임 안에서의 확대·축소 비율. 기본 1
}

// ── 헤더 ──
export type HeaderVariant = 'horizontal' | 'centered';

export interface HeaderContent {
   brandName: string;
   logo?: BlockImage;
}

// ── 히어로 ──
export type HeroVariant = 'fullImage' | 'split' | 'textOnly';

export interface HeroContent {
   title: string;
   subtitle?: string;
   image?: BlockImage;
   badges?: string[];
}

// ── 줄글 ──
export type TextVariant = 'single' | 'withImage';

export interface TextContent {
   title?: string;
   body: string;
   image?: BlockImage;
}

// ── 목록 ──
export type ListVariant = 'card' | 'row' | 'compact' | 'zigzag';

export interface ListItem {
   id: string;
   name: string;
   description?: string;
   price?: string; // 자유 텍스트("4,000원", "시가")
   image?: BlockImage;
}

export interface ListContent {
   title?: string;
   items: ListItem[];
}

// ── 갤러리 ──
export type GalleryVariant = 'grid' | 'featured' | 'single';

export interface GalleryContent {
   images: BlockImage[];
}

// ── 푸터 ──
export type FooterVariant = 'simple' | 'info';

export interface FooterContent {
   brandName: string;
   address?: string;
   phone?: string;
   hours?: string;
   social?: { kind: string; url: string }[];
   copyright?: string;
   email?: string; // info 전용
   businessInfo?: { representative?: string; registrationNumber?: string }; // info 전용
}

// 블록 한 개. type이 정해지면 variant와 content의 모양도 함께 정해진다.
interface SectionBase<T extends string, V extends string, C> {
   id: string;
   type: T;
   variant: V;
   content: C;
}

export type HeaderSection = SectionBase<'header', HeaderVariant, HeaderContent>;
export type HeroSection = SectionBase<'hero', HeroVariant, HeroContent>;
export type TextSection = SectionBase<'text', TextVariant, TextContent>;
export type ListSection = SectionBase<'list', ListVariant, ListContent>;
export type GallerySection = SectionBase<'gallery', GalleryVariant, GalleryContent>;
export type FooterSection = SectionBase<'footer', FooterVariant, FooterContent>;

export type Section =
   HeaderSection | HeroSection | TextSection | ListSection | GallerySection | FooterSection;

export type BlockType = Section['type'];
