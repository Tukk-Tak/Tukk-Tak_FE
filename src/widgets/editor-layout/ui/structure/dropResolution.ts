import {
   closestCenter,
   pointerWithin,
   type CollisionDetection,
   type DragEndEvent,
   type DragMoveEvent,
   type DragOverEvent,
} from '@dnd-kit/core';
import type { Row } from '@/entities/site';
import { findSection, getPairStatus, type PairStatus } from '@/features/editor-site';

// 드래그 id는 "종류:값" 형태이다. 블록, 줄, 나란히 놓는 자리, 나란한 줄 안의 블록을 구분한다.
export const dndId = {
   section: (sectionId: string) => `section:${sectionId}`,
   row: (rowId: string) => `row:${rowId}`,
   pair: (rowId: string) => `pair:${rowId}`,
   item: (sectionId: string) => `item:${sectionId}`,
};

function valueOf(id: string | number) {
   return String(id).slice(String(id).indexOf(':') + 1);
}

// 블록을 놓을 곳을 찾는 순서: 줄 오른쪽의 "옆에 놓기" 자리 → 나란한 줄 안의 블록 → 가장 가까운 줄.
// 키보드로 끌 때는 포인터 좌표가 없으므로, 끌고 있는 블록의 가운데를 포인터 위치로 본다.
// 그래서 방향키로 블록을 오른쪽 자리나 다른 블록 위까지 옮기면 나란히 놓기와 좌우 바꾸기도 할 수 있다.
export const collisionDetection: CollisionDetection = (args) => {
   const only = (prefix: string) =>
      args.droppableContainers.filter((container) => String(container.id).startsWith(prefix));

   const rect = args.collisionRect;
   const pointerCoordinates = args.pointerCoordinates ?? {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
   };

   const pair = pointerWithin({ ...args, pointerCoordinates, droppableContainers: only('pair:') });
   if (pair.length > 0) return pair;
   const item = pointerWithin({ ...args, pointerCoordinates, droppableContainers: only('item:') });
   if (item.length > 0) return item;
   return closestCenter({ ...args, droppableContainers: only('row:') });
};

// 끌고 있는 블록을 지금 놓으면 일어날 일.
// pair: 그 줄 옆에 놓아 나란히 만든다(status가 'ok'일 때만 실제로 됨) / swap: 나란한 줄 안에서 좌우를 바꾼다
// move: 그 줄의 앞이나 뒤로 옮겨 혼자 한 줄이 된다
export type Drop =
   | { kind: 'pair'; rowId: string; status: PairStatus }
   | { kind: 'swap'; rowId: string }
   | { kind: 'move'; rowId: string; position: 'before' | 'after' };

export function resolveDrop(
   event: DragMoveEvent | DragOverEvent | DragEndEvent,
   rows: Row[],
): Drop | null {
   const { active, over } = event;
   if (!over) return null;

   const activeId = valueOf(active.id);
   const overId = String(over.id);

   if (overId.startsWith('pair:')) {
      const rowId = valueOf(overId);
      return { kind: 'pair', rowId, status: getPairStatus(rows, activeId, rowId) };
   }

   let rowId: string;
   if (overId.startsWith('item:')) {
      const target = findSection(rows, valueOf(overId));
      if (!target) return null;
      rowId = target.row.id;
      // 같은 나란한 줄 안의 다른 블록 위에 놓으면 좌우를 바꾼다.
      if (findSection(rows, activeId)?.row.id === rowId) return { kind: 'swap', rowId };
   } else {
      rowId = valueOf(overId);
   }

   // 끌고 있는 블록의 가운데가 줄의 위쪽 절반이면 앞, 아래쪽 절반이면 뒤에 놓는다.
   const translated = active.rect.current.translated;
   const center = translated ? translated.top + translated.height / 2 : over.rect.top;
   const position = center < over.rect.top + over.rect.height / 2 ? 'before' : 'after';
   return { kind: 'move', rowId, position };
}

// 두 결과가 같은지. 끄는 동안 같은 결과로 다시 그리지 않기 위해 쓴다.
export function isSameDrop(a: Drop | null, b: Drop | null): boolean {
   if (a === b) return true;
   if (!a || !b || a.kind !== b.kind || a.rowId !== b.rowId) return false;
   if (a.kind === 'pair' && b.kind === 'pair') return a.status === b.status;
   if (a.kind === 'move' && b.kind === 'move') return a.position === b.position;
   return true;
}

// 끄는 동안 줄 사이에 보여 줄 주황 선의 위치. 실제로 들어갈 자리(헤더 앞, 푸터 뒤는 안 됨)를 기준으로 한다.
export function getInsertionHint(
   drop: Drop | null,
   rows: Row[],
   activeId: string | null,
): { rowId: string; position: 'before' | 'after' } | null {
   if (drop?.kind !== 'move' || !activeId) return null;

   const target = rows.find((row) => row.id === drop.rowId);
   if (!target) return null;

   // 혼자 있던 줄을 자기 줄 앞뒤로 옮기는 것은 제자리라서 선을 보이지 않는다.
   const own = findSection(rows, activeId);
   if (own && own.row.id === target.id && own.row.sections.length === 1) return null;

   let position = drop.position;
   if (target.sections.length === 1) {
      if (target.sections[0].type === 'header') position = 'after';
      if (target.sections[0].type === 'footer') position = 'before';
   }
   return { rowId: target.id, position };
}
