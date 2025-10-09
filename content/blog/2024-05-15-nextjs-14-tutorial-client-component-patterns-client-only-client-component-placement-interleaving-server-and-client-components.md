---
slug: 2024-05-15-nextjs-14-tutorial-client-component-patterns-client-only-client-component-placement-interleaving-server-and-client-components
title: Next.js 14 강좌 13편. 클라이언트 컴포넌트 패턴 - 클라이언트 전용 코드(client-only), 컴포넌트 배치, 서버-클라이언트 컴포넌트 섞어 활용하기
date: 2024-05-15 11:57:16.485000+00:00
summary: 클라이언트 전용 코드, 컴포넌트 배치, 서버-클라이언트 컴포넌트 섞어 활용하기
tags: ["next.js", "client-component-patterns", "client-only", "interleaving server and client component", "client component placement"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 열 세 번째입니다.

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

- [Client-only Code](#client-only-code)
  - [예제 시작하기](#예제-시작하기)
    - [클라이언트 전용 함수 정의](#클라이언트-전용-함수-정의)
    - [클라이언트 컴포넌트에 함수 사용](#클라이언트-컴포넌트에-함수-사용)
    - [클라이언트 전용 코드 보호하기](#클라이언트-전용-코드-보호하기)
  - [서버 컴포넌트에서 클라이언트 전용 함수 사용 시 오류 처리](#서버-컴포넌트에서-클라이언트-전용-함수-사용-시-오류-처리)
  - [결론](#결론)
- [Client Component Placement](#client-component-placement)
  - [코드 살펴보기](#코드-살펴보기)
  - [브라우저에서 확인하기](#브라우저에서-확인하기)
  - [상태 추가하기](#상태-추가하기)
  - [`use client` 지시문이 미치는 영향](#use-client-지시문이-미치는-영향)
  - [클라이언트 컴포넌트 최적 배치](#클라이언트-컴포넌트-최적-배치)
  - [결론](#결론-1)
- [Interleaving Server and Client Components](#interleaving-server-and-client-components)
  - [서버 컴포넌트 만들기](#서버-컴포넌트-만들기)
  - [클라이언트 컴포넌트 만들기](#클라이언트-컴포넌트-만들기)
  - [페이지 컴포넌트 만들기](#페이지-컴포넌트-만들기)
  - [다양한 패턴 살펴보기](#다양한-패턴-살펴보기)
    - [패턴 1: 서버 컴포넌트에서 서버 컴포넌트 임포트하기](#패턴-1-서버-컴포넌트에서-서버-컴포넌트-임포트하기)
    - [패턴 2: 클라이언트 컴포넌트에서 클라이언트 컴포넌트 임포트하기](#패턴-2-클라이언트-컴포넌트에서-클라이언트-컴포넌트-임포트하기)
    - [패턴 3: 서버 컴포넌트에서 클라이언트 컴포넌트 임포트하기](#패턴-3-서버-컴포넌트에서-클라이언트-컴포넌트-임포트하기)
    - [패턴 4: 클라이언트 컴포넌트에서 서버 컴포넌트 임포트하기](#패턴-4-클라이언트-컴포넌트에서-서버-컴포넌트-임포트하기)
    - [해결 방법: 서버 컴포넌트를 프롭스로 전달하기](#해결-방법-서버-컴포넌트를-프롭스로-전달하기)
  - [마무리](#마무리)

---

## Client-only Code

첫 번째 클라이언트 컴포넌트 패턴에서는 클라이언트 전용 코드를 분리하는 방법에 대해 이야기해보겠습니다.

이전 글에서 Next.js 애플리케이션의 서버 전용 코드 개념에 대해 소개했었죠.

이번 글에서는 그 반대로 클라이언트 전용 코드에 초점을 맞추려고 합니다.

서버에서 특정 작업을 제한하는 것이 중요하듯이, 클라이언트 측에서도 특정 기능을 제한하는 것이 중요합니다.

클라이언트 전용 코드는 일반적으로 DOM, `window` 객체, 로컬 스토리지 등 서버에서는 사용할 수 없는 브라우저 특화 기능과 상호작용합니다.

이러한 코드를 클라이언트 측에서만 실행하면 서버 측 렌더링 중에 발생할 수 있는 오류를 방지할 수 있습니다.

클라이언트 코드가 서버 측에서 실행되는 것을 방지하기 위해 `client-only` 패키지를 사용할 수 있습니다.

VS Code에서 예시를 통해 알아보도록 하겠습니다.

---

### 예제 시작하기

이전에 만든 `server-route` 서버 컴포넌트와 `client-route` 클라이언트 컴포넌트가 이미 있죠?

이제 이 두 컴포넌트에 클라이언트 전용 코드를 추가해보겠습니다.

---

#### 클라이언트 전용 함수 정의

1. `src` 폴더 내 `utils` 폴더에 `client-utils.ts`라는 파일을 만듭니다.

2. 여기서 클라이언트 전용 함수를 정의합니다. 이 함수는 브라우저 특화 기능에 의존할 수 있습니다. 예를 들어 `window` 객체나 로컬 스토리지 등이 있습니다.

```typescript
// src/utils/client-utils.ts
export function clientSideFunction() {
  console.log('Client-only function executed');
  return 'Client-only result';
}
```

---

#### 클라이언트 컴포넌트에 함수 사용

1. `client-route/page.tsx` 파일에서 클라이언트 전용 함수를 가져와 사용합니다. 클라이언트 컴포넌트이므로 이 함수는 클라이언트 측에서만 실행됩니다.

2. `console.log`를 통해 해당 함수가 제대로 실행되는지 확인합니다.

```tsx
// app/client-route/page.tsx
'use client';

import React from 'react';
import { clientSideFunction } from '../../src/utils/client-utils';

export default function ClientRoutePage() {
  const result = clientSideFunction();
  console.log('Client route rendered');
  return <h1>{result}</h1>;
}
```

이제 이 컴포넌트를 브라우저에서 렌더링하면 콘솔에 로그 메시지가 나타날 것입니다.

---

#### 클라이언트 전용 코드 보호하기

클라이언트 전용 코드를 보호하려면 `client-only` 패키지를 설치하고 사용해야 합니다.

```bash
npm install client-only
```

이제 이 패키지를 사용하여 클라이언트 전용 코드를 서버 측에 잘못 포함하지 않도록 보호할 수 있습니다.

```typescript
// src/utils/client-utils.ts
import 'client-only';

export function clientSideFunction() {
  console.log('Client-only function executed');
  return 'Client-only result';
}
```

---

### 서버 컴포넌트에서 클라이언트 전용 함수 사용 시 오류 처리

이제 클라이언트 전용 함수를 서버 컴포넌트인 `server-route/page.tsx`에서 사용해봅시다.

그러면 빌드 프로세스가 실패하면서 오류 메시지를 보여줄 것입니다.

```tsx
// app/server-route/page.tsx
import React from 'react';
import { clientSideFunction } from '../../src/utils/client-utils';

export default function ServerRoutePage() {
  const result = clientSideFunction();
  console.log('Server route rendered');
  return <h1>{result}</h1>;
}
```

터미널에서 오류 메시지를 확인할 수 있습니다.

이렇게 하면 개발자에게 클라이언트 전용 코드의 부적절한 사용을 알려줄 수 있습니다.

---

### 결론

서버 전용 코드가 격리되어야 하듯이, 클라이언트 전용 코드도 클라이언트 측에만 제한되어야 합니다.

`client-only` 패키지는 클라이언트 코드를 보호하여 애플리케이션의 안정성과 유지 보수성을 향상시켜줍니다.

---

## Client Component Placement

두 번째이자 마지막 클라이언트 컴포넌트 패턴으로 이번에는 컴포넌트 트리 내 클라이언트 컴포넌트의 위치에 대해 이야기해보겠습니다.

이 부분은 애플리케이션의 성능을 최적화하는 데 중요한 역할을 합니다.

서버 컴포넌트가 상태 관리와 상호작용을 처리할 수 없기 때문에, 클라이언트 컴포넌트를 만들어야 합니다.

이때 이러한 클라이언트 컴포넌트를 컴포넌트 트리 내에서 가능한 한 하위에 배치하는 것이 좋습니다.

왜 그런지 알아보기 위해 VS Code로 돌아가 살펴보겠습니다.

`landing-page`라는 새로운 라우트를 만들었고, `components` 폴더에 `NavBar`, `NavLinks`, `NavSearch`라는 세 개의 컴포넌트를 만들었습니다.

코드를 살펴보기 전에 이 컴포넌트들이 어떻게 구성되어 있는지 시각화해볼게요.

상단에 네비게이션 바가 있고, 그 아래 메인 섹션이 있는 랜딩 페이지를 상상해보세요.

네비게이션 바는 바깥쪽 래퍼인 `NavBar` 컴포넌트로 감싸져 있고, 그 안에 다양한 링크를 위한 `NavLinks` 컴포넌트와 사이트 내 검색을 위한 검색 바를 포함한 `NavSearch` 컴포넌트가 있습니다.

이렇게 하면 랜딩 페이지 컴포넌트가 맨 위에 있고, 그 아래에 `NavBar`와 메인 컴포넌트가 있으며, `NavBar` 안에는 `NavLinks`와 `NavSearch`가 있는 간단한 컴포넌트 트리가 완성됩니다.

코드를 함께 살펴보겠습니다.

---

### 코드 살펴보기

먼저 `landing-page/page.tsx` 파일에는 `NavBar`와 메인 섹션이 있습니다.

메인 섹션은 간단한 `<h1>` 헤딩을 표시합니다.

```tsx
// app/landing-page/page.tsx
import React from 'react';
import NavBar from '../components/NavBar';

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <h1>Page Heading</h1>
      </main>
    </>
  );
}
```

`NavBar` 컴포넌트에는 `NavLinks`와 `NavSearch` 컴포넌트가 포함되어 있습니다.

두 컴포넌트는 간단한 텍스트를 출력합니다.

```tsx
// app/components/NavBar.tsx
import React from 'react';
import NavLinks from './NavLinks';
import NavSearch from './NavSearch';

export default function NavBar() {
  console.log('NavBar rendered');
  return (
    <nav>
      <NavLinks />
      <NavSearch />
    </nav>
  );
}
```

```tsx
// app/components/NavLinks.tsx
import React from 'react';

export default function NavLinks() {
  console.log('NavLinks rendered');
  return <p>List of Nav Links</p>;
}
```

```tsx
// app/components/NavSearch.tsx
import React from 'react';

export default function NavSearch() {
  console.log('NavSearch rendered');
  return <input type="text" placeholder="Search..." />;
}
```

모든 컴포넌트에 로그 문구를 추가하여 각 컴포넌트가 렌더링되는지 확인할 수 있습니다.

이 단계에서는 각 컴포넌트의 구현 세부사항보다 컴포넌트 트리의 계층 구조에 초점을 맞추고 있습니다.

---

### 브라우저에서 확인하기

브라우저에서 `localhost:3000/landing-page`로 이동하면 개발자 도구 콘솔에 로그 문구가 나타나지 않는 것을 볼 수 있습니다.

왜냐하면 모든 컴포넌트가 기본적으로 서버 컴포넌트이기 때문입니다.

대신 터미널에서는 `NavBar rendered`, `NavLinks rendered`, `NavSearch rendered` 로그 문구를 볼 수 있습니다.

### 상태 추가하기

현재 `NavSearch`는 상태가 없습니다.

검색 입력 값을 추적하기 위해 상태 변수를 도입해보겠습니다.

`NavBar` 컴포넌트에 상태 변수를 추가하고 이를 `NavSearch`에 프롭스로 전달해보겠습니다.

```tsx
// app/components/NavBar.tsx
import React, { useState } from 'react';
import NavLinks from './NavLinks';
import NavSearch from './NavSearch';

export default function NavBar() {
  const [search, setSearch] = useState('');

  console.log('NavBar rendered');
  return (
    <nav>
      <NavLinks />
      <NavSearch search={search} setSearch={setSearch} />
    </nav>
  );
}
```

그러나 파일을 저장하면 `NavBar` 컴포넌트가 클라이언트 컴포넌트가 아니기 때문에 오류가 발생합니다.

이를 해결하려면 최상단에 `use client` 지시문을 추가하면 됩니다.

```tsx
// app/components/NavBar.tsx
'use client';

import React, { useState } from 'react';
import NavLinks from './NavLinks';
import NavSearch from './NavSearch';

export default function NavBar() {
  const [search, setSearch] = useState('');

  console.log('NavBar rendered');
  return (
    <nav>
      <NavLinks />
      <NavSearch search={search} setSearch={setSearch} />
    </nav>
  );
}
```

파일을 저장하고 페이지를 다시 로드하면 이제 세 개의 컴포넌트 모두 브라우저에서 렌더링되며 로그 문구가 콘솔에 나타납니다.

로그가 두 번 나타나는 것은 React의 `strict mode` 때문이지만, 빌드된 애플리케이션에서는 한 번만 나타날 것이므로 걱정하지 않아도 됩니다.

---

### `use client` 지시문이 미치는 영향

`NavBar` 컴포넌트에 `use client` 지시문을 추가하면 이 지시문이 해당 컴포넌트뿐만 아니라 트리 내 모든 하위 컴포넌트에도 영향을 미칩니다.

즉, `NavLinks`와 `NavSearch`도 클라이언트 컴포넌트가 됩니다.

`use client` 지시문을 경계로 삼으면 이후의 모든 컴포넌트는 클라이언트 측에서 동작하게 됩니다.

이는 클라이언트 컴포넌트로 변경된 서버 컴포넌트의 하위 트리 전체가 클라이언트 컴포넌트가 되어 해당 코드가 전부 브라우저로 전송된다는 것을 의미합니다.

따라서 서버 컴포넌트의 이점을 모두 잃게 됩니다.

---

### 클라이언트 컴포넌트 최적 배치

그래서 클라이언트 컴포넌트는 컴포넌트 트리에서 가능한 한 하위에, 이상적으로는 리프(leaf) 컴포넌트로 배치하는 것이 좋습니다.

우리 예제에서 `NavBar`를 다시 서버 컴포넌트로 바꾸고, `NavSearch`만 클라이언트 컴포넌트로 변경해봅시다.

`NavSearch`만 상태를 필요로 하기 때문입니다.

```tsx
// app/components/NavBar.tsx
import React from 'react';
import NavLinks from './NavLinks';
import NavSearch from './NavSearch';

export default function NavBar() {
  console.log('NavBar rendered');
  return (
    <nav>
      <NavLinks />
      <NavSearch />
    </nav>
  );
}
```

```tsx
// app/components/NavSearch.tsx
'use client';

import React, { useState } from 'react';

export default function NavSearch() {
  const [search, setSearch] = useState('');

  console.log('NavSearch rendered');
  return (
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
```

이제 페이지를 다시 로드하면 콘솔에 `NavSearch`만 클라이언트 측에서 실행되는 것을 확인할 수 있습니다.

---

### 결론

클라이언트 컴포넌트를 앱 라우터 내에서 가능하면 컴포넌트 트리의 최하위에 배치하세요.

그래야 서버 컴포넌트의 이점을 최대한 활용하면서 클라이언트 컴포넌트도 효과적으로 사용할 수 있습니다.

---

## Interleaving Server and Client Components

> "서버 컴포넌트와 클라이언트 컴포넌트 섞어서 사용하기"

이번 섹션의 마지막 영상에서는 렌더링과 관련하여 서버 컴포넌트와 클라이언트 컴포넌트의 혼합 사용에서 지원되는 패턴과 지원되지 않는 패턴에 대해 이야기해볼게요.

예제를 통해 알아보는 것이 가장 이해하기 쉬우니 바로 코드를 살펴봅시다.

먼저 `app` 폴더에 새로운 라우트를 만들고 폴더 이름을 `interleaving`으로 지어줍니다.

그리고 폴더 안에 `page.tsx` 파일을 만들어주세요. 페이지 컴포넌트 코드를 쉽게 작성하기 위해 `pieces` 확장 기능을 사용하면 좋습니다.

다음으로, `components` 폴더에 서버 컴포넌트와 클라이언트 컴포넌트를 위한 두 개의 파일을 만듭니다.

### 서버 컴포넌트 만들기

먼저 `server-component-1.tsx`라는 이름으로 새 파일을 만들고, `pieces` 확장 기능을 사용해 서버 컴포넌트 코드를 추가하세요.

```typescript
// server-component-1.tsx
import fs from 'fs';

export default function ServerComponentOne() {
    // 서버 전용 작업 수행 (예: 파일 시스템 읽기)
    fs.readFileSync('/path/to/file');
    return <h1>Server Component One</h1>;
}
```

이 파일을 복사해서 `server-component-2.tsx`라는 이름의 파일로 붙여넣은 후, 컴포넌트 이름과 헤딩을 각각 두 번째 컴포넌트에 맞게 수정합니다.

```typescript
// server-component-2.tsx
import fs from 'fs';

export default function ServerComponentTwo() {
    // 서버 전용 작업 수행 (예: 파일 시스템 읽기)
    fs.readFileSync('/path/to/file');
    return <h1>Server Component Two</h1>;
}
```

---

### 클라이언트 컴포넌트 만들기

다음으로, `components` 폴더에서 `client-component-1.tsx`라는 파일을 만들고 클라이언트 컴포넌트 코드를 추가하세요.

```typescript
// client-component-1.tsx
'use client';

import { useState } from 'react';

export default function ClientComponentOne() {
    const [name] = useState('Batman');
    return <h1>Client Component One</h1>;
}
```

이 파일을 복사해서 `client-component-2.tsx` 파일로 붙여넣고 컴포넌트 이름과 헤딩을 각각 두 번째 컴포넌트에 맞게 수정합니다.

```typescript
// client-component-2.tsx
'use client';

import { useState } from 'react';

export default function ClientComponentTwo() {
    const [name] = useState('Superman');
    return <h1>Client Component Two</h1>;
}
```

---

### 페이지 컴포넌트 만들기

이제 `page.tsx` 파일에서 페이지 컴포넌트를 작성해보겠습니다.

```typescript
// page.tsx
import ServerComponentOne from './components/server-component-1';
import ClientComponentOne from './components/client-component-1';

export default function InterleavingPage() {
    return (
        <div>
            <ServerComponentOne />
            <ClientComponentOne />
        </div>
    );
}
```

---

### 다양한 패턴 살펴보기

#### 패턴 1: 서버 컴포넌트에서 서버 컴포넌트 임포트하기

`page.tsx`에서 `ServerComponentOne`을 임포트하고, `ServerComponentOne` 내부에서 `ServerComponentTwo`를 임포트하여 사용해보겠습니다.

```typescript
// server-component-1.tsx
import fs from 'fs';
import ServerComponentTwo from './server-component-2';

export default function ServerComponentOne() {
    fs.readFileSync('/path/to/file');
    return (
        <div>
            <h1>Server Component One</h1>
            <ServerComponentTwo />
        </div>
    );
}
```

브라우저에서 `/interleaving`으로 이동하면 문제가 없이 작동하는 것을 확인할 수 있습니다.

#### 패턴 2: 클라이언트 컴포넌트에서 클라이언트 컴포넌트 임포트하기

`page.tsx`에서 `ClientComponentOne`을 임포트하고, `ClientComponentOne` 내부에서 `ClientComponentTwo`를 임포트하여 사용해보겠습니다.

```typescript
// client-component-1.tsx
'use client';

import { useState } from 'react';
import ClientComponentTwo from './client-component-2';

export default function ClientComponentOne() {
    const [name] = useState('Batman');
    return (
        <div>
            <h1>Client Component One</h1>
            <ClientComponentTwo />
        </div>
    );
}
```

브라우저에서 `/interleaving`으로 이동하면 클라이언트 컴포넌트가 정상적으로 작동하는 것을 확인할 수 있습니다.

#### 패턴 3: 서버 컴포넌트에서 클라이언트 컴포넌트 임포트하기

`ServerComponentOne` 내부에서 클라이언트 컴포넌트인 `ClientComponentOne`을 임포트하여 사용해보겠습니다.

```typescript
// server-component-1.tsx
import fs from 'fs';
import ClientComponentOne from './client-component-1';

export default function ServerComponentOne() {
    fs.readFileSync('/path/to/file');
    return (
        <div>
            <h1>Server Component One</h1>
            <ClientComponentOne />
        </div>
    );
}
```

브라우저에서 `/interleaving`으로 이동하면 이 패턴도 문제가 없이 작동하는 것을 확인할 수 있습니다.

#### 패턴 4: 클라이언트 컴포넌트에서 서버 컴포넌트 임포트하기

이번에는 클라이언트 컴포넌트인 `ClientComponentOne` 내부에서 서버 컴포넌트인 `ServerComponentOne`을 임포트하여 사용해보겠습니다.

```typescript
// client-component-1.tsx
'use client';

import { useState } from 'react';
import ServerComponentOne from './server-component-1';

export default function ClientComponentOne() {
    const [name] = useState('Batman');
    return (
        <div>
            <h1>Client Component One</h1>
            <ServerComponentOne />
        </div>
    );
}
```

이제 브라우저에서 `/interleaving`으로 이동하면 오류가 발생합니다.

`FS` 모듈을 찾을 수 없다는 오류 메시지가 나타나는데요, 이는 클라이언트 컴포넌트 내부에 서버 컴포넌트를 임포트하면 해당 서버 컴포넌트가 자동으로 클라이언트 컴포넌트로 변환되기 때문입니다.

클라이언트 측에서 서버 모듈을 사용할 수 없으므로 오류가 발생하는 것이죠.

---

#### 해결 방법: 서버 컴포넌트를 프롭스로 전달하기

이 문제를 해결하려면 서버 컴포넌트를 클라이언트 컴포넌트 내부에 직접 임포트하지 않고, 페이지 컴포넌트에서 프롭스로 전달하는 방식을 사용할 수 있습니다.

```typescript
// page.tsx
import ServerComponentOne from './components/server-component-1';
import ClientComponentOne from './components/client-component-1';

export default function InterleavingPage() {
    return (
        <ClientComponentOne>
            <ServerComponentOne />
        </ClientComponentOne>
    );
}
```

```typescript
// client-component-1.tsx
'use client';

import { ReactNode } from 'react';
import { useState } from 'react';

interface ClientComponentOneProps {
    children: ReactNode;
}

export default function ClientComponentOne({ children }: ClientComponentOneProps) {
    const [name] = useState('Batman');
    return (
        <div>
            <h1>Client Component One</h1>
            {children}
        </div>
    );
}
```

이제 브라우저에서 `/interleaving`으로 이동하면 오류 없이 작동하는 것을 확인할 수 있습니다.

---

### 마무리

이번 섹션에서는 렌더링에 대해 다양한 주제를 다뤘습니다.

클라이언트 측 렌더링, 서버 측 렌더링, 서버 컴포넌트와 클라이언트 컴포넌트의 혼합 사용 패턴까지 모두 다뤘는데요, 이제 Next.js 앱 라우터에서 렌더링에 대해 전반적으로 이해하셨을 거라 생각합니다.
