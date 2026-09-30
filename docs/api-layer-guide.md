# API 호출 계층 가이드 — `api/` 세그먼트 방식

> 4번 항목(API 호출 계층)을 실제로 구현할 수 있는 수준까지 구체화한 문서. Next.js Server Actions(`actions.ts`)가 아니라 **전담 API 호출 계층**을 쓰기로 한 이유와, 실제 폴더/코드 예시.

## 1. 왜 `actions.ts`가 아니라 `api/` 세그먼트인가

- 백엔드는 별도 팀(2명)이 운영하는 독립 API 서버다. Next.js Server Actions는 Next 앱이 자기 자신의 백엔드/DB를 직접 다루거나, 폼의 progressive enhancement가 필요할 때 강점이 있는 방식인데, 지금 구조에서는 그 이점이 크지 않다. Server Actions를 거치든 안 거치든 결국 외부 API를 fetch로 호출하는 건 동일하고, Server Actions는 여기에 불필요한 레이어 하나를 더 얹는 셈이다.
- FSD는 원래 entity/feature마다 자기 도메인의 API 호출 함수를 갖는 `api` 세그먼트를 표준으로 두고 있다. 이 프로젝트의 `services` 개념과 정확히 일치한다.

## 2. 폴더 구조

```
shared/
  lib/
    apiClient.ts     ← 공통 fetch 래퍼 (에러 처리, 헤더, 재시도 등) — folder-structure-guide.md의 shared 레이어 예시와 동일한 위치

entities/
  plan/
    api/
      getMyPlan.ts     ← 이 도메인의 API 호출 함수
    model/
      usePlanQuery.ts  ← 위 api 함수를 쓰는 훅 (React Query 등)
    types.ts

features/
  {feature}/
    api/
      ...
```

- 컴포넌트는 `api/`의 함수를 직접 호출하지 않고, 반드시 `model/`의 훅을 통해서만 사용한다. (API 호출 로직과 UI 로직을 분리하기 위함)
- 공통 로직(에러 파싱, 인증 헤더 부착 등)은 `shared/lib/apiClient.ts`에 한 곳으로 모은다. 도메인별 `api/` 함수는 이 공통 클라이언트를 감싸서 쓰기만 한다.

## 3. 공통 fetch 클라이언트 — 1번 규칙(에러 메시지 처리)과 연동

```ts
// shared/lib/apiClient.ts
export class ApiError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch {
    // 네트워크 자체 실패 — 1번 규칙에 따라 이 경우만 프론트가 자체 메시지를 구성
    throw new ApiError("NETWORK_ERROR", "네트워크 연결을 확인해주세요");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    // 백엔드가 내려준 에러코드/메시지를 그대로 사용 (1번 규칙)
    throw new ApiError(body?.code ?? "UNKNOWN", body?.message ?? "요청 처리 중 오류가 발생했습니다");
  }

  return res.json();
}
```

## 4. 예시 — `entities/plan`과 Fail-safe 기본값 원칙

7번 규칙(Fail-safe 기본값 원칙)이 이 계층에서 실제로 어떻게 구현되는지 보여주는 예시다.

플랜 조회 API가 실패하면 사용자의 실제 플랜을 알 수 없는 상태가 된다. 이때 "모르니 일단 허용(상위 플랜 취급)"으로 두면 결제 안 한 기능/쿼터가 새어나갈 수 있으므로, **`api/` 함수 자체가 실패를 삼키고 가장 제한적인 플랜(FREE)을 기본값으로 반환**한다. 단, 호출부가 "이게 진짜 조회된 값인지, 실패해서 대체된 값인지" 구분할 수 있도록 `isFallback` 플래그를 함께 내려준다 — 이 플래그로 화면에 안내 문구를 띄울 수 있다(조용히 막기만 하면 유료 사용자가 혼란스러울 수 있기 때문).

```ts
// entities/plan/api/getMyPlan.ts
import { apiFetch } from "@/shared/lib/apiClient";
import type { PlanTier } from "../types";

export async function getMyPlan(): Promise<{ tier: PlanTier; isFallback: boolean }> {
  try {
    const data = await apiFetch<{ tier: PlanTier }>("/api/plan/me");
    return { tier: data.tier, isFallback: false };
  } catch {
    // Fail-safe: 조회 실패 시 가장 제한적인 플랜으로 간주 (편의가 아니라 안전을 위한 기본값)
    return { tier: "FREE", isFallback: true };
  }
}
```

```tsx
// entities/plan/ui/PlanPolicyGuard.tsx
// folder-structure-guide.md 4번 목록에 "PlanPolicyGuard 같은 공통 정책 체크 로직은 entities/plan에 속함"이라고
// 이미 명시돼 있으므로, 별도 features 슬라이스로 빼지 않고 entities/plan 안에 둔다.
import { usePlanQuery } from "../model/usePlanQuery";

export function PlanPolicyGuard({ children }: { children: React.ReactNode }) {
  const { tier, isFallback } = usePlanQuery(); // 내부적으로 getMyPlan()을 호출

  return (
    <>
      {isFallback && (
        <Banner>플랜 정보를 불러오지 못해 일시적으로 기본 플랜 제한이 적용됩니다.</Banner>
      )}
      <PlanContext.Provider value={tier}>{children}</PlanContext.Provider>
    </>
  );
}
```

이 패턴(실패를 삼키고 안전한 기본값 + fallback 플래그 반환)은 플랜 조회뿐 아니라, 관리자 권한 확인처럼 "실패 시 관대하게 허용하면 위험한" 다른 조회에도 동일하게 적용한다.
