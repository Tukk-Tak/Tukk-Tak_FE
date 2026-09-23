# 뚝딱 프로젝트 — 폴더 구조 가이드

> 이 문서는 AI 코딩 어시스턴트(Claude Code, Cursor 등)가 코드를 생성/수정할 때 반드시 따라야 하는 폴더 구조 규칙입니다. 새 파일을 만들거나 기존 코드를 리팩터링할 때 이 문서의 레이어 규칙과 예시를 기준으로 판단하세요.

## 1. 기본 원칙

이 프로젝트는 **Feature-Sliced Design(FSD)을 간소화한 구조**를 씁니다. 핵심 이유는 하나입니다.

> 블록(Block) 컴포넌트가 **에디터**(편집 중인 화면)와 **배포된 실제 가게 사이트**(`/site/{링크명}`) 양쪽에서 똑같이 렌더링되어야 합니다. 이 재사용을 구조적으로 보장하기 위해 "도메인 모델 + 기본 렌더링"을 담당하는 `entities` 레이어를 features/widgets와 분리해서 둡니다.

일반적인 순수 feature-based 구조(도메인별 폴더에 컴포넌트/훅/API를 다 몰아넣는 방식)는 쓰지 않습니다.

## 2. 레이어 구조와 각 레이어의 역할

```
src/
  app/          ← Next.js App Router. 라우팅 파일(page.tsx 등)만 존재. 로직 없음.
  widgets/      ← 여러 feature/entity를 조립한 완성된 UI 블록
  features/     ← 사용자의 "행동" 단위 (로그인하다, 좋아요를 누르다, 블록을 추가하다)
  entities/     ← 도메인 "모델"과 그 모델의 기본 렌더링 (User, Block, Site, Post, Plan)
  shared/       ← 도메인과 무관한 공통 자원 (버튼, 인풋, API 클라이언트, 유틸, 컬러 토큰)
```

### 레이어별 상세

| 레이어 | 담는 것 | 예시 |
|---|---|---|
| `app/` | Next.js 라우팅 파일(`page.tsx`, `layout.tsx`, `loading.tsx`). **로직을 직접 작성하지 않고 features/widgets를 불러와 배치만 함** | `app/editor/[siteId]/page.tsx` |
| `widgets/` | 여러 feature를 묶어 독립적으로 존재하는 UI 블록. 라우트 여러 개에서 재사용될 수 있음 | `widgets/header`, `widgets/site-renderer`, `widgets/editor-sidebar` |
| `features/` | 사용자 액션 하나 = 폴더 하나. 이름은 `{도메인}-{동작}` 형식 | `features/auth-signup`, `features/editor-block-toolbar`, `features/community-like` |
| `entities/` | 데이터 타입 정의 + 그 데이터를 그리는 **기본** 컴포넌트(장식/상태 로직 없이 순수 표시만). 여러 feature/widget에서 재사용됨 | `entities/block`, `entities/site`, `entities/post`, `entities/user`, `entities/plan` |
| `shared/` | 어떤 도메인에도 속하지 않는 것. 디자인 시스템(ui), API 클라이언트/훅(lib), 컬러·폰트 토큰(config) | `shared/ui/Button`, `shared/lib/apiClient`, `shared/config/colors` |

### import 방향 규칙 (중요)

**위에서 아래로만 참조 가능합니다.** 역방향 import는 금지입니다.

```
app → widgets → features → entities → shared
```

- `entities/block`이 `features/editor-block-toolbar`를 import하면 안 됩니다. (역방향)
- `shared/ui/Button`이 `entities`나 `features`를 import하면 안 됩니다. (shared는 항상 최하단)
- 같은 레이어끼리(`features/a`가 `features/b`를) 직접 import하는 것도 지양합니다. 공유가 필요하면 그 로직을 `entities`나 `shared`로 내려야 합니다.

## 3. 새 코드를 어디에 둘지 판단하는 순서

새 컴포넌트나 로직을 작성할 때 아래 순서로 자문하세요.

1. **여러 라우트/화면에서 재사용되는 "데이터 구조 + 기본 표시"인가?** → `entities/`
   - 예: 블록 하나를 화면에 그리는 컴포넌트 자체 (에디터에서도, 배포 사이트에서도 씀) → `entities/block`
2. **사용자가 취하는 하나의 "행동"과 그에 딸린 UI/상태인가?** → `features/`
   - 예: 블록의 색상/테두리를 바꾸는 툴바, 댓글을 작성하는 폼 → `features/editor-block-toolbar`, `features/community-comment`
3. **여러 feature/entity를 조합한, 그 자체로 완결된 화면 영역인가?** → `widgets/`
   - 예: 헤더 전체, "에디터 캔버스 + 사이드바"를 합친 에디터 화면 전체 → `widgets/editor-sidebar`
4. **도메인과 무관하게 어디서든 쓰이는 범용 요소인가?** → `shared/`
   - 예: 공통 버튼, 모달, API 요청 함수, 날짜 포맷 유틸

**헷갈리면 entities를 우선 고려하세요.** "이게 두 군데 이상에서 재사용될 가능성이 있는 도메인 데이터인가?"를 항상 먼저 물어보고, 아니라면 features로 내려가는 순서가 안전합니다.

## 4. 이 프로젝트의 entities 목록 (고정)

아래 5개가 핵심 entity입니다. 새 entity를 임의로 만들기 전에 이 목록에 포함시킬 수 있는지 먼저 확인하세요.

- `entities/user` — 회원 정보, 사업자 인증 상태
- `entities/block` — 블록 타입 정의(헤더/히어로/메뉴판/갤러리/푸터 등) + 각 블록의 기본 렌더링 컴포넌트
- `entities/site` — 사이트(사장님이 만든 가게 페이지) 데이터 구조, draft/배포 상태
- `entities/post` — 커뮤니티 게시물/댓글 타입
- `entities/plan` — 구독 플랜 정책(FREE/BASIC/PREMIUM 제한값). `PlanPolicyGuard` 같은 공통 정책 체크 로직이 여기 속함

## 5. 예시: 에디터 페이지가 조립되는 방식

```tsx
// app/editor/[siteId]/page.tsx
// ⚠️ 이 파일에는 상태 관리나 API 호출 로직을 직접 작성하지 않습니다. 조립만 합니다.

import { EditorTopbar } from "@/features/editor-toolbar";
import { EditorSidebar } from "@/widgets/editor-sidebar";
import { SiteRenderer } from "@/widgets/site-renderer";

export default function EditorPage({ params }: { params: { siteId: string } }) {
  return (
    <div>
      <EditorTopbar siteId={params.siteId} />
      <SiteRenderer siteId={params.siteId} editable />
      <EditorSidebar siteId={params.siteId} />
    </div>
  );
}
```

```tsx
// app/site/[slug]/page.tsx
// 배포된 실제 가게 페이지. SiteRenderer를 editable=false로 재사용 — 렌더링 로직 중복 없음.

import { SiteRenderer } from "@/widgets/site-renderer";

export default function PublicSitePage({ params }: { params: { slug: string } }) {
  return <SiteRenderer slug={params.slug} editable={false} />;
}
```

`widgets/site-renderer`는 내부적으로 `entities/block`의 렌더링 컴포넌트들을 순회하며 그립니다. `editable` 여부에 따라 `features/editor-block-toolbar` 같은 편집 기능을 얹을지만 결정합니다. 이렇게 하면 에디터 미리보기와 실제 배포 화면이 다르게 보이는 버그를 구조적으로 방지할 수 있습니다.

## 6. 라우트 그룹 (선택)

로그인 필요 여부에 따라 `app/` 하위를 라우트 그룹으로 묶을 수 있습니다. URL에는 영향을 주지 않습니다.

```
app/
  (auth)/
    signup/page.tsx
    login/page.tsx
  (dashboard)/
    mypage/edit/page.tsx
    editor/[siteId]/page.tsx
```

`(dashboard)` 그룹에 미들웨어로 로그인 체크를 일괄 적용할 때 유용합니다.

## 7. AI 어시스턴트를 위한 체크리스트

새 파일을 만들거나 기존 파일을 옮길 때 아래를 확인하세요.

- [ ] 이 코드가 속할 레이어를 위 3번 순서(entities → features → widgets → shared)로 판단했는가?
- [ ] import 방향이 `app → widgets → features → entities → shared`를 거스르지 않는가?
- [ ] `entities/block` 관련 코드를 만들 때, 에디터 전용 로직(편집 상태, 선택 여부)이 섞여 들어가지 않았는가? (그건 `features/editor-*`로 가야 함)
- [ ] `page.tsx`에 비즈니스 로직이나 API 호출을 직접 작성하지 않았는가? (widgets/features를 불러와 조립만 해야 함)
- [ ] 새 entity를 만들려 하는가? → 4번 목록(user/block/site/post/plan) 외의 새 entity가 정말 필요한지 팀원과 먼저 확인
