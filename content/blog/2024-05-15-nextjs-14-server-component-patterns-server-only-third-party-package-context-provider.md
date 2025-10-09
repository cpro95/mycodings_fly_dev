---
slug: 2024-05-15-nextjs-14-server-component-patterns-server-only-third-party-package-context-provider
title: Next.js 14 강좌 12편. 서버 컴포넌트 패턴 - 서버 전용 코드(server-only), 써드 파티 패키지, 컨텍스트 프로바이더(Context Provider) 활용하기
date: 2024-05-15 10:53:20.369000+00:00
summary: 서버 컴포넌트 패턴 - 서버 전용 코드, 써드 파티 패키지, 컨텍스트 프로바이더 활용하기
tags: ["next.js", "server component patterns", "server-only", "context provider", "third party package"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 열 두 번째입니다.

전체 강좌 리스트입니다.

1. [Next.js 14 강좌 1편. 라우팅의 모든 것](https://mycodings.fly.dev/blog/2024-01-13-nextjs-14-tutorial-1-all-about-routing)

2. [Next.js 14 강좌 2편. 레이아웃의 모든 것 and Link 컴포넌트](https://mycodings.fly.dev/blog/2024-01-14-nextjs-14-tutorial-2-all-about-layout-and-link-component)

3. [Next.js 14 강좌 3편. Template과 Loading 스페셜 파일](https://mycodings.fly.dev/blog/2024-04-20-nextjs-14-tutorial-template-and-loading-ui-special-files)

4. [Next.js 14 강좌 4편. 에러(Error) 처리의 모든 것](https://mycodings.fly.dev/blog/2024-04-27-nextjs-14-tutorial-all-about-error)

5. [Next.js 14 강좌 5편. 병렬 라우팅(Parallel Routes), 일치하지 않는 라우팅(Unmatched Routes), 조건부 라우팅(Conditional Routes) 알아보기](https://mycodings.fly.dev/blog/2024-04-28)

6. [Next.js 14 강좌 6편. 인터셉팅 라우팅(Intercepting Routes)과 병렬 인터셉팅 라우팅(Parallel Intercepting Routes) 살펴보기](https://mycodings.fly.dev/blog/2024-05-04-nextjs-14-tutorial-6-intercepting-routes-and-parallel-intercepting-routes)

7. [Next.js 14 강좌 7편. 라우트 핸들러의 기본(GET, POST, PATCH, DELETE)과 동적 라우트 핸들러 알아보기](https://mycodings.fly.dev/blog/2024-05-12-nextjs-14-tutorial-route-handler-get-post-patch-delete-method-and-dynamic-route-handler)

8. [Next.js 14 강좌 8편, 라우트 핸들러에서 URL 쿼리 파라미터와 redirect, Headers, Cookies 그리고 캐싱 방식 알아보기](https://mycodings.fly.dev/blog/2024-05-12-nextjs-14-tutorial-route-handler-and-url-query-parameter-redirect-headers-cookies-caching)

9. [Next.js 14 강좌 9편. 미들웨어(middleware) 설정 방법과 미들웨어에서의 rewrite, cookies, headers 처리 방법](https://mycodings.fly.dev/blog/2024-05-12-nextjs-14-tutorial-middleware-and-rewrite-cookies-headers-in-middleware)

10. [Next.js 14 강좌 10편. CSR부터 SSR, RSC까지 React의 렌더링의 역사 살펴보기](https://mycodings.fly.dev/blog/2024-05-14-nextjs-14-tutorial-all-about-rendering-csr-ssr-rsc)

11. [Next.js 14 강좌 11편. 렌더링 라이프사이클(Rendering Lifecycle)과 서버 렌더링 전략 세가지(정적 렌더링, 다이내믹 렌더링, 스트리밍)](https://mycodings.fly.dev/blog/2024-05-15-nextjs-14-tutorial-rendering-lifecycle-static-dynamic-rendering-and-streaming)

12. [Next.js 14 강좌 12편. 서버 컴포넌트 패턴 - 서버 전용 코드(server-only), 써드 파티 패키지, 컨텍스트 프로바이더(Context Provider) 활용하기](https://mycodings.fly.dev/blog/2024-05-15-nextjs-14-server-component-patterns-server-only-third-party-package-context-provider)

13. [Next.js 14 강좌 13편. 클라이언트 컴포넌트 패턴 - 클라이언트 전용 코드(client-only), 컴포넌트 배치, 서버-클라이언트 컴포넌트 섞어 활용하기](https://mycodings.fly.dev/blog/2024-05-15-nextjs-14-tutorial-client-component-patterns-client-only-client-component-placement-interleaving-server-and-client-components)

---

** 목 차 **

- [Server-only Code](#server-only-code)
  - [서버 및 클라이언트 컴포넌트 생성하기](#서버-및-클라이언트-컴포넌트-생성하기)
  - [서버 유틸리티 함수 생성하기](#서버-유틸리티-함수-생성하기)
  - [서버 및 클라이언트 컴포넌트에서 함수 활용하기](#서버-및-클라이언트-컴포넌트에서-함수-활용하기)
  - [server-only 패키지로 보안 강화하기](#server-only-패키지로-보안-강화하기)
  - [결론](#결론)
- [Third Party Packages](#third-party-packages)
  - [이미지 슬라이더 컴포넌트 생성하기](#이미지-슬라이더-컴포넌트-생성하기)
  - [요약](#요약)
- [Context Providers](#context-providers)
  - [테마 프로바이더 컴포넌트 생성하기](#테마-프로바이더-컴포넌트-생성하기)
  - [레이아웃에 테마 프로바이더 적용하기](#레이아웃에-테마-프로바이더-적용하기)
  - [클라이언트 컴포넌트에서 테마 사용하기](#클라이언트-컴포넌트에서-테마-사용하기)
  - [마무리](#마무리)

---

## Server-only Code

첫 번째 서버 컴포넌트 패턴에서는 서버 전용 코드를 분리하는 방법에 대해 이야기해보겠습니다.

Next.js 애플리케이션을 구축할 때, 일부 코드는 서버에서만 실행되어야 합니다.

예를 들어, 여러 라이브러리를 사용하거나 환경 변수를 활용하고, 데이터베이스에 직접 접근하거나 기밀 정보를 처리하는 모듈이나 함수들이 이에 해당됩니다.

자바스크립트 모듈은 서버와 클라이언트 컴포넌트 모두에서 공유될 수 있기 때문에, 서버 전용 코드가 의도치 않게 클라이언트에 포함될 수 있습니다.

서버 코드가 클라이언트 측 자바스크립트에 포함되면 번들 크기가 커질 뿐만 아니라, 비밀 키, 데이터베이스 쿼리, 민감한 비즈니스 로직 등이 노출될 수 있습니다.

따라서 애플리케이션의 보안과 무결성을 지키기 위해 서버 전용 코드를 클라이언트 측 코드와 분리하는 것이 매우 중요합니다.

이를 위해 `server-only`라는 패키지를 사용하여 개발자가 서버 전용 모듈을 클라이언트 컴포넌트에 잘못 가져오는 경우 빌드 타임 오류를 발생시킬 수 있습니다.

그럼 이제 VS Code에서 예시를 통해 알아보겠습니다.

---

### 서버 및 클라이언트 컴포넌트 생성하기

먼저 `app` 폴더에 서버 및 클라이언트 컴포넌트를 만들어보겠습니다.

1. **서버 컴포넌트**

`server-route/page.tsx` 파일을 만들고 간단한 React 컴포넌트를 정의합니다.

```tsx
// app/server-route/page.tsx
import React from 'react';
import { serverSideFunction } from '../../src/utils/server-utils';

export default function ServerRoutePage() {
  const result = serverSideFunction();
  console.log('Server route rendered');
  return <p>{result}</p>;
}
```

2. **클라이언트 컴포넌트**

동일한 `app` 폴더에 `client-route/page.tsx` 파일을 만들고 또 다른 React 컴포넌트를 삽입합니다.

```tsx
// app/client-route/page.tsx
'use client';

import React from 'react';
import { serverSideFunction } from '../../src/utils/server-utils';

export default function ClientRoutePage() {
  const result = serverSideFunction();
  console.log('Client route rendered');
  return <p>{result}</p>;
}
```

클라이언트 컴포넌트의 최상단에는 `use client` 지시문을 추가합니다.

---

### 서버 유틸리티 함수 생성하기

다음으로 `src` 폴더에 `utils`라는 새 폴더를 만들고 `server-utils.ts` 파일을 추가합니다.

여기서 서버에서만 사용하기 위한 함수 하나를 정의해보겠습니다.

이 함수의 구현 세부사항보다는 서버 전용 코드의 개념에 집중할 것이므로 간단한 로그 문구와 문자열 반환만 추가하겠습니다.

```typescript
// src/utils/server-utils.ts

export function serverSideFunction() {
  console.log('Server-only function executed');
  return 'Server-only result';
}
```

---

### 서버 및 클라이언트 컴포넌트에서 함수 활용하기

이제 서버 및 클라이언트 컴포넌트에서 이 함수를 가져와 호출해봅시다.

1. **서버 컴포넌트**

`server-route/page.tsx`에서 `const result = serverSideFunction()`으로 결과를 받아오고, `utils/server-utils`에서 서버 측 함수를 가져옵니다.

```tsx
// app/server-route/page.tsx
import React from 'react';
import { serverSideFunction } from '../../src/utils/server-utils';

export default function ServerRoutePage() {
  const result = serverSideFunction();
  console.log('Server route rendered');
  return <p>{result}</p>;
}
```

2. **클라이언트 컴포넌트**
 
`client-route/page.tsx`에서 `const result = serverSideFunction()`으로 결과를 받아와 단락 태그에 바인딩합니다.

그리고 최상단에서 함수를 가져옵니다.

```tsx
// app/client-route/page.tsx
'use client';

import React from 'react';
import { serverSideFunction } from '../../src/utils/server-utils';

export default function ClientRoutePage() {
  const result = serverSideFunction();
  console.log('Client route rendered');
  return <p>{result}</p>;
}
```

브라우저에서 `localhost:3000/server-route`로 이동하면 터미널에서만 로그 메시지가 보입니다.

왜냐하면 이 페이지 컴포넌트는 서버 컴포넌트이기 때문이죠.

클라이언트 컴포넌트인 `localhost:3000/client-route`에서는 콘솔에서 로그 메시지가 나타납니다.

---

### server-only 패키지로 보안 강화하기

서버 전용 함수가 클라이언트 측 번들에 포함되면 번들 크기가 커지고, 보안 문제가 생길 수 있습니다.

이를 방지하기 위해 `server-only` 패키지를 사용해보겠습니다.

```bash
npm install server-only
```

이제 개발자가 이 모듈을 클라이언트 측 컴포넌트에 잘못 가져오면 빌드 프로세스가 실패하며 오류를 알립니다.

```typescript
// src/utils/server-utils.ts
import 'server-only';

export function serverSideFunction() {
  console.log('Server-only function executed');
  return 'Server-only result';
}
```

---

### 결론

서버 전용 코드와 클라이언트 측 코드를 명확히 구분하는 것은 특히 민감한 데이터나 작업을 다룰 때 매우 중요합니다.

`server-only` 패키지를 사용하면 이러한 분리를 강제하여 애플리케이션의 보안, 성능 및 안정성을 유지할 수 있습니다.

---

## Third Party Packages

두 번째 서버 컴포넌트 패턴에서는 서드파티 패키지의 통합에 대해 알아보겠습니다.

서버 컴포넌트는 React에 새로운 패러다임을 도입했기 때문에 에코시스템 내 서드파티 패키지들도 점차 적응하고 있는데요,

클라이언트 기능에 의존하는 컴포넌트에 `use client` 지시어를 추가해 실행 환경을 명확히 구분하고 있습니다.

하지만 아직 많은 npm 패키지의 컴포넌트들은 이 지시어를 통합하지 않았다는 점을 주의해야 합니다.

`use client` 지시어가 없으면 이러한 컴포넌트들은 클라이언트 컴포넌트에서 제대로 작동하지만, 서버 컴포넌트에서는 문제가 발생하거나 아예 작동하지 않을 수 있습니다.

이 문제를 해결하려면 클라이언트 기능에 의존하는 서드파티 컴포넌트를 직접 만든 클라이언트 컴포넌트로 감싸야 합니다.

예제를 통해 어떻게 하는지 확인해볼게요.

이번 예제에서는 `react-slick` npm 패키지를 사용할 건데요, 이 패키지는 React 캐러셀 컴포넌트를 제공합니다.

이 컴포넌트는 클라이언트 측 기능을 사용하기 때문에 먼저 다음 패키지들을 설치해줍니다.

```bash
npm install react-slick slick-carousel @types/react-slick
```

설치가 완료되면 `react-slick`의 샘플 코드를 복사해서 `client-route/page.tsx` 클라이언트 컴포넌트에 붙여넣습니다.

```typescript
// client-route/page.tsx
'use client';

import Slider from 'react-slick';

export default function ClientRoutePage() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div>
            <h2>Image Slider</h2>
            <Slider {...settings}>
                <div>
                    <img src="https://via.placeholder.com/800x400" alt="Slide 1" />
                </div>
                <div>
                    <img src="https://via.placeholder.com/800x400" alt="Slide 2" />
                </div>
                <div>
                    <img src="https://via.placeholder.com/800x400" alt="Slide 3" />
                </div>
            </Slider>
        </div>
    );
}
```

CSS 파일에서 `image-slider.css` 코드를 복사해 `globals.css`에 붙여넣고, 색상을 검정색에서 흰색으로 변경합니다.

```css
/* globals.css */
body {
    background-color: #fff;
    color: #000;
}

.slick-prev:before,
.slick-next:before {
    color: #fff;
}
```

브라우저에서 `localhost:3000/client-route`로 이동하면 첫 번째 이미지를 확인할 수 있습니다.

이때 색상을 흰색으로 변경했으므로 두 개의 화살표도 잘 보일 거예요.

이제 `react-slick`을 서버 컴포넌트에 직접 통합해보겠습니다.

`client-route/page.tsx`의 코드를 `server-route/page.tsx`에 복사해 붙여넣어봅시다.

```typescript
// server-route/page.tsx
import Slider from 'react-slick';

export default function ServerRoutePage() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div>
            <h2>Image Slider</h2>
            <Slider {...settings}>
                <div>
                    <img src="https://via.placeholder.com/800x400" alt="Slide 1" />
                </div>
                <div>
                    <img src="https://via.placeholder.com/800x400" alt="Slide 2" />
                </div>
                <div>
                    <img src="https://via.placeholder.com/800x400" alt="Slide 3" />
                </div>
            </Slider>
        </div>
    );
}
```

하지만 `localhost:3000/server-route`로 이동하면 오류가 발생하는데요,

이는 `Slider` 컴포넌트가 클라이언트 측 기능을 사용하지만 `use client` 지시어가 없기 때문입니다.

이 문제를 해결하기 위해 서버 컴포넌트인 `ServerRoutePage`에 `use client` 지시어를 추가할 수도 있지만,

이렇게 하면 서버 측 기능(예: 데이터베이스 호출, 환경 변수 등)을 사용할 수 없게 됩니다.

따라서 클라이언트 기능에 의존하는 서드파티 컴포넌트를 직접 만든 클라이언트 컴포넌트로 감싸야 합니다.

---

### 이미지 슬라이더 컴포넌트 생성하기

`components` 폴더에 `image-slider.tsx`라는 새 파일을 만들고, 다음 코드를 추가합시다.

```typescript
// components/image-slider.tsx
'use client';

import Slider from 'react-slick';

export default function ImageSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div>
            <h2>Image Slider</h2>
            <Slider {...settings}>
                <div>
                    <img src="https://via.placeholder.com/800x400" alt="Slide 1" />
                </div>
                <div>
                    <img src="https://via.placeholder.com/800x400" alt="Slide 2" />
                </div>
                <div>
                    <img src="https://via.placeholder.com/800x400" alt="Slide 3" />
                </div>
            </Slider>
        </div>
    );
}
```

이제 `server-route/page.tsx`에서 `ImageSlider` 컴포넌트를 임포트해 사용해보겠습니다.

```typescript
// server-route/page.tsx
import ImageSlider from '../components/image-slider';

export default function ServerRoutePage() {
    return (
        <div>
            <h2>Server Route</h2>
            <ImageSlider />
        </div>
    );
}
```

브라우저에서 `localhost:3000/server-route`로 이동하면 문제가 해결된 것을 볼 수 있습니다.

---

### 요약

React 에코시스템의 서드파티 패키지들은 아직 전환 과정에 있기 때문에 많은 컴포넌트들이 `use client` 지시어를 통합하지 않았습니다.

따라서 이러한 컴포넌트를 우리가 직접 만든 클라이언트 컴포넌트로 감싸면 서버 컴포넌트 모델을 따르면서도 서드파티 패키지를 적극 활용할 수 있습니다.

---

## Context Providers

마지막 서버 컴포넌트 패턴으로 이번에는 컨텍스트 프로바이더를 사용하는 방법을 알아보겠습니다.

여러분도 아시다시피 React에서는 컨텍스트 프로바이더를 애플리케이션의 루트에 렌더링하여 전역 상태와 로직을 공유하는데요, 예를 들어 애플리케이션의 테마 같은 것을 말이죠.

하지만 서버 컴포넌트에서는 React 컨텍스트가 지원되지 않기 때문에 애플리케이션의 루트에서 컨텍스트를 생성하려고 하면 오류가 발생합니다.

이 문제를 해결하려면 컨텍스트를 생성하고 별도의 클라이언트 컴포넌트 안에 프로바이더를 렌더링해야 합니다.

VS Code로 들어가 예제를 통해 이를 이해해보도록 합시다.

Next.js 애플리케이션의 루트 파일은 `app` 폴더에 있는 `layout.tsx`인데요, 여기서 애플리케이션 전체에 테마 컨텍스트를 제공해보겠습니다.

먼저 `react`에서 `createContext`를 임포트하세요.

```typescript
import { createContext } from 'react';
```

테마 타입을 정의할 건데요, 이는 `primary`와 `secondary` 색상을 갖는 객체로 설정합니다.

```typescript
type Theme = {
    primary: string;
    secondary: string;
};
```

그리고 기본 테마를 정의합니다.

이 기본 테마는 `Theme` 타입을 갖습니다.

```typescript
const defaultTheme: Theme = {
    primary: '#0070f3',
    secondary: '#1a1a1a',
};
```

마지막으로, 테마 컨텍스트를 생성하고 초기값을 기본 테마로 설정합니다.

```typescript
const ThemeContext = createContext<Theme>(defaultTheme);
```

이제 `layout.tsx`에서 `body` 태그를 테마 컨텍스트 프로바이더로 감싸줍니다.

```typescript
// layout.tsx
import { ThemeContext } from './components/ThemeContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeContext.Provider value={defaultTheme}>{children}</ThemeContext.Provider>
            </body>
        </html>
    );
}
```

파일을 저장하고 브라우저에서 확인하면 오류가 발생하는 것을 볼 수 있습니다.

```sh
You're importing a component that needs createContext. It only works in a client component, but none of its parents are marked with "use client".
```

이는 `createContext`가 클라이언트 컴포넌트에서만 작동하기 때문인데요, `layout.tsx`를 클라이언트 컴포넌트로 변환하려면 상단에 `use client` 지시어를 추가하면 됩니다.

하지만 이렇게 하면 `layout.tsx`와 해당 파일이 임포트하는 모든 컴포넌트가 클라이언트 측에서 실행되도록 Next.js에 신호를 보내게 되죠. 이는 우리가 원하는 바가 아닙니다.

이 문제를 해결하려면 컨텍스트를 생성하고 프로바이더를 별도의 클라이언트 컴포넌트에 렌더링해야 합니다.

---

### 테마 프로바이더 컴포넌트 생성하기

`components` 폴더에 `theme-provider.tsx`라는 새 파일을 만들고, 다음 코드를 추가합니다.

```typescript
// theme-provider.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

type Theme = {
    primary: string;
    secondary: string;
};

const defaultTheme: Theme = {
    primary: '#0070f3',
    secondary: '#1a1a1a',
};

const ThemeContext = createContext<Theme>(defaultTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
    return <ThemeContext.Provider value={defaultTheme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}
```

클라이언트 컴포넌트임을 나타내기 위해 상단에 `use client` 지시어를 추가했고,

`ThemeProvider` 컴포넌트는 `ThemeContext.Provider`로 자식 컴포넌트를 감싸고 기본 테마를 제공합니다.

그리고 `useTheme` 훅을 만들어 쉽게 테마 컨텍스트에 접근할 수 있도록 했습니다.

---

### 레이아웃에 테마 프로바이더 적용하기

이제 `layout.tsx`에서 테마와 관련된 코드를 모두 제거하고, `ThemeProvider` 컴포넌트를 임포트해 사용합니다.

```typescript
// layout.tsx
import { ThemeProvider } from './components/theme-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
```

---

### 클라이언트 컴포넌트에서 테마 사용하기

테마가 잘 작동하는지 확인하기 위해 클라이언트 컴포넌트에서 테마를 사용해봅시다.

`page.tsx`를 다음과 같이 수정해봅니다.

```typescript
// page.tsx
'use client';

import { useTheme } from './components/theme-provider';

export default function ClientRoutePage() {
    const theme = useTheme();

    return (
        <div>
            <h1 style={{ color: theme.primary }}>Client Route</h1>
        </div>
    );
}
```

이제 브라우저에서 `/client-route`로 이동하면 `Client Route` 텍스트가 파란색으로 표시되는 것을 확인할 수 있습니다.

색상을 `theme.secondary`로 변경하면 회색으로 바뀌는 것도 확인할 수 있죠.

---

### 마무리

여기까지 서버 컴포넌트 패턴 중 컨텍스트 프로바이더를 다뤄봤습니다.

핵심은 서버 컴포넌트를 클라이언트 컴포넌트로 변환하지 않고, 별도의 클라이언트 컴포넌트를 만들어 이를 서버 컴포넌트에서 자식으로 사용하는 것이죠.
