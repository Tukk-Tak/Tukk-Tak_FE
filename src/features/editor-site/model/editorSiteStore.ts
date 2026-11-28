import { createStore } from 'zustand';
import { createSection, type BlockType } from '@/entities/block';
import type { SiteContent, ThemeConfig } from '@/entities/site';
import {
   addSection,
   changeVariant,
   getTypingKey,
   moveSectionToRow,
   pairSection,
   removeSection,
   swapRow,
   unpairRow,
   updateSectionContent,
   type ContentPatch,
} from './structure';

// 되돌리기로 남기는 기록의 최대 개수. 넘으면 가장 오래된 것부터 버린다.
const MAX_HISTORY = 50;
// 글자를 입력할 때 마지막 입력 뒤 이 시간 안에 이어서 입력하면 한 번의 편집으로 묶는다.
const TYPING_IDLE_MS = 1000;

// 새 줄과 블록의 id. 브라우저에서 동작이 일어날 때만 만들어진다.
function newId(prefix: string) {
   return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export interface EditorSiteState {
   // 지금 편집 중인 사이트 내용
   site: SiteContent;
   // 처음 불러온 내용. 지금 내용과 다르면(참조가 다르면) 저장하지 않은 변경이 있는 것이다.
   initialSite: SiteContent;
   // 되돌리기 기록. past 는 오래된 것부터, future 는 다시하기로 돌아갈 것을 가까운 것부터 앞에 둔다.
   // 기록에는 사이트 내용 객체를 그대로 쌓는다. 바뀌지 않은 줄과 블록은 같은 객체를 함께 쓰므로 메모리가 많이 들지 않는다.
   past: SiteContent[];
   future: SiteContent[];
   undo: () => void;
   redo: () => void;
   // 슬라이더처럼 끌면서 값이 계속 바뀌는 조작의 시작과 끝. 이 사이의 변경은 되돌리기 한 번으로 묶는다.
   beginBatch: () => void;
   endBatch: () => void;

   // 새 블록을 추가하고 그 블록의 id를 돌려준다. 헤더·푸터가 이미 있으면 null.
   addSection: (type: BlockType, variant: string) => string | null;
   removeSection: (sectionId: string) => void;
   moveSectionToRow: (sectionId: string, targetRowId: string, position: 'before' | 'after') => void;
   pairSection: (sectionId: string, targetRowId: string) => void;
   swapRow: (rowId: string) => void;
   unpairRow: (rowId: string) => void;

   // 블록 내용의 일부를 바꾼다. 입력할 때마다 불리므로 바뀐 블록만 새 객체가 되고 나머지는 그대로 유지된다.
   updateContent: (sectionId: string, patch: ContentPatch) => void;
   // 사이트 테마의 일부를 바꾼다. 이미 같은 값이면 상태를 바꾸지 않는다.
   updateTheme: (patch: ThemeConfig) => void;
   // 블록의 구조를 바꾼다. 전체 폭 전용 구조로 바꿔서 나란히 놓은 상태가 풀렸으면 true.
   setVariant: (sectionId: string, variant: string) => boolean;
}

// 에디터마다 따로 만드는 저장소. 화면에 들어올 때 서버가 준 사이트 내용으로 시작한다.
export function createEditorSiteStore(initialSite: SiteContent) {
   return createStore<EditorSiteState>()((set, get) => {
      // 바로 앞 편집과 한 번의 편집으로 묶을 수 있는 상태. 묶이면 기록을 새로 남기지 않고 현재 내용만 바꾼다.
      // 슬라이더 조작 중(batching)이거나, 같은 칸에 연달아 입력 중(typing)일 때 묶인다.
      let batching = false;
      let batchRecorded = false;
      let typing: { key: string; at: number } | null = null;

      // 사이트 내용이 바뀌는 모든 편집이 지나가는 곳. 바뀌기 전 내용을 기록에 남기고 다시하기 기록은 지운다.
      // typingKey: 같은 칸에 이어지는 변경(글자 입력 등)이면 그 칸을 구별하는 값
      const commit = (next: SiteContent, typingKey?: string) => {
         const now = Date.now();
         const continuesTyping =
            typingKey !== undefined &&
            typing?.key === typingKey &&
            now - typing.at <= TYPING_IDLE_MS;
         typing = typingKey === undefined ? null : { key: typingKey, at: now };
         const merge = batching ? batchRecorded : continuesTyping;
         if (batching) batchRecorded = true;

         set((state) => ({
            site: next,
            past: merge ? state.past : [...state.past, state.site].slice(-MAX_HISTORY),
            future: [],
         }));
      };

      // 줄 구성만 바꾸는 동작을 한 곳에서 처리한다. 결과가 같으면(바뀐 것이 없으면) 상태를 바꾸지 않는다.
      const updateRows = (update: (rows: SiteContent['rows']) => SiteContent['rows']) => {
         const { site } = get();
         const rows = update(site.rows);
         if (rows !== site.rows) commit({ ...site, rows });
      };

      return {
         site: initialSite,
         initialSite,
         past: [],
         future: [],

         undo: () => {
            batching = false;
            typing = null;
            set((state) => {
               const previous = state.past[state.past.length - 1];
               if (!previous) return state;
               return {
                  site: previous,
                  past: state.past.slice(0, -1),
                  future: [state.site, ...state.future],
               };
            });
         },
         redo: () => {
            batching = false;
            typing = null;
            set((state) => {
               const [next, ...rest] = state.future;
               if (!next) return state;
               return { site: next, past: [...state.past, state.site], future: rest };
            });
         },
         beginBatch: () => {
            // 키를 누르고 있으면 계속 불리므로, 이미 묶는 중이면 다시 시작하지 않는다.
            if (batching) return;
            batching = true;
            batchRecorded = false;
         },
         endBatch: () => {
            batching = false;
         },

         addSection: (type, variant) => {
            const section = createSection(type, variant, newId('section'));
            const before = get().site.rows;
            updateRows((rows) => addSection(rows, section, newId('row')));
            return get().site.rows === before ? null : section.id;
         },
         removeSection: (sectionId) => updateRows((rows) => removeSection(rows, sectionId)),
         moveSectionToRow: (sectionId, targetRowId, position) =>
            updateRows((rows) =>
               moveSectionToRow(rows, sectionId, targetRowId, position, newId('row')),
            ),
         pairSection: (sectionId, targetRowId) =>
            updateRows((rows) => pairSection(rows, sectionId, targetRowId)),
         swapRow: (rowId) => updateRows((rows) => swapRow(rows, rowId)),
         unpairRow: (rowId) => updateRows((rows) => unpairRow(rows, rowId, newId('row'))),
         updateContent: (sectionId, patch) => {
            const { site } = get();
            const rows = updateSectionContent(site.rows, sectionId, patch);
            if (rows === site.rows) return;
            // 같은 칸에 이어지는 입력(글자 입력 등)은 한 번의 편집으로 묶는다. (묶는 기준은 getTypingKey 참고)
            commit({ ...site, rows }, getTypingKey(site.rows, sectionId, patch));
         },
         updateTheme: (patch) => {
            const { site } = get();
            const unchanged = Object.entries(patch).every(
               ([key, value]) => site.theme[key as keyof ThemeConfig] === value,
            );
            if (!unchanged) commit({ ...site, theme: { ...site.theme, ...patch } });
         },
         setVariant: (sectionId, variant) => {
            const result = changeVariant(get().site.rows, sectionId, variant, newId('row'));
            updateRows(() => result.rows);
            return result.unpaired;
         },
      };
   });
}
