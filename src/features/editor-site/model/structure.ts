import { isHalfWidthCapable, type BlockType, type Section } from '@/entities/block';
import type { Row } from '@/entities/site';

// 사이트의 줄(row) 구성을 바꾸는 순수 함수 모음. 새 배열을 돌려주고 받은 배열은 바꾸지 않는다.
// 규칙
// - 헤더는 맨 위, 푸터는 맨 아래에 고정이고, 각각 최대 1개이다. (둘 다 전체 폭 전용이라 항상 혼자 한 줄이다)
// - 한 줄에는 블록이 1개(전체 폭) 또는 2개(50:50)이다. 나란히 놓으려면 두 블록이 모두 반폭 가능해야 한다.
// - 나란히 놓인 두 블록 중 하나가 빠지면 남은 블록은 전체 폭 줄이 된다.
// 줄과 블록의 id는 호출하는 쪽에서 정해서 넘긴다. (이 파일의 함수는 같은 입력이면 항상 같은 결과를 돌려준다)

export type PinnedType = Extract<BlockType, 'header' | 'footer'>;

export function isPinnedType(type: BlockType): type is PinnedType {
   return type === 'header' || type === 'footer';
}

export function hasBlockType(rows: Row[], type: BlockType): boolean {
   return rows.some((row) => row.sections.some((section) => section.type === type));
}

export function findSection(rows: Row[], sectionId: string): { row: Row; section: Section } | null {
   for (const row of rows) {
      const section = row.sections.find((item) => item.id === sectionId);
      if (section) return { row, section };
   }
   return null;
}

// 고정이 아닌 줄을 넣을 수 있는 자리의 범위. (헤더가 있으면 0번 줄 뒤부터, 푸터가 있으면 푸터 앞까지)
function insertRange(rows: Row[]): { min: number; max: number } {
   const first = rows[0]?.sections[0];
   const last = rows[rows.length - 1]?.sections[0];
   return {
      min: first?.type === 'header' ? 1 : 0,
      max: last?.type === 'footer' ? rows.length - 1 : rows.length,
   };
}

function clamp(value: number, min: number, max: number) {
   return Math.min(Math.max(value, min), max);
}

// 블록 한 개를 줄에서 뺀다. 줄에 남는 블록이 없으면 줄도 없앤다.
function detach(rows: Row[], sectionId: string): { rows: Row[]; section: Section } | null {
   const found = findSection(rows, sectionId);
   if (!found) return null;

   const rest = rows.flatMap((row): Row[] => {
      if (row.id !== found.row.id) return [row];
      const remaining = row.sections.filter((section) => section.id !== sectionId);
      return remaining.length === 0 ? [] : [{ ...row, sections: [remaining[0]] }];
   });
   return { rows: rest, section: found.section };
}

// 새 블록을 넣는다. 헤더는 맨 위, 푸터는 맨 아래, 나머지는 푸터 바로 앞(푸터가 없으면 맨 끝)에 들어간다.
// 헤더와 푸터는 이미 있으면 넣지 않는다.
export function addSection(rows: Row[], section: Section, rowId: string): Row[] {
   if (isPinnedType(section.type) && hasBlockType(rows, section.type)) return rows;

   const row: Row = { id: rowId, sections: [section] };
   if (section.type === 'header') return [row, ...rows];
   if (section.type === 'footer') return [...rows, row];

   const { max } = insertRange(rows);
   return [...rows.slice(0, max), row, ...rows.slice(max)];
}

// 블록을 지운다. 나란히 놓인 블록이었다면 남은 블록이 전체 폭 줄이 된다.
export function removeSection(rows: Row[], sectionId: string): Row[] {
   return detach(rows, sectionId)?.rows ?? rows;
}

// 블록을 다른 줄의 앞이나 뒤로 옮겨 자기만의 전체 폭 줄로 만든다. (나란히 있던 블록이면 줄에서 빠진다)
// 헤더와 푸터는 옮길 수 없고, 다른 블록도 헤더 앞이나 푸터 뒤로는 갈 수 없다.
export function moveSectionToRow(
   rows: Row[],
   sectionId: string,
   targetRowId: string,
   position: 'before' | 'after',
   newRowId: string,
): Row[] {
   const found = findSection(rows, sectionId);
   if (!found || isPinnedType(found.section.type)) return rows;
   // 혼자 있던 줄을 자기 줄 앞뒤로 옮기는 것은 제자리이다.
   if (found.row.id === targetRowId && found.row.sections.length === 1) return rows;

   const detached = detach(rows, sectionId);
   if (!detached) return rows;

   const targetIndex = detached.rows.findIndex((row) => row.id === targetRowId);
   if (targetIndex < 0) return rows;

   const { min, max } = insertRange(detached.rows);
   const index = clamp(targetIndex + (position === 'after' ? 1 : 0), min, max);
   const row: Row = { id: newRowId, sections: [detached.section] };
   return [...detached.rows.slice(0, index), row, ...detached.rows.slice(index)];
}

// 나란히 놓을 수 없는 이유. 'ok'이면 놓을 수 있다.
// activeFullOnly: 끄는 블록이 전체 폭 전용 / targetFullOnly: 놓을 곳의 블록이 전체 폭 전용
// targetFull: 놓을 줄에 이미 두 개가 있음 / self: 자기 줄에는 놓을 수 없음
export type PairStatus = 'ok' | 'activeFullOnly' | 'targetFullOnly' | 'targetFull' | 'self';

export function getPairStatus(rows: Row[], sectionId: string, targetRowId: string): PairStatus {
   const active = findSection(rows, sectionId);
   const target = rows.find((row) => row.id === targetRowId);
   if (!active || !target) return 'self';
   if (active.row.id === target.id) return 'self';
   if (!isHalfWidthCapable(active.section.type, active.section.variant)) return 'activeFullOnly';
   if (target.sections.length >= 2) return 'targetFull';
   const [targetSection] = target.sections;
   if (!isHalfWidthCapable(targetSection.type, targetSection.variant)) return 'targetFullOnly';
   return 'ok';
}

// 블록을 다른 줄의 오른쪽에 놓아 나란히 만든다. 놓을 수 없으면 그대로 돌려준다.
export function pairSection(rows: Row[], sectionId: string, targetRowId: string): Row[] {
   if (getPairStatus(rows, sectionId, targetRowId) !== 'ok') return rows;

   const detached = detach(rows, sectionId);
   if (!detached) return rows;

   return detached.rows.map((row) =>
      row.id === targetRowId ? { ...row, sections: [row.sections[0], detached.section] } : row,
   );
}

// 나란히 놓인 두 블록의 좌우를 바꾼다.
export function swapRow(rows: Row[], rowId: string): Row[] {
   return rows.map((row) =>
      row.id === rowId && row.sections.length === 2
         ? { ...row, sections: [row.sections[1], row.sections[0]] }
         : row,
   );
}

// 나란히 놓인 줄을 둘로 나눈다. 왼쪽 블록은 그 줄에 남고, 오른쪽 블록은 바로 아래 새 줄이 된다.
export function unpairRow(rows: Row[], rowId: string, newRowId: string): Row[] {
   return rows.flatMap((row): Row[] => {
      if (row.id !== rowId || row.sections.length !== 2) return [row];
      const [left, right] = row.sections;
      return [
         { ...row, sections: [left] },
         { id: newRowId, sections: [right] },
      ];
   });
}
