'use client';

import { ArrowLeft } from 'lucide-react';
import {
   useEffect,
   useLayoutEffect,
   useRef,
   useState,
   type CSSProperties,
   type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import {
   BLOCK_TYPE_DESCRIPTION,
   BLOCK_TYPE_LABEL,
   BlockThumbnail,
   getBlockVariants,
   type BlockType,
} from '@/entities/block';
import { isPinnedType } from '@/features/editor-site';
import { ScrollArea } from '@/shared/ui/ScrollArea';

const BLOCK_TYPES: BlockType[] = ['header', 'hero', 'text', 'list', 'gallery', 'footer'];

interface AddBlockSheetProps {
   // 이미 사이트에 있는 블록 종류. 헤더와 푸터는 최대 1개라서 있으면 고를 수 없다.
   existingTypes: ReadonlySet<BlockType>;
   onAdd: (type: BlockType, variant: string) => void;
   // 시트를 열고 닫는 [+ 블록 추가] 버튼. 시트를 이 버튼 바로 위에 띄우고, 이 버튼을 누르는 것은 "시트 밖을 누름"으로 보지 않는다.
   triggerRef: RefObject<HTMLElement | null>;
   // escape: Esc 키로 닫음 / outside: 시트와 버튼 밖을 눌러 닫음
   onClose: (reason: 'escape' | 'outside') => void;
}

interface Position {
   left: number;
   width: number;
   // 화면 아래에서 시트 아래쪽까지의 거리. 버튼 위에 붙는다.
   bottom: number;
   // 버튼 위쪽에 남은 공간. 시트가 이보다 커지면 안에서 스크롤된다.
   maxHeight: number;
}

function Tag({ half }: { half: boolean }) {
   return (
      <span className="inline-block rounded px-1.5 py-0.5 text-[11px] bg-field-disabled text-[#79716B]">
         {half ? '반폭 가능' : '전체 폭 전용'}
      </span>
   );
}

// [+ 블록 추가] 버튼 바로 위로 올라오는 시트. 1단계에서 블록 종류를 고르고, 2단계에서 구조를 골라 추가한다.
// 버튼을 다시 누르거나 Esc, 시트 밖을 누르면 닫힌다. (닫기 버튼은 따로 두지 않는다)
// 패널의 스크롤 영역에 잘리지 않도록 화면 전체 위에 띄우고(portal), 버튼의 위치를 따라간다.
export function AddBlockSheet({ existingTypes, onAdd, triggerRef, onClose }: AddBlockSheetProps) {
   const [type, setType] = useState<BlockType | null>(null);
   const sheetRef = useRef<HTMLDivElement>(null);
   const closeRef = useRef(onClose);
   const [position, setPosition] = useState<Position | null>(null);

   useEffect(() => {
      closeRef.current = onClose;
   });

   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape') closeRef.current('escape');
      };
      const handlePointerDown = (event: PointerEvent) => {
         const target = event.target as Node;
         if (sheetRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
         closeRef.current('outside');
      };
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('pointerdown', handlePointerDown);
      return () => {
         document.removeEventListener('keydown', handleKeyDown);
         document.removeEventListener('pointerdown', handlePointerDown);
      };
   }, [triggerRef]);

   // 버튼 위치를 따라간다. 패널이 스크롤되거나 창 크기가 바뀌면 다시 계산한다.
   useLayoutEffect(() => {
      const update = () => {
         const trigger = triggerRef.current;
         if (!trigger) return;
         const rect = trigger.getBoundingClientRect();
         // 버튼이 화면 위로 완전히 벗어나면 시트를 둘 곳이 없으므로 닫는다.
         if (rect.bottom < 0) {
            closeRef.current('outside');
            return;
         }
         const top = Math.min(rect.top, window.innerHeight);
         setPosition({
            left: rect.left,
            width: rect.width,
            bottom: window.innerHeight - top + 8,
            maxHeight: Math.max(top - 24, 160),
         });
      };
      update();
      window.addEventListener('resize', update);
      // 스크롤은 패널 안쪽에서 일어나므로 캡처 단계로 받는다.
      document.addEventListener('scroll', update, true);
      return () => {
         window.removeEventListener('resize', update);
         document.removeEventListener('scroll', update, true);
      };
   }, [triggerRef]);

   // 단계가 바뀔 때 첫 항목에 포커스를 둬서 키보드로 이어서 고를 수 있게 한다.
   useEffect(() => {
      sheetRef.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus();
   }, [type]);

   const itemClass =
      'flex w-full items-center gap-3.5 rounded-xl border border-brand-line bg-white p-2.5 text-left transition-colors not-disabled:cursor-pointer not-disabled:hover:border-brand-orange disabled:opacity-45';

   if (!position) return null;

   return createPortal(
      <div
         ref={sheetRef}
         role="dialog"
         aria-label={type ? '구조 선택' : '블록 추가'}
         style={
            {
               left: position.left,
               width: position.width,
               bottom: position.bottom,
               maxHeight: position.maxHeight,
               '--sheet-max': `${position.maxHeight}px`,
            } as CSSProperties
         }
         className="fixed z-50 flex flex-col rounded-2xl border border-brand-line bg-white shadow-card"
      >
         <div className="flex shrink-0 flex-col gap-1.5 px-4 pt-4">
            {type && (
               <button
                  type="button"
                  onClick={() => setType(null)}
                  className="flex w-fit cursor-pointer items-center gap-1 text-xs text-[#79716B] hover:text-black"
               >
                  <ArrowLeft className="size-3.5" aria-hidden />
                  뒤로
               </button>
            )}
            <h3 className="text-sm font-bold text-brand-brown">
               {type ? '구조를 골라 주세요' : '어떤 블록을 추가할까요?'}
            </h3>
         </div>

         <div className="min-h-0 flex-1">
            <ScrollArea
               className="max-h-full"
               viewportClassName="max-h-[calc(var(--sheet-max)-4.5rem)]"
               contentClassName="space-y-1.5 p-4"
            >
               {type === null
                  ? BLOCK_TYPES.map((blockType) => {
                       const exists = isPinnedType(blockType) && existingTypes.has(blockType);
                       return (
                          <button
                             key={blockType}
                             type="button"
                             disabled={exists}
                             onClick={() => setType(blockType)}
                             className={itemClass}
                          >
                             <BlockThumbnail type={blockType} className="h-16 w-24 shrink-0" />
                             <span>
                                <span className="block text-sm font-bold text-brand-brown">
                                   {BLOCK_TYPE_LABEL[blockType]}
                                </span>
                                <span className="block text-xs text-[#A6A09B]">
                                   {exists ? '이미 추가됨' : BLOCK_TYPE_DESCRIPTION[blockType]}
                                </span>
                             </span>
                          </button>
                       );
                    })
                  : getBlockVariants(type).map((variant) => (
                       <button
                          key={variant.value}
                          type="button"
                          onClick={() => onAdd(type, variant.value)}
                          className={itemClass}
                       >
                          <BlockThumbnail
                             type={type}
                             variant={variant.value}
                             className="h-16 w-24 shrink-0"
                          />
                          <span className="flex flex-col items-start gap-1">
                             <span className="text-sm font-bold text-brand-brown">
                                {variant.label}
                             </span>
                             <Tag half={variant.half} />
                          </span>
                       </button>
                    ))}
            </ScrollArea>
         </div>
      </div>,
      document.body,
   );
}
