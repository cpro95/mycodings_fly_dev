---
slug: 2025-09-06-nextjs-15-upgrade-guide-core-changes-and-future-of-app-router
title: Next.js 15 업데이트 완벽 가이드, 핵심 변경 사항과 앱 라우터의 미래
date: 2025-09-07 05:46:18.240000+00:00
summary: Next.js 15로 업데이트하는 전체 과정과 주요 변경 사항, 그리고 그 배경에 있는 App Router의 새로운 렌더링 패러다임을 심층 분석합니다. Partial Pre-rendering과 use cache로 변화하는 Next.js의 미래를 미리 만나보세요.
tags: ["Next.js 15", "React 19", "App Router", "Partial Pre-rendering", "use cache", "Next.js 업데이트", "next.js"]
contributors: []
draft: false
---

개발자라면 누구나 한 번쯤은 메이저 버전 업데이트의 압박을 느껴봤을 텐데요.<br /><br />
새로운 기능과 성능 개선은 분명 매력적이지만, 항상 따라오는 '기존 코드와 호환되지 않는 변경'이라는 녀석 때문에 선뜻 손대기가 망설여지는 게 사실입니다.<br /><br />
최근 Next.js 커뮤니티의 뜨거운 감자인 'Next.js 15' 업데이트 역시 그런 대상인데요.<br /><br />
오늘은 제가 직접 내부 프로덕트의 프론트엔드 스택을 Next.js v14에서 v15로 올리면서 겪었던 경험과, 이 업데이트 뒤에 숨겨진 Next.js 팀의 거대한 청사진을 함께 파헤쳐 보겠습니다.<br /><br />

## 왜 지금 Next.js 15로 업데이트해야 할까요

저희 팀은 사내 에이전트의 생산성 향상과 채용 기업의 활동을 고도화하는 웹 시스템을 Next.js 14와 React 18 기반으로 운영해왔습니다.<br /><br />
이 시스템은 후보자 검색, 스카우트 전송, 메시지 송수신 등 다양한 핵심 기능을 담고 있었거든요.<br /><br />
하지만 시간이 지나면서 Next.js의 기본 캐시 정책이나 상태 관리 설계 때문에 발생하는 '사용상의 불편함'이 누적되기 시작했습니다.<br /><br />
물론 당장 UX를 개선하기 위한 리팩토링도 중요했지만, 큰 그림을 봤을 때 메이저 업데이트를 먼저 완료하는 것이 장기적으로는 훨씬 유리하다고 판단했습니다.<br /><br />
업데이트를 통해 최신 기능을 설계에 반영할 수 있고, 나중에 뒤늦게 업데이트하느라 발생하는 불필요한 공수를 줄일 수 있기 때문이죠.<br /><br />
결국, Next.js 15와 React 19로의 이전을 과감하게 결정했습니다.<br /><br />

## 현명한 업데이트 전략 세우기

메이저 버전 업데이트는 자칫 잘못하면 예상치 못한 문제의 늪에 빠질 수 있는데요.<br /><br />
성공적인 업데이트를 위해서는 명확한 전략이 필수입니다.<br /><br />

### 1. '최소한의 변경' 원칙 고수하기

가장 먼저 해야 할 일은 업데이트의 '범위(Scope)'를 명확히 정하는 것인데요.<br /><br />
이번 업데이트의 목표는 '기존 기능을 유지한 채 Next.js 15와 React 19로 버전만 올리는 것'으로 잡았습니다.<br /><br />
새로운 기능 추가나 코드 최적화 같은 리팩토링은 이번 스코프에서 과감하게 제외했거든요.<br /><br />
스코프를 너무 넓게 잡으면 변경 사항이 많아져서 놓치는 부분이 생기기 쉽고, 코드 리뷰 부담도 엄청나게 늘어나기 때문입니다.<br /><br />

### 2. 핵심 변경 사항 완벽 분석하기

App Router는 아직 완전히 정착되지 않은 '과도기'에 있는 기술인데요.<br /><br />
단순히 문법만 바뀐 것이 아니라, 그 뒤에 숨겨진 '왜 이런 변화가 생겼는지'라는 배경까지 이해하는 것이 정말 중요합니다.<br /><br />
이러한 이해는 향후 설계를 할 때 불필요한 시행착오를 줄이고, 라이브러리 선택이나 아키텍처 결정에도 큰 도움이 되거든요.<br /><br />
이번 Next.js 15의 핵심 변경 사항은 크게 두 가지로 나눌 수 있습니다.<br /><br />

#### 가. 리퀘스트 API의 비동기화

`headers`, `cookies`, `params`, `searchParams` 등 특정 리퀘스트에 의존하는 API들이 이제 비동기 함수로 변경되는데요.<br /><br />
이는 이전에는 없었던 새로운 문법 변화입니다.<br />

```typescript
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies(); // 이제 await이 필요합니다.
  // 여기서 cookieStore를 활용합니다.
  return null;
}
```

기존의 동기 방식 API는 Next.js 15에서는 '경고'와 함께 당분간 유지되지만, Next.js 16에서는 완전히 삭제될 예정입니다.<br /><br />
다행히 대부분의 코드는 공식 'codemod'(`next-async-request-api`)를 사용하면 자동으로 마이그레이션할 수 있으니 큰 걱정은 안 하셔도 됩니다.<br /><br />

#### 나. 캐시의 기본 동작 무효화

Next.js 15에서는 캐시와 관련된 기본 동작이 세 가지 크게 바뀌었는데요.<br /><br />

1.  **Data Cache**: `fetch` 요청 시 캐시 전략의 기본값이 `force-cache`에서 `no-store`로 변경됩니다.<br /><br />
2.  **Router Cache**: `staleTime`의 기본값이 정적(Static) 페이지 5분, 동적(Dynamic) 페이지 30초에서 '모두 0초'로 변경됩니다. (단, `layout.tsx`, `loading.tsx` 같은 정적 파일은 기존처럼 캐시됩니다.)<br /><br />
3.  **Route Handler (GET)**: `GET` 요청을 처리하는 Route Handler 역시 기본적으로 캐시되지 않도록 변경됩니다.<br /><br />

만약 기존 Next.js 14와 동일한 캐시 동작을 원한다면, 각 캐시를 명시적으로 설정해 주어야 합니다.<br />

```typescript
// Data Cache의 경우
await fetch(url, { cache: 'force-cache' }); // 명시적으로 캐시를 사용합니다.
```

### 3. React 19의 주요 변경 사항 (참고)

Next.js 15는 React 19와 함께 출시되는데요.<br /><br />
React 19의 주요 변경 사항은 주로 그동안 '비권장(Deprecated)'으로 분류되었던 레거시 API들의 '삭제'에 초점이 맞춰져 있습니다.<br /><br />
따라서 대부분의 함수 컴포넌트 기반 프로젝트에는 직접적인 영향이 없을 겁니다.<br /><br />
예를 들어, 오래된 클래스 컴포넌트의 라이프사이클 메서드들(`componentWillMount` 계열)이 삭제 대상인데요.<br /><br />
하지만 혹시라도 사용 중인 라이브러리 내부에서 이런 비권장 API를 사용하고 있을 가능성이 있으니, 의존성 라이브러리들을 업데이트하고 릴리스 노트를 꼼꼼히 확인하는 것을 추천합니다.<br /><br />

## 실제 프로젝트에 미치는 영향 조사 및 대응 방안

이제 위에서 정리한 내용을 바탕으로, 우리 프로젝트 코드와 라이브러리들이 어떤 영향을 받는지 구체적으로 분석하고 대응 방안을 세워야 하는데요.<br /><br />

### 1. 프로덕트 코드

-   **리퀘스트 API 비동기화**: 공식 Codemod(`npx @next/codemod@latest next-async-request-api .`)를 먼저 돌린 후, Codemod가 처리하지 못하는 부분은 수동으로 수정했습니다.<br /><br />
-   **캐시 기본값 무효화**:
    -   **Data Cache**: `fetch`를 랩핑하고 있는 API 클라이언트 함수에서 기존 캐시 동작을 유지하고 싶은 요청에 `cache: 'force-cache'`를 명시적으로 추가했습니다. (`cache: 'no-store'`는 이미 명시되어 있었습니다.)<br /><br />
    -   **Router Cache**: `next.config.ts` 파일에 `staleTimes` 옵션을 추가하여, 정적 페이지는 300초(5분), 동적 페이지는 30초로 명시적으로 설정해서 Next.js 14의 기본 동작을 유지했습니다.<br /><br />
    -   **Route Handler (GET)**: 캐시를 유지하고 싶은 Route Handler에는 `export const dynamic = 'force-static'`을 명시적으로 추가했습니다.<br /><br />

간단한 코드 예시를 통해 어떤 식으로 적용했는지 확인해 보겠습니다.<br />

```typescript
// Data Cache 유지 예시 (app/lib/getUser.ts)
export async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    cache: 'force-cache', // 명시적으로 캐시 사용
    next: { tags: ['user', id] },
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

// Router Cache 유지 예시 (next.config.ts)
const nextConfig = {
  experimental: {
    // NOTE: v14 기본값 유지. 향후 useCache로 최적화 예정
    staleTimes: {
      static: 300, // 5분
      dynamic: 30, // 30초
    },
  },
};
export default nextConfig;

// Route Handler (GET) 유지 예시 (app/api/hello/route.ts)
export const dynamic = 'force-static'; // 이 핸들러는 정적으로 처리됩니다.

export async function GET() {
  return Response.json({ ok: true });
}
```

### 2. 라이브러리

사용하고 있는 모든 라이브러리의 `package.json`에 명시된 `peerDependencies`를 시작점으로 삼아, Next.js 15와 React 19에 대한 공식 지원 여부를 확인했습니다.<br /><br />
만약 `peerDependencies` 정의가 `">16"`처럼 느슨하게 되어 있다면, 해당 라이브러리의 공식 문서나 릴리스 노트를 직접 찾아보는 수고를 아끼지 않아야 합니다.<br /><br />
이 과정을 통해 라이브러리별 '현행 버전', 'Next.js 15/React 19 대응 상황', 그리고 '특이 사항'을 표로 정리했는데요.<br /><br />
저희 팀은 라이브러리 조사와 정리 작업은 AI에게 맡기고, '리플레이스 여부 판단'이라는 중요한 의사 결정에만 집중했습니다.<br />

```
// 예시: 라이브러리 대응 상황 정리 (AI 활용 예시)

| 라이브러리      | 현 버전   | 대응 상황        | 비고                                                                 |
|-----------------|-----------|------------------|----------------------------------------------------------------------|
| react-dnd       | 16.0.1    | ❌ 미지원         | React 19 peer 미포함, 3년 미업데이트. dnd-kit 3.x로 교체 권장.       |
| @radix-ui/*     | 1.1.x     | ⚠️ 업그레이드 필요 | 1.2.11+ 버전에서 React 19 peer 경고 해결. shadcn/ui@latest로 일괄 업데이트 가능. |
| react-hook-form | 7.50.1    | ⚠️ 업그레이드 필요 | 7.56.0+ 버전에서 React 19 peer 추가.                                 |
```

## 최종 업데이트 및 검증 과정

모든 조사가 끝났다면, 이제 실제로 업데이트를 진행하고 제대로 동작하는지 확인하는 과정이 남았는데요.<br /><br />
저희 팀은 아래와 같은 단계별 절차를 거쳤습니다.<br /><br />
실제 작업은 Cursor와 같은 AI 코딩 도구를 활용하여, 정리된 자료를 기반으로 단계마다 확인하며 진행했거든요.<br /><br />

1.  **TypeScript 업데이트**: React 19의 타입 오류를 정확히 감지하려면 TypeScript v5.5 이상이 필요합니다. 저희는 최신 버전인 v5.8.3으로 업데이트했습니다.<br /><br />
2.  **React 임시 업데이트**: React를 v18.3으로 먼저 업데이트했습니다. 이 버전은 'transitional release'라고 불리며, React 19에서 발생하는 주요 변경에 대한 경고를 미리 표시해주거든요. 이를 통해 Codemod를 사용해 v19 전환에 대비한 경고들을 미리 해결할 수 있었습니다.<br /><br />
3.  **Next.js 14 최신 버전 업데이트**: Next.js 15로 바로 넘어가기 전에, Next.js 14의 최신 버전인 v14.2.28로 먼저 업데이트해서 변경될 코드를 최소화했습니다.<br /><br />
4.  **Next.js 15 & React 19 및 의존성 일괄 업데이트**: 이제 모든 핵심 라이브러리를 한 번에 최신 버전으로 올렸습니다.<br /><br />
5.  **Codemod 실행**: `npx @next/codemod@latest next-async-request-api .` 명령어를 실행하여 리퀘스트 API 비동기화 관련 코드를 자동으로 변환했습니다.<br /><br />
6.  **수동 수정**: Codemod가 처리하지 못한 나머지 변경 사항들은 미리 세워둔 대응 방안에 따라 수동으로 수정했습니다.<br /><br />
7.  **라이브러리 교체**: 호환되지 않는 라이브러리는 대체 라이브러리로 교체 작업을 진행했습니다.<br /><br />
8.  **최종 검토 및 확인**:
    -   **코드 리뷰**: 모든 변경 사항에 대해 꼼꼼한 코드 리뷰를 진행했습니다.<br /><br />
    -   **수동 기능 테스트**: 현재 저희 프론트엔드 CI에는 자동화된 테스트가 없어, 주요 사용자 흐름(Main User Journey)은 모두 수동으로 눈으로 확인했습니다.<br /><br />
    -   **Vercel 환경 검증**: 로컬 개발 환경과 Vercel 배포 환경은 캐시나 렌더링 방식에서 미묘하게 차이가 날 수 있거든요. 반드시 Vercel에 배포하여 실제 환경에서 정상 동작하는지 꼼꼼히 확인해야 합니다.<br /><br />

모든 과정이 문제없이 완료되었다면, 드디어 Next.js 15로의 업데이트가 성공적으로 마무리되는 겁니다.<br /><br />

### Tip: `NODE_ENV=production` 이 한 줄의 중요성

아는 사람만 아는 아주 중요한 팁이 하나 있는데요.<br /><br />
`.env` 파일에 `NODE_ENV=production`이라는 환경 변수를 반드시 명시해야 합니다.<br />

```
# 이 설정이 없으면 `wrangler deploy` 시 리액트 개발용 모듈이 포함됩니다.
NODE_ENV=production
```

Cloudflare Pages나 Workers 같은 환경에 `wrangler deploy`로 배포할 때, `wrangler`는 백엔드 코드(`workers` 폴더 내부의 코드)를 `esbuild`로 번들링하는데요.<br /><br />
이때 `NODE_ENV`가 `production`으로 설정되어 있지 않으면, `node_modules`에 있는 React 라이브러리가 '디버깅 정보'가 포함된 '개발용 패키지'를 프로덕션 번들에 강제로 포함시켜 버립니다.<br /><br />
이는 번들 사이즈를 불필요하게 키우고, 런타임 성능 저하를 유발하는 아주 치명적인 문제인데요.<br /><br />
프론트엔드 빌드에는 영향을 주지 않지만, 백엔드 워커 번들에서는 반드시 신경 써야 할 부분입니다.<br /><br />

## Next.js 15 핵심 변경의 배경 거대한 청사진

이제 Next.js 15의 주요 변경 사항이 단순히 버그 픽스가 아니라, 더 큰 미래를 위한 중요한 발걸음이라는 점을 이해해볼 차례인데요.<br /><br />
저의 주관적인 견해도 포함되어 있으니 참고해서 들어주세요.<br /><br />

### 1. 리퀘스트 API 비동기화 PPR을 향한 여정

이전 Next.js 버전에서는 `headers`, `cookies` 같은 동적 API를 사용하거나 `fetch` 요청에 `cache: 'no-store'` 옵션을 지정하면, 해당 '라우트 전체'가 정적 렌더링(SSG)에서 제외되고 무조건 동적 렌더링(SSR)으로 처리되었습니다.<br /><br />
하지만 생각해 보면, 모든 컴포넌트가 리퀘스트 데이터에 의존하는 것은 아니거든요.<br /><br />
같은 라우트 내에서도 미리 빌드해둘 수 있는 정적인 부분과 리퀘스트마다 다르게 렌더링해야 하는 동적인 부분이 공존합니다.<br /><br />
이번 리퀘스트 API의 비동기화는 바로 이런 '부분적인 사전 렌더링(Partial Pre-rendering, PPR)'이라는 Next.js의 궁극적인 목표를 위한 사전 작업인데요.<br /><br />
이제 Next.js는 개발자에게 '언제 리퀘스트를 기다려야 하는지'를 명시적으로 알려줌으로써, 같은 라우트 안에서 정적 렌더링(SSG)과 동적 렌더링(SSR)을 유연하게 병행할 수 있게 됩니다.<br /><br />
사용자 입장에서는 빌드 시점에 렌더링된 정적인 부분이 먼저 빠르게 보이고, 리퀘스트에 따라 동적인 부분은 나중에 로딩되는 훨씬 쾌적한 경험을 할 수 있게 되는 거죠.<br />

```typescript
// app/page.tsx (PPR 예시)
export const experimental_ppr = true;
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <StaticSection /> {/* 빌드 시점에 렌더링되어 즉시 표시됩니다. */}
      <Suspense fallback={<Loading />}> {/* 동적 부분은 로딩 UI를 보여주다 나중에 렌더링됩니다. */}
        <DynamicSection /> {/* 리퀘스트 시점에 렌더링됩니다. */}
      </Suspense>
    </>
  );
}
```

### 2. 캐시 기본값 무효화 'use cache'로의 전환

Next.js의 캐시 전략은 그동안 개발자들 사이에서 복잡하고 예측하기 어렵다는 의견이 많았거든요.<br /><br />
특히 'Data Cache'와 'Router Cache'는 때때로 개발 경험을 저해하는 요인이 되기도 했습니다.<br /><br />
Next.js 팀은 이러한 캐시의 복잡성을 줄이고 개발자에게 더 세분화된 제어권을 주기 위해, 'use cache'라는 실험적인 기능을 통해 캐시 전략을 '경계(Boundary) 기반'으로 단순화하는 방향으로 나아가고 있습니다.<br /><br />
이번 Next.js 15의 '캐시 기본값 무효화'는 바로 이러한 `use cache` 중심의 새로운 캐시 전략으로 전환하기 위한 전 단계라고 할 수 있습니다.<br /><br />

`use cache`는 '라우트', '컴포넌트', '함수' 단위로 캐시 전략을 유연하게 지정할 수 있게 해주는데요.<br /><br />
PPR과 `use cache`를 함께 활용하면, 동적 렌더링되는 부분이라 할지라도 두 번째 호출부터는 캐시된 데이터를 반환하거나(기존 Data/Router Cache처럼), 특정 조건에 따라 온디맨드 또는 시간 기반으로 데이터를 재검증(기존 `revalidateTag` 또는 ISR처럼)하는 것이 가능해집니다.<br /><br />
이는 서버 측에서는 PPR과 `use cache`로 정적/동적 렌더링을 최적화하고, 클라이언트 측에서는 'React Compiler(실험판)'나 TanStack Query 같은 도구들을 함께 사용해서 전체적인 애플리케이션 성능을 극대화하는 방향으로 진화하고 있는 겁니다.<br />

```typescript
// next.config.ts (useCache 활성화)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    useCache: true, // use cache 기능을 활성화합니다.
  },
};
export default nextConfig;

// 파일 레벨에서 use cache 적용
'use cache'; // 이 파일 전체에 캐시를 적용합니다.

export default async function Page() {
  // ...
}

// 컴포넌트 레벨에서 use cache 적용
export async function MyComponent() {
  'use cache'; // 이 컴포넌트의 렌더링 결과를 캐시합니다.
  return <></>;
}

// 함수 레벨에서 use cache 적용
export async function getData() {
  'use cache'; // 이 함수의 실행 결과를 캐시합니다.
  const data = await fetch('/api/data');
  return data;
}
```

## 결론 AI 시대, 개발자의 역할

Next.js의 App Router는 아직 릴리스된 지 2년 정도밖에 되지 않은, 여전히 '진화 중'인 기술인데요.<br /><br />
그만큼 설계나 구현 과정에서 시행착오를 겪을 가능성이 높습니다.<br /><br />
이러한 상황에서 단순히 변경된 내용을 따라가기보다는, '왜 이런 변화가 생겼는지', '새로운 기능들이 어떤 가치를 제공하는지'를 깊이 있게 이해하는 것이 무엇보다 중요하다고 생각합니다.<br /><br />
특히 요즘처럼 AI가 코드를 빠르게 생성해내는 시대에는, AI가 제시하는 솔루션을 무작정 받아들이기보다는, 1차 정보를 바탕으로 스스로 판단하고 올바른 결정을 내릴 수 있는 비판적인 사고력과 깊이 있는 지식이 개발자에게 필수 역량이 될 겁니다.<br /><br />
Next.js 15 업데이트를 통해 여러분의 기술적 깊이를 한 단계 더 끌어올리는 계기가 되셨기를 바랍니다.<br /><br />
