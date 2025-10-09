---
slug: 2024-04-20-nextjs-14-tutorial-template-and-loading-ui-special-files
title: Next.js 14 강좌 3편. Template과 Loading 스페셜 파일
date: 2024-04-20 09:52:03.752000+00:00
summary: template.tsx 파일과 loading.tsx 스페셜 파일
tags: ["next.js", "template", "loading"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 세 번째입니다.

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

- [Next.js 14 강좌 3편. Template과 Loading 스페셜 파일](#nextjs-14-강좌-3편-template과-loading-스페셜-파일)
  - [layout.tsx 파일과 사촌인 template.tsx 스페셜 파일](#layouttsx-파일과-사촌인-templatetsx-스페셜-파일)
  - [loading.tsx 스페셜 파일](#loadingtsx-스페셜-파일)

---

## layout.tsx 파일과 사촌인 template.tsx 스페셜 파일

지금까지 2편에서 배운 Layout 관련해서 지금까지 배운 Next.js의 Special Files는 아래와 같습니다.

- page.tsx
- layout.tsx
- not-found.tsx

이번 시간에는 template.tsx 파일이라는 스페셜 파일을 배워보겠습니다.

template.tsx 파일은 layout.tsx 파일과 비슷합니다.

그 차이를 비교 설명하기 위해 간단한 예를 들어 보겠습니다.

지난 시간에 auth 관련 라우팅을 그룹화 했었는데요.

바로 '(auth)' 폴더입니다.

```sh
(auth)
├── (with-layout)
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   └── register
│       └── page.tsx
├── forgot-password
│   └── page.tsx
└── layout.tsx
```

'(with-layout)' 이라고 또 라우팅 그룹화 했었는데요.

template.tsx 파일을 테스트하기 위해서 '(auth)' 밑에 있는 layout.tsx 파일을 이용해서 진행해 보겠습니다.

왜냐하면 이 파일은 'use client' 태그가 있으니까요.

useState라는 클라이언트 사이드 리액트 훅을 이용할 거라서 그렇습니다.

먼저, layout.tsx 파일에 아래와 같이 useState를 이용한 input 태그를 추가하겠습니다.

```js
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { name: "Register", href: "/register" },
  { name: "Login", href: "/login" },
  { name: "Forgot Password", href: "/forgot-password" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [input, setInput] = useState("");

  return (
    <div>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="input..."
          className="border-2 px-4 py-2 mb-4"
        ></input>
      </div>
      <nav className="flex space-x-2 border-b-2 mb-2">
      ...
      ...
      ...
      // 중간 생략
  )
}    
```

위와 같이 useState를 이용해서 input 태그를 넣었습니다.

이제 해당 input 태그에 아무 글이나 써 넣을까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhTb8ERmW6zlCWtdZxTq0S0F6zzgcqGGxprqEhGnBq6Q52S3hBN8ws26MYQ8Q_HinsRg-6dEEWTDNaRBRkvsOBKrdRt1TGIAGBs4zAZXNArNMW-Oxf7vgHcwaGwlg3-yHgOSUjOO2yKHE4dNM891LU5FtQtViEp62s4NaX_Tfa3X7fpx5QZpRq4oof9rSI)

위 그림과 같이 아무 글자나 넣었습니다.

그리고 현재 라우팅은 'http://localhost:3000/register' 인데요.

Login 라우팅으로 이동해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEivf90eezPLirSQEpIfp8uABzSETTVF6IkXao8uJW1NKg0ymt6zVkCfRdhhZnd2qKVaDfRRjSIsore6ZMn-aDeKxxp9dGV2hIiX1OuFSk7a1TqS3D9VLPwi1SRa2WbkJ4WaQJ1-r8d_S8KahwaP47HJHCZ7aIyGH69HF7M2i_6WJNuFz3aVsSgRGgV6dMU)

위와 같이 input 태그에 있던 글자는 아무 변경이 없네요.

그러면 '(with-layout)' 이란 라우팅 그룹이 아닌 forgot-password 라우팅으로도 이동해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg84ro0G_0C8P29JbB9wpSRuoB3heT9O4UqPW4dxpJHhbRCru1OwV4y25iKVtLt3KB6ivP6e2Vg8lwpYuUvaU0B5HsB2cz7uOU-uNLGNQ3bnBrgAwxr0_yjY76I7Ies7z9I1BwPyWUVAdXad8kcjPIu4JGTQrGJRStK69FVd5loo3RKqeU65_nT352qpHk)

위와 같이 input 태그에는 변화가 없습니다.

이걸로 layout.tsx 파일의 역할을 알 수 있는데요.

레이아웃 밑에 있는 라우팅은 기본적으로 해당 layout.tsx 파일 밑에 children으로 존재합니다.

그리고 layout.tsx 파일 밑에 있는 라우팅 이동시에는 해당 라우팅의 상위 레이아웃 파일을 새로 불러오지 않는거죠.

이게 바로 Next.js의 새로운 기능입니다.

이런 layout.tsx 파일과 반대 역할을 하는 게 있는데요.

바로 template.tsx 파일입니다.

이 파일은 layout.tsx 파일과 같이 존재할 수 있습니다.

Next.js의 로딩 순서는 layout.tsx 파일을 먼저 로드하고 그 다음에 template.tsx 파일을 로드하는데요.

보통 template.tsx 파일이 레이아웃 역할을 하기 때문에 layout.tsx 파일과 같이 사용할 하등의 이유가 없죠.

그래서 보통 layout.tsx 파일 없이 template.tsx 파일만 존재합니다.

Javascript를 사용한다면 template.js 이란 이름의 파일도 가능합니다.

그러면 layout.tsx 파일의 이름을 template.tsx 파일로 바꾸겠습니다.

```sh
(auth)
├── (with-layout)
│   ├── layout.tsx
│   ├── login
│   │   └── page.tsx
│   └── register
│       └── page.tsx
├── forgot-password
│   └── page.tsx
└── template.tsx
```

위와 같이 '(auth)' 밑에는 layout.tsx 파일이 없고 templat.tsx 파일만 있습니다.

이제 다시 input 태그에 글을 써보고 라우팅을 이동해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEieAFf44a4j-vZdSW_pjZj4a6Hg2BveNtKPQojgWReumyZTnRJg5yqHWuLErjuLEIVGgGnfC7B5wsz8OYfjpfjXSMHHDjBqMhsCTlIzNREpjRJg9y68JWFv0XfjfdWnrz3_A0iMWJaX2vMsEByOAnEJ1BNf4WBUdbggVaOsY8EejfSjKMsQuexRQgqzJ6c)

일단 위와 같이 register 라우팅에서 글자를 적고 login으로 이동해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi8O6blHaQJ0xJIPhx0Q4DhoXm4CmQGZg_JOUrsNbXA3mxNcIsL0YAZNNIxkt-asJ1MULFSKn3twIJ_nu8stBv1tSoL6M5r_gkqwvOKKJ5MvvCE9kF0IewetAnOufcT_N9StQ-r6KqFKPSP1dcnICXL-hvX74ciHQebPxUoXh-J7KEXkTQ6omJQz5DpKxM)

위와 같이 login으로 이동했습니다.

input 태그의 글자가 그대로입니다.

그러면 마지막으로 forgot-password 라우팅으로 이동해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi0rTUT114D54PNwhcDHskhIjp_ufGpq31J2eJ4IWZEXDcVWZbZ1K77Q3oTNl-1wcxP3Wwtr-tuRLYXkdEgLjaaOX73QWcyhRTPP6nTRY4I9q7ODjljpcORJfrb1xRWTDmAQyip4ElcTM9XY00gIRWy3oWkR-GWC-lv7cjeP1uVvjNmYPdg2YRbTN6mPws)

위와 같이 input 태그의 내용이 사라졌습니다.

왜 그런걸까요?

바로 tempate.tsx 파일의 역할인데요.

우리가 만든 '(auth)' 라우팅 그룹 밑에 보면 '(with-layout)'이란 하위 라우팅 그룹이 있습니다.

이 파일에는 register와 login  라우팅이 있죠.

그리고 '(with-layout)'이란 라우팅 그룹 밖에 있는 forgot-password 라우팅에서는 input 태그의 값이 사라졌습니다.

즉, forgot-password 라우팅에서는 template.tsx 파일에 있던 내용이 다시 로드됐다는 뜻입니다.

여기서 중요한게 Next.js의 작동 방식인데요.

template.tsx 파일이 있으면 이 template.tsx 파일 밑에 있는 라우팅 이동시 컴포넌트를 새로 마운트하고 DOM도 새로 만들어지고, 그리고 state(상태)도 지워집니다.

당연히 useEffect의 이펙트 효과도 다시 작동하죠.

그러나 '(with-layout)' 밑에 있는 라우팅은 register, login 라우팅 왜 template.tsx 파일이 작동되지 않을까요?

이건 Next.js의 작동방식인데요.

template.tsx 파일은 이 파일 바로 한단계 밑에 있는 폴더만 적용됩니다.

login, register 모두 중간에 '(with-layout)'이란 폴더가 존재해서 적용되지 않는거죠.

이제 template.tsx 파일의 작동방식을 대충 이해하셨을 겁니다.

layout.tsx 파일만 있는건 아니니까 template.tsx 파일도 알아 두시는게 좋겠습니다.

---

## loading.tsx 스페셜 파일

지금까지 배운 Next.js의 스페셜 파일은 아래와 같습니다.

- page.tsx
- layout.tsx
- not-found.tsx
- template.tsx

이제 마지막 스페셜 파일인 loading.tsx(loading.js) 파일입니다.

loading.tsx 파일은 React Suspense 를 이용해서 라우팅 이동간에 로딩 중이란 표시를 하기 위한 파일입니다.

기존에 만들었던 blog 라우팅에 보면 page.tsx 파일이 있었죠.

이 파일과 같은 위치에 아래와 같이 loading.tsx 파일을 만들겠습니다.

```js
export default function Loading() {
  return <h1>Loading...</h1>;
}
```

함수 이름은 Loading 이란 이름이여야 합니다.

이제 테스트를 위해 blog 라우팅으로 이동해 볼까요?

테스트를 좀 더 쉽게하기 위해 app 폴더 바로 밑에 있는 layout.tsx 파일에서 헤더 부분에 blog란 라우팅의 링크를 추가하겠습니다.

```js
<nav>
    <ul className="flex space-x-2">
        <li>
        <Link href="/">Home</Link>
        </li>
        <li>
        <Link href="/about">About</Link>
        </li>
        <li>
        <Link href="/blog">Blog</Link>
        </li>
        <li>
        <Link href="/profile">Profile</Link>
        </li>
        <li>
        <Link href="/products">Products</Link>
        </li>
    </ul>
</nav>
```

이제 상단 Nav 바에서 라우팅을 왔다 갔다 해보십시요.

너무 빨라 'Loading...' 문구가 안 보일텐데요.

그리고 한번 캐쉬되면 React Suspense가 캐시하기 때문에 더 안 보일겁니다.

그래서 테스트를 위해 loading.tsx 파일에 'use client' 디렉티브와 함께 useEffect 훅을 이용해서 alert 창을 띄워 보겠습니다.

loading.tsx 파일은 서버사이드도 되고 클라이언트 사이드도 다 됩니다.

```js
"use client";

import { useEffect } from "react";

export default function Loading() {
  useEffect(() => {
    window.alert("Blog Routing...");
  }, []);
  return <h1>Loading..............</h1>;
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEh-YJrZCt1CPoG-H_rkYcrD4nTjnQx55dggzVdykZHM73-DgJHCgikG5sjbUCWPKABrbJ7NCZITcR18cVUZw2SAU_SGCxoFyDXEi_bDjzfltSP1WSjkeiqdbdRDV2Z0EEz6MeyoYzeZawTkzSYEDHq6nCPbLWL1NWmytBJ5Vg0MnHv6m5fjJQFJvs_p4NQ)

이제 위 그림과 같이 'Loading....' 문구와 함께 alert 창도 보입니다.

React Suspense가 너무 잘 작동해서 캐시된 상태여서 몇번 라우팅을 왔다갔다하고 새로고침해야 할겁니다.

loading.tsx 파일은 page.tsx 파일만 있으면 어디든 위치할 수 있는데요.

app 폴더 바로 밑에 loading.tsx 파일을 하나 더 추가해 보겠습니다.

여기에도 테스트를 위해  alert 창을 띄워 보겠습니다.

```js
"use client";

import { useEffect } from "react";

export default function Loading() {
  useEffect(() => {
    window.alert("Root Routing...");
  }, []);
  return <h1>Root Loading..............</h1>;
}
```

이제 새로고침 몇번하고 라우팅을 왔다 갔다 해보면 about 라우팅 부분에서 아래 그림과 같이 alert 창이 뜰겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhMHXNJfCJhn1Qwx3_VdAvRjaXSqZOq8XNytwPL6CXOLip7clDrt4h_ZBHVY5mDvqcQAGj_fm1B4uypihZl7YNI-dv75IJkhf1nFCmoiNrgXFw5kiBvb2g7TrIvKpPwW9JyCxO62wLImEv0cL-h8Ku5ROMNl2R_6MHMDIM8dvw56h9AMGvTilYJI_ikqgg)

alert 창 내용이 'Root Loading...'이란 문구로 봐서 이 alert 창은 무조건 app 폴더 바로 밑에 있던 loading.tsx 파일에 있던 겁니다.

그리고 blog 라우팅으로 가면 blog 폴더 밑에 있던 loading.tsx 파일은 작동하지 않습니다.

최상단 loading.tsx 파일 하나로만 작동하는 겁니다.

그러면 최상단 loading.tsx 파일을 지우고 개별 폴더에 각각 loading.tsx 파일을 만들면 작동합니다.

about 폴더 밑에도 만들어 보시면 아래 그림과 같이 작동할 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgz5kA1bVkQYOQmjtSDJw4_GeOthpZMeAu7lBf_yxSIu4mOgcOS97uDEXcPSqF9c_cKX1VeyI2Q1KifXhE0DX0tXMKpEM6wAhpoX8aZUcfMNodrWDfF_tpHIjMKraeL6GHZdud9wiklmrH45OpzZSkzkLF7RQMdsZdJ14Lx04DA7KCbXPmzpv3Ek0iYHoY)

이제 loading.tsx 파일이 어떻게 작동하는지 봤는데요.

전체적으로 한개만 만들건지 개별 라우팅마다 만들건지는 여러분 마음데로 하시면 됩니다.

그럼.
