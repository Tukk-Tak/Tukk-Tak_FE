import { createStore } from 'zustand';
import { createSection, type BlockType } from '@/entities/block';
import type { SiteContent, ThemeConfig } from '@/entities/site';
import {
   addSection,
   changeVariant,
   moveSectionToRow,
   pairSection,
   removeSection,
   swapRow,
   unpairRow,
   updateSectionContent,
   type ContentPatch,
} from './structure';

// 새 줄과 블록의 id. 브라우저에서 동작이 일어날 때만 만들어진다.
function newId(prefix: string) {
   return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

export interface EditorSiteState {
   // 지금 편집 중인 사이트 내용
   site: SiteContent;
   // 처음 불러온 내용. 지금 내용과 다르면(참조가 다르면) 저장하지 않은 변경이 있는 것이다.
   initialSite: SiteContent;

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
      // 줄 구성만 바꾸는 동작을 한 곳에서 처리한다. 결과가 같으면(바뀐 것이 없으면) 상태를 바꾸지 않는다.
      const updateRows = (update: (rows: SiteContent['rows']) => SiteContent['rows']) =>
         set((state) => {
            const rows = update(state.site.rows);
            return rows === state.site.rows ? state : { site: { ...state.site, rows } };
         });

      return {
         site: initialSite,
         initialSite,

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
         updateContent: (sectionId, patch) =>
            updateRows((rows) => updateSectionContent(rows, sectionId, patch)),
         updateTheme: (patch) =>
            set((state) => {
               const unchanged = Object.entries(patch).every(
                  ([key, value]) => state.site.theme[key as keyof ThemeConfig] === value,
               );
               return unchanged
                  ? state
                  : { site: { ...state.site, theme: { ...state.site.theme, ...patch } } };
            }),
         setVariant: (sectionId, variant) => {
            const result = changeVariant(get().site.rows, sectionId, variant, newId('row'));
            updateRows(() => result.rows);
            return result.unpaired;
         },
      };
   });
}
