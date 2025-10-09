---
slug: 2023-10-29-astrojs-all-about-routing-and-dynamic-routing
title: astrojs 강좌 5편. astrojs 라우팅 완벽 분석(routing, dynamic routing)
date: 2023-10-29 04:40:26.995000+00:00
summary: astrojs에서 라우팅(다이내믹 라우팅)에 대해 살펴봅시다.
tags: ["astrojs", "routing", "dynamic routing"]
contributors: []
draft: false
---

안녕하세요?

astrojs 강좌가 벌써 5번째네요.

지난 시간 강좌 목록입니다.

전체 astrojs 강좌 목록입니다.

1. [astrojs 강좌 1편. astrojs에서 데이터 가져오기](https://mycodings.fly.dev/blog/2023-10-07-astrojs-tutorial-how-to-handle-data-in-astrojs)

2. [astrojs 강좌 2편. React 쓰지 않고 순수 자바스크립트로 Dark Mode 만드는 법](https://mycodings.fly.dev/blog/2023-10-14-astrojs-tutorial-clean-build-of-darkmode-theme)

3. [astrojs 강좌 3편. 웹 컴포넌트로 직접 아일랜드 아키텍처 구현해 보기](https://mycodings.fly.dev/blog/2023-10-14-understanding-astosjs-island-architecture-from-making-my-own-island-web-component)

4. [astrojs 강좌 4편. astrojs 아일랜드 아키텍처 완벽 분석](https://mycodings.fly.dev/blog/2023-10-21-astrojs-in-depth-review-component-island-architecture)

5. [astrojs 강좌 5편. astrojs 라우팅 완벽 분석(routing, dynamic routing)](https://mycodings.fly.dev/blog/2023-10-29-astrojs-all-about-routing-and-dynamic-routing)

6. [astrojs 강좌 6편. astrojs Content Collection과 다이내믹 라우팅 접목하기](https://mycodings.fly.dev/blog/2023-10-29-astrojs-howto-use-content-collection-and-dynamic-routing)

7. [astrojs 강좌 7편. astrojs Server Side Rendering(SSR) 완벽 분석](https://mycodings.fly.dev/blog/2023-10-30-astrojs-howto-use-ssr-in-astrojs-server-side-rendering)

8. [astrojs 강좌 8편. astrojs와 firebase로 유저 로그인 구현](https://mycodings.fly.dev/blog/2023-11-08-astrojs-how-to-ssr-with-firebase-user-session)

9. [astrojs 강좌 9편. astrojs와 supabase로 유저 로그인 구현](https://mycodings.fly.dev/blog/2023-11-09-astrojs-howto-supabase-authentication-with-ssr)

10. [astrojs 강좌 10편. astrojs에서 쿠키와 토큰을 이용해서 유저 로그인 구현](https://mycodings.fly.dev/blog/2024-01-02-astrojs-auth-user-login-by-cookie-with-jwt-token)

11. [astrojs 강좌 11편. astrojs와 lucia를 이용해서 유저 인증 구현](https://mycodings.fly.dev/blog/2024-01-16-astrojs-tutorial-auth-with-lucia)

---

** 목차 **

1. [AstroJS pages 폴더](#1-astrojs-폴더-및-파일-라우팅)

2. [pages 폴더 밑에 있는 파일 라우팅 제외하기](#2-pages-폴더-밑에-있는-파일-라우팅-제외하기)

3. [다이내믹 라우팅](#3-다이내믹-라우팅)

4. [Rest Parameters를 이용한 다이내믹 라우팅](#4-rest-parameters를-이용한-다이내믹-라우팅)

5. [props도 같이 리턴하기](#5-props도-같이-리턴하기)

---

## 1. AstroJS 폴더 및 파일 라우팅

AstroJS에서 라우팅은 Next.js에서와 같이 src/pages 폴더에 있는 파일은 무조건 라우팅이 되는 방식인데요.

src/pages 폴더의 index.astro 파일이 가장 기본이 되는 라우팅입니다.

개발서버일 경우 `http://localhost:3000/` 주소가 되는 거죠.

그러면 `/about` 이라는 라우팅을 만들려면 다음과 같이 하면 됩니다.

src/pages/about/index.astro 방식과

src/pages/about.astro 방식이 있습니다.

이렇듯 폴더 방식, 파일 방식 모두 제공하기 때문에 편한 방식을 쓰는게 좋습니다.

그리고, astro.config.mjs 파일에서 다음과 같이 MDX를 추가했으면,

```js
import { defineConfig } from 'astro/config';

import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx(), tailwind()]
});
````

mdx(md) 확장자도 astro 확장자와 더불어 라우팅이 됩니다.

리액트 컴포넌트는 라우팅이 되지 않으니 각별히 주의 바랍니다.

---

## 2. pages 폴더 밑에 있는 파일 라우팅 제외하기

pages 폴더 밑에 부득이하게 컴포넌트를 만들었는데 이 파일은 라우팅에서 제외하려면 파일 이름 첫 글자로 '_'를 추가해 주면 됩니다.

아래와 같이 notroute.astro 파일을 만듭시다.

```js
---
import Main from "../layouts/Main.astro";
---

<Main title="Not route">
  <h1>This is not a route file</h1>
</Main>
```

이제 브라우저에서 보시면 아래와 같이 잘 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLJA2TJ-mPL6XQ4WxELS4srjTRRuMcK8Fl2muHXSdPrAeVQVAx65OrlNF2DmePC7fhJI-XOcDagiy8yRj3uiIcn1pNJP_VsnS5Qm_E1p0t3goNgMqjydIQXiSQSnICFqaOFijaRsCRgkovs1fwkbWOgBtOxG66lrjmPRuqBzH4Q5mP6qweRQnBQGgm4Po)

이제 파일이름 첫 글자로 '_'를 추가해 볼까요?

src/pages/_notroute.astro

다시 브라우저에서 보시면 아래와 같이 라우팅에서 제외된 게 보이실 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkgWzekAchadWuojxSlJUZa8VJtnYs3UMINiZSNfR77aFPNuRHdt93BqLilVD0u_QOkf824kk65d1OER10w8XN7QpAstD3NUQ_u2hRs7OBzCds7qV8llUO3BlSvGTncPLOnum1NrQiGVNMw4z8JFCr3VKPDP7vevre4Hmutv0cStXiBPwKISdiy2AkG7E)

---

## 3. 다이내믹 라우팅

우리가 Next.js나 Remix.run에서 보듯이 다이내믹 라우팅은 현대 자바스크립트 프레임워크에서 필수인데요.

AstroJS도 다이내믹 라우팅을 제공해 줍니다.

방식은 Next.js와 같은 방식이고요.

테스트를 위해 src/pages 폴더에서 dynamic 폴더를 만듭시다.

그리고 다이내믹 라우팅을 위해 아래 이름과 같이 만들어 볼까요?

`src/pages/dynamic/[year]/[title].astro`

다이내믹 라우팅을 두 개 사용하고 있는데요.

바로 year, title 파라미터입니다.

이제, 이 코드를 Astro 컴포넌트에서 접근해 볼까요?

```js
---
import Main from "../../../layouts/Main.astro";

const { year, title } = Astro.params;
---

<Main title={title}>
  <h1>{year}</h1>
  <h1>{title}</h1>
</Main>
```

위와 같이 만들고 주소창에 `http://localhost:4321/dynamic/2023/title-1` 주소로 접근하면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi5M0xfvLAsVF11ZJyUEJZ4QCkrU-wIlNCSfCDvl5kuRjCnVrcqCJRMxsyUlIS36ONvUuHFB1j-n5fhc_qGMQVuxxOhQi7i4kP3asp5RCbbSXIlYFv5JwfoTQDawVeuEwa6GAR4jeGXPC-uV7aEOg6iZJbl1Wr7R7tq89buZKOEW_P8M9MWZCZfPoJimS8)

getStaticPaths 함수를 이용해서 다이내믹 라우팅을 구성하라는 에러메시지인데요.

왜 getStaticPaths 함수를 이용해야 하냐면 Next.js의 getStaticProps, getStaticPaths와 같은 이유인데요.

AstroJS는 정적 사이트 제조기로 유명합니다.

빌드 시에 단순히 HTML 파일을 만드는데요.

그래서 다이내믹 라우팅에서는 다이내믹 라우팅이 될만한 경우의 수를 제공해 줘야 합니다.

여기서 경우의 수는 바로 params 가 되는데요.

우리가 아래와 같이 다이내믹 라우팅으로 year와 title 두 개를 사용했는데요.

`src/pages/dynamic/[year]/[title].astro`

그러면 params에 year와 title에 대한 모든 경우의 수를 제공해 줘야 합니다.

이제, 다시 코드를 만들어 볼까요?

```js
---
import type { GetStaticPaths } from "astro";
import Main from "../../../layouts/Main.astro";

export const getStaticPaths = (() => {
  return [
    {
      params: {
        year: "2023",
        title: "title-1",
      },
    },
    {
      params: {
        year: "2024",
        title: "title-2",
      },
    },
  ];
}) satisfies GetStaticPaths;

const { year, title } = Astro.params;
---

<Main title={title}>
  <h1>{year}</h1>
  <h1>{title}</h1>
</Main>
```

코드는 별거 없이 AstroJS에서 이름이 예약된 함수인 getStaticPaths 함수를 export 하면 됩니다.

getStaticPaths 함수는 async 방식으로도 작동할 수 있습니다.

params를 어떻게 주냐면요.

getStaticPaths 함수는 무조건 배열을 리턴해야 되는데요.

이 배열은 params 항목이 있는 객체가 들어 있어야 합니다.

그래야 Astro.params로 params에 접근할 수 있기 때문입니다.

그리고 params 객체에는 다시 우리가 다이내믹 라우팅으로 사용한 year, title에 대한 구체적인 값을 지정해 줘야 합니다.

위 코드에서 보시면 경우의 수가 2가지인데요.

이제 브라우저에서 경우의 수에 맞게 접속해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjo7ClZv8ezeNwlSnG__lI2gvQFM8hLocQ03EooQFgpWq25pFuOESDmiE5Q7TbSuwsR69usrrMEDddEB1kWgUlu3fQVuvi0lOwerbAzRfu5gf6Yfv6avJtVF5Aio7rYtB-2sydPme4U9r0vHj2mmgEWaYoYzzKC7_WZRhxhgQfjvFnn_M3CHrgJlm8ku3M)

![](https://blogger.googleusercontent.com/img/a/AVvXsEg2UjvC8qemBEvNAXHJ3_r8oF2vNVCX-jk2Uas0mMQO3_SVzKfiRl3WXdCqW_X-If7KscHy2_r8mVMUWX_2a9zxp0VVHml_Ky5r4vnq8UlkJ7g6mrXE_KqWdmxDPOfga7cboI_vW2niPeCl9d7UrVjHMcWB7gsgDBxnLO98gn6tNL8wDia9upEG8aYc4ig)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjHIPHkqC9nMYkQdOROTr1fsIkuDs8jm0b19e1a7F4g_g_27-LKJlkqi8YVD5DNZlqE96r8ilJw0Ywj07qW7tbLoWoO2lizYYypLaTZRXMGe0UumurI4W9ZKMrFcoPtHR05qOqyrmfrOciWLOjLx6RUX4K-nQydLsNJnga8g3dYvkciB-Iexjs3sVs-3B8)

위 3개의 그림을 보시면 우리가 params으로 지정했던 경우의 수에 맞으면 라우팅이 작동되고 그렇지 않으면 없는 페이지라고 나옵니다.

실제 페이지를 빌드했을 경우 어떻게 나오는지 한번 볼까요?

```bash
➜  dist git:(main) ✗ tree ./dynamic -L 3
./dynamic
├── 2023
│   └── title-1
│       └── index.html
└── 2024
    └── title-2
        └── index.html

5 directories, 2 files
➜  dist git:(main) ✗ 
```

Bash 창에서 tree 명령어를 이용해서 dist 폴더의 dynamic 폴더를 조사해 보면 위와 같이 우리가 경우의 수로 제공한 params으로 이루어진 폴더 및 파일만 빌드되었습니다.

---

## 4. Rest Parameters를 이용한 다이내믹 라우팅

아까 우리가 했던 다이내믹 라우팅은 year, title 두 개의 params을 이용했는데요.

이 경우 year와 title을 브라켓이 넣은 폴더 또는 파일을 넣었는데요.

'...' 같은 Rest Parameters를 사용하면 AstroJS에서 파일 이름을 좀 더 간단하게 사용할 수 있습니다.

src/pages/dynamic2 폴더에 `[...path].astro`라는 파일을 만듭시다.

브라켓 안에서 '...'로 시작하고 이름은 'path'가 됩니다.

그러면 params에 'path' 항목을 넣어 getStaticPaths 함수를 리턴해 주면 됩니다.

```js
---
import type { GetStaticPaths } from "astro";
import Main from "../../layouts/Main.astro";
export const getStaticPaths = (() => {
  return [
    {
      params: {
        path: "2023/10/29/test-1",
      },
    },
    {
      params: {
        path: "2024/1/1/test-2",
      },
    },
  ];
}) satisfies GetStaticPaths;

const { path } = Astro.params;
---

<Main title="dynamic2">
  <h1>{path}</h1>
</Main>
```

Rest Parameters를 이용하면 아주 복잡한 URL을 구현할 수 있죠.

이제 실행해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgpXxDHB1chrvXyyUVlGoKDbKKioUlamRFzMOGOeVw38EDjXWBopLlqXicJx3N8J_oaPrmZ3ZQ9MJ0VxprCh9ie5fOAcJhlEjLPH9Gf3IZPBKXqprx6zZDWF93vy3zCs0JUyAUc30sZgRmn5FX6PPx4N1XygPUOAWl8C3__0OL4O2wJfFnu19yoHBDwtA8)

위와 같이 정상 작동합니다.


다이내믹 라우팅에 대해 정리하자면,

우리가 리턴 할 객체에는 params 항목을 넣어야 하는데요.

params 항목도 객체입니다.

그리고 params 항목의 객체에 들어갈 항목은 바로 우리가 브라켓 안에 넣었던 이름의 항목이어야 하는 거죠.

예를 들어, 브라켓에 `[...path]`라고 path라는 이름으로 정했는데, params에 아래와 같이 'url'이라고 하면 에러가 납니다.

```js
export const getStaticPaths = (() => {
  return [
    {
      params: {
        url: "2023/10/29/test-1",
      },
    }
  ];
});
```

---

## 5. props도 같이 리턴하기

getStaticPaths 함수는 배열을 리턴하고 배열 안에는 객체가 들어가야 하는데, 그 객체에는 params 항목이 들어가야 한다고 했는데요.

params 항목 외에 props 항목도 같이 리턴할 수 있습니다.

그러면 Astro.props를 이용해서 접근할 수 있는데요.

```js
---
import type { GetStaticPaths } from "astro";
import Main from "../../layouts/Main.astro";
export const getStaticPaths = (() => {
  return [
    {
      params: {
        path: "2023/10/29/test-1",
      },
      props: {
        test: "test-1",
      },
    },
    {
      params: {
        path: "2024/1/1/test-2",
      },
      props: {
        test: "test-2",
      },
    },
  ];
}) satisfies GetStaticPaths;

const { path } = Astro.params;
const { test } = Astro.props;
---

<Main title="dynamic2">
  <h1>{path}</h1>
  <h2>{test}</h2>
</Main>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEjuF5v-hUAW6c7ORY9rBcNGnZIwB2z4r3MZk2Q30zeW57Ce-_T6NGXboX0PvT6rVjZzDOFdJaUzRePb4ss9SALDclYGDLYaFQQs4cqx4Hlh9RxqtQ9IC6-PYVp4tOS6YeHibNmHhIvvKNbDEsQ4eISFPswdpBLwpZ92ogQ7UDgFkPDghQdzn3rsh2dlR3g)

위 그림과 같이 test 변수의 값이 잘 나오고 있습니다.

여기서 배운 props를 같이 전달하는 방식은 다음 시간에 배울 Content Collection편에서 사용할 예정이라 미리 배워 두는 겁니다.

그럼.
