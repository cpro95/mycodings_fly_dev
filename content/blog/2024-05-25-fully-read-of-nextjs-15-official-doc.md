---
slug: 2024-05-25-fully-read-of-nextjs-15-official-doc
title: Next.js 15 RC - 최신 기능 소개와 활용 방법
date: 2024-05-25 05:13:43.881000+00:00
summary: Next.js 15 RC - 최신 기능 소개와 활용 방법
tags: ["nextjs", "nextjs v15"]
contributors: []
draft: false
---

** 목 차 **

- [Next.js 15 RC - 최신 기능 소개와 활용 방법](#nextjs-15-rc---최신-기능-소개와-활용-방법)
  - [React](#react)
  - [캐싱](#캐싱)
  - [부분 프리렌더링(실험적)](#부분-프리렌더링실험적)
  - [next/after(실험적)](#nextafter실험적)
  - [create-next-app](#create-next-app)
  - [외부 패키지 번들링(안정적)](#외부-패키지-번들링안정적)
  - [React 19 RC](#react-19-rc)
  - [React Compiler(실험적)](#react-compiler실험적)
  - [하이드레이션 오류 개선](#하이드레이션-오류-개선)
  - [캐싱](#캐싱-1)
  - [부분 프리렌더링(실험적)](#부분-프리렌더링실험적-1)
  - [next/after(실험적)](#nextafter실험적-1)
  - [create-next-app 업데이트](#create-next-app-업데이트)
  - [외부 패키지 번들링 최적화(안정적)](#외부-패키지-번들링-최적화안정적)

---

Next.js 15 릴리스 후보(RC)가 이제 사용 가능합니다.

이 초기 버전에서는 다음 안정적인 릴리스 전에 최신 기능을 테스트할 수 있습니다.

### React
- React 19 RC 지원: React Compiler(실험적) 등장 및 하이드레이션 오류 개선.

### 캐싱
- fetch 요청, GET 라우트 핸들러, 클라이언트 네비게이션은 기본적으로 캐시되지 않음.

### 부분 프리렌더링(실험적)
- Layout 및 Page에 PPR을 옵트인하는 설정 추가.

### next/after(실험적)
- 응답 스트리밍 후 코드 실행을 위한 새로운 API 추가.

### create-next-app
- 초기 페이지 디자인 업데이트 및 Turbopack 사용을 위한 플래그 추가.

### 외부 패키지 번들링(안정적)
- AppRouter 및 PageRouter의 구성 옵션 추가.

오늘부터 Next.js 15 RC를 사용해보실 수 있습니다:

```bash
npm install next@rc react@rc react-dom@rc
```

Next.js 15 RC의 문서는 안정 버전이 출시될 때까지 [rc.nextjs.org/docs](https://rc.nextjs.org/docs)에서 확인할 수 있습니다.

### React 19 RC
Next.js AppRouter는 React canary 채널을 기반으로 구축되어, 개발자는 v19 릴리스 전에 새로운 React API를 사용하고 피드백을 제공할 수 있습니다.

Next.js 15 RC는 Actions와 같은 클라이언트와 서버 양쪽의 새로운 기능을 포함하는 React 19 RC를 지원합니다.

일부 서드파티 라이브러리는 React 19와 아직 호환되지 않을 수 있습니다.

### React Compiler(실험적)

React Compiler는 Meta의 React 팀이 만든 새로운 실험적 컴파일러입니다.

이 컴파일러는 JavaScript의 의미와 React의 규칙을 이해하여 코드를 자동으로 최적화합니다.

이를 통해 useMemo나 useCallback 같은 API를 통해 개발자가 수동으로 해야 하는 메모이제이션 작업을 줄여, 코드를 더 간단하고 유지보수하기 쉽게 만듭니다.

Next.js 15에서는 React Compiler 지원이 추가되었습니다.

먼저 `babel-plugin-react-compiler`를 설치합니다:

```bash
npm install babel-plugin-react-compiler
```

다음으로, `next.config.js`에 `experimental.reactCompiler` 옵션을 추가합니다:

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
};

module.exports = nextConfig;
```

다음과 같이 "옵트인" 모드로 실행하도록 컴파일러를 설정할 수도 있습니다:

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    reactCompiler: {
      compilationMode: 'annotation',
    },
  },
};

module.exports = nextConfig;
```

React Compiler에 대한 자세한 내용과 Next.js 설정 옵션은 [여기](https://link.to/react-compiler-docs)에서 확인하세요.

### 하이드레이션 오류 개선

Next.js 14.1에서는 에러 메시지와 하이드레이션 오류가 개선되었습니다.

Next.js 15에서는 하이드레이션 오류 표시가 더욱 개선되어, 오류의 소스 코드와 문제 해결 방법이 제시됩니다.

### 캐싱

Next.js AppRouter는 기본적으로 캐시가 활성화된 상태로 도입되었습니다.

그러나 이번 릴리스에서는 fetch 요청, GET 라우트 핸들러, 클라이언트 루터 캐시의 기본 설정이 캐시 있음에서 캐시 없음으로 변경되었습니다.

이전 동작을 유지하고 싶다면 여전히 캐시를 옵트인할 수 있습니다.

fetch 요청은 기본적으로 캐시되지 않습니다. Web fetch API의 캐시 옵션을 사용하여 서버 사이드 fetch 요청의 캐시 동작을 설정할 수 있습니다:

```javascript
fetch('https://...', { cache: 'force-cache' | 'no-store' });
```

Next.js 15에서는 캐시 옵션이 제공되지 않은 경우, 기본적으로 `no-store`가 사용됩니다.

즉, fetch 요청은 기본적으로 캐시되지 않습니다.

fetch 요청의 캐시를 활성화하려면 다음 방법을 사용할 수 있습니다:
- 각 fetch 호출에서 캐시 옵션을 `force-cache`로 설정
- 특정 라우트에 대해 `dynamic` 옵션을 `force-static`으로 설정
- 모든 fetch 요청에 대해 강제 캐시를 사용하도록 `fetchCache`를 `default-cache`로 설정

GET 라우트 핸들러도 기본적으로 캐시되지 않습니다.

`export dynamic = 'force-static'`과 같은 정적 라우트 설정 옵션을 사용하여 캐시를 활성화할 수 있습니다.

클라이언트 루터 캐시는 기본적으로 페이지 컴포넌트를 캐시하지 않습니다.

`staleTimes` 설정을 통해 이전 클라이언트 루터 캐시 동작으로 전환할 수 있습니다:

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
};

module.exports = nextConfig;
```

### 부분 프리렌더링(실험적)

Next.js 14에서는 부분 프리렌더링(PPR)을 도입했습니다.

PPR을 사용하면 동일한 페이지에서 정적 렌더링과 동적 렌더링을 결합할 수 있습니다.

특정 Layout 및 Page에서 PPR을 옵트인하려면 `experimental_ppr` 옵션을 추가합니다:

```javascript
// app/page.tsx
import { Suspense } from "react";
import { StaticComponent, DynamicComponent } from "@/app/ui";

export const experimental_ppr = true;

export default function Page() {
  return (
    <>
      <StaticComponent />
      <Suspense fallback={...}>
        <DynamicComponent />
      </Suspense>
    </>
  );
}
```

이 새로운 옵션을 사용하려면 `next.config.js` 파일의 `experimental.ppr`을 `incremental`로 설정해야 합니다:

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    ppr: 'incremental',
  },
};

module.exports = nextConfig;
```

### next/after(실험적)

`after()`는 응답 스트리밍이 완료된 후 작업을 예약할 수 있는 새로운 실험적 API입니다.

이를 통해 주요 응답을 차단하지 않고도 보조 작업을 수행할 수 있습니다.

새로운 API를 사용하려면 `next.config.js`에 `experimental.after`를 추가합니다:

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    after: true,
  },
};

module.exports = nextConfig;
```

그 다음, Server Components, Server Actions, Route Handlers 또는 Middleware에서 함수를 가져옵니다:

```javascript
import { unstable_after as after } from 'next/server';
import { log } from '@/app/utils';

export default function Layout({ children }) {
  // Secondary task
  after(() => {
    log();
  });

  // Primary task
  return <>{children}</>;
}
```

### create-next-app 업데이트

Next.js 15에서는 `create-next-app`을 새로운 디자인으로 업데이트했습니다.

`create-next-app`을 실행하면 로컬 개발에서 Turbopack을 활성화할지 묻는 프롬프트가 표시됩니다:

```bash
✔ Would you like to use Turbopack for next dev? … No / Yes
```

`--turbo` 플래그를 사용하여 Turbopack을 활성화할 수 있습니다:

```bash
npx create-next-app@rc --turbo
```

새 프로젝트를 더 쉽게 시작할 수 있도록 CLI에 `--empty` 플래그가 추가되었습니다.

이를 통해 최소한의 "hello world" 페이지로 시작할 수 있습니다:

```bash
npx create-next-app@rc --empty
```

### 외부 패키지 번들링 최적화(안정적)

외부 패키지를 번들링하면 애플리케이션의 초기 시작 성능이 향상됩니다.

App Router에서는 외부 패키지가 기본적으로 번들링되며, 새로운 `serverExternalPackages` 옵션을 사용하여 특정 패키지를 옵트아웃할 수 있습니다.

Pages Router에서는 외부 패키지가 기본적으로 번들링되지 않지만, 기존 `transpilePackages` 옵션을 사용하여 번들링할 패키지 목록을 제공할 수 있습니다.

이 설정 옵션에서는 각 패키지를 지정해야 합니다.

App Router와 Pages Router 간 설정을 통일하기 위해, App Router의 기본 자동 번들링과 일치하는 새로운 옵션 `bundlePagesRouterDependencies`를 도입합니다. 

필요한 경우 `serverExternalPackages`를 사용하여 특정 패키지를 옵트아웃할 수 있습니다:

```javascript
// next.config.js
const nextConfig = {
  // Automatically bundle external packages in the Pages Router:
  bundlePagesRouterDependencies: true,
  // Opt specific packages out of bundling for both App and Pages Router:
  serverExternalPackages: ['package-name'],
};

module.exports = nextConfig;
```

외부 패키지 번들링 최적화에 대한 자세한 내용은 [여기](https://rc.nextjs.org/docs/app/building-your-application/optimizing/package-bundling)를 참조하세요.