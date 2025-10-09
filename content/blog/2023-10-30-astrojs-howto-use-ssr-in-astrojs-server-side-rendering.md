---
slug: 2023-10-30-astrojs-howto-use-ssr-in-astrojs-server-side-rendering
title: astrojs 강좌 7편. astrojs Server Side Rendering(SSR) 완벽 분석
date: 2023-10-30 11:55:49.277000+00:00
summary: astrojs에서 SSR(Server Side Rendering) 사용하기
tags: ["astrojs", "ssr", "server side rendering"]
contributors: []
draft: false
---

안녕하세요?

astrojs 강좌가 벌써 7번째네요.

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

1. [Server Side Rendering](#1-server-side-rendering)

2. [SSR 방식에서 정적 페이지도 같이 사용하기](#2-ssr-방식에서-정적-페이지도-같이-사용하기)

3. [Request, Response](#3-request-response)

4. [cookies 사용하기](#4-cookies-사용하기)

5. [request IP 어드레스](#5-request-ip-어드레스)

6. [환경변수 사용하기](#6-환경변수-사용하기)

7. [PUBLIC 환경변수](#7-public-환경변수)

8. [Server Endpoints](#8-server-endpoints)

8. [다이내믹 서버 엔드 포인트](#9-다이내믹-서버-엔드-포인트)

---

## 1. Server Side Rendering

최근 자바스크립트 프레임워크의 추세인 서버 사이드 렌더링도 AstroJS에서도 가능한데요.

실제 예를 들어 알아보겠습니다.

먼저, astrojs 템플릿을 설치해서 진행해 보겠습니다.

```bash
npm create astro@latest --  --template=minimal --yes --skip-houston astro-ssr
```

위와 같이 하면 한 번에 바로 AstroJS 템플릿이 설치됩니다.

이제 SSR과 SSG의 차이점을 보기 위해 한번 build 해 보겠습니다.

```bash
➜  astro-ssr git:(main) ✗ npm run build

> astro-ssr@0.0.1 build
> astro check && astro build

Result (3 files):
- 0 errors
- 0 warnings
- 0 hints

오후 06:57:23 [content] No content directory found. Skipping type generation.
오후 06:57:23 [build] output target: static
오후 06:57:23 [build] Collecting build info...
오후 06:57:23 [build] Completed in 57ms.
오후 06:57:23 [build] Building static entrypoints...
오후 06:57:23 [build] Completed in 0.89s.

 generating static routes   ==> 여기를 보시면 static 방식으로 build 되었습니다.
▶ src/pages/index.astro
  └─ /index.html (+13ms)
Completed in 17ms.

오후 06:57:24 [build] 1 page(s) built in 0.98s
오후 06:57:24 [build] Complete!
➜  astro-ssr git:(main) ✗
```

'npm run build' 명령을 실행시켰을 때 AstroJS의 기본 방식인 Static Site Generation이 작동되어 index.html 파일이 생성되었습니다.

그러면, AstroJS에서 SSR은 어떻게 설정해야 할까요?

역시나 astro.config.mjs 파일을 수정하면 됩니다.

```js
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'server',
});
```

위와 같이 defineConfig 함수를 이용해서 'output' 부분에서 'server' 라고 쓰면 되는데요.

output에 들어갈 수 있는 문자열은 "server", "hybrid", "static" 세 가지가 있는데요.

hybrid는 server와 static의 중간 역할이라고 생각하시면 됩니다.

이제 다시 'npm run build' 해 볼까요?

```bash
➜  astro-ssr git:(main) ✗ npm run build

error   Cannot use `output: 'server'` or `output: 'hybrid'` without an adapter. Please install and configure the appropriate server adapter for your final deployment.
```

위와 같이 에러가 나오는데요.

adapter가 없다고 나옵니다.

서버 사이드 렌더링에는 서버 구동을 위한 런타임이 필요한데요.

AstroJS에서는 adapter이라고 합니다.

AstroJS가 SSR을 제공하는 런타임은 아래 링크와 같이 여러 가지가 있습니다.

[AstroJS Deployment Guides](https://docs.astro.build/en/guides/deploy/)

그중에 대표적인 게, cloudfare, deno, netlify, node, vercel 등이 있습니다.

우리는 node를 adapter로 설치해 보겠습니다.

```bash
➜  astro-ssr git:(main) ✗ npx astro add node
✔ Resolving packages...

  Astro will run the following command:
  If you skip this step, you can always run it yourself later

 ╭────────────────────────────╮
 │ npm install @astrojs/node  │
 ╰────────────────────────────╯

✔ Continue? … yes
✔ Installing dependencies...

  Astro will make the following changes to your config file:

 ╭ astro.config.mjs ─────────────────────────────╮
 │ import { defineConfig } from 'astro/config';  │
 │                                               │
 │ import node from "@astrojs/node";             │
 │                                               │
 │ // https://astro.build/config                 │
 │ export default defineConfig({                 │
 │   output: 'server',                           │
 │   adapter: node({                             │
 │     mode: "standalone"                        │
 │   })                                          │
 │ });                                           │
 ╰───────────────────────────────────────────────╯

  For complete deployment options, visit
  https://docs.astro.build/en/guides/deploy/

✔ Continue? … yes

   success  Added the following integration to your project:
  - @astrojs/node
➜  astro-ssr git:(main) ✗
```

위와 같이 하시면 설정파일도 알아서 고쳐줍니다.

이제 다시 'npm run build'를 해볼까요?

```bash
➜  astro-ssr git:(main) ✗ npm run build

> astro-ssr@0.0.1 build
> astro check && astro build

오후 07:03:56 [content] No content directory found. Skipping type generation.
오후 07:03:56 [check] Getting diagnostics for Astro files in /Users/cpro95/Codings/Javascript/astro-test/astro-ssr...
Result (3 files):
- 0 errors
- 0 warnings
- 0 hints

오후 07:04:00 [content] No content directory found. Skipping type generation.
오후 07:04:00 [build] output target: server   ===> 여기를 보시면 server side rendering입니다.
오후 07:04:00 [build] deploy adapter: @astrojs/node
오후 07:04:00 [build] Collecting build info...
오후 07:04:00 [build] Completed in 72ms.
오후 07:04:00 [build] Building server entrypoints...
오후 07:04:01 [build] Completed in 1.24s.

 finalizing server assets

오후 07:04:01 [build] Rearranging server assets...
오후 07:04:01 [build] Server built in 1.35s
오후 07:04:01 [build] Complete!
➜  astro-ssr git:(main) ✗
```
AstroJS를 build 하면 디폴트 폴더로 dist 폴더가 생성되는데요.

한번 볼까요?

```bash
➜  dist git:(main) ✗ tree -L 2
.
├── client
│   └── favicon.svg
└── server
    ├── _empty-middleware.mjs
    ├── chunks
    ├── entry.mjs
    ├── manifest_350e45ba.mjs
    └── renderers.mjs

4 directories, 5 files
➜  dist git:(main) ✗
```

위와 같이 client 폴더에는 HTML 파일이 아예 없습니다.

그리고 server 폴더에 여러 가지 mjs 파일이 있는데요.

그러면 Node 서버를 어떻게 실행할까요?

바로 entry.mjs 파일을 node로 실행하면 됩니다.

```bash
➜  astro-ssr git:(main) ✗ node ./dist/server/entry.mjs
오후 09:11:52 [@astrojs/node] Server listening on http://127.0.0.1:4321
```

위와 같이 실행하면 서버가 열립니다.

이런 식으로 작동하는 거니까요, 나만의 서버 같은 데서 작동시키면 됩니다.

자체적으로 만든 서버 거나, 오라클 서버 같은 데서 NodeJS 로 웹서버를 돌린다고 생각하시면 됩니다.

---

## 2. SSR 방식에서 정적 페이지도 같이 사용하기

astro.config.mjs 파일에 output을 "server"로 명기하면 AstroJS는 전체적으로 모두 서버 사이드 렌더링이 작동됩니다.

그런데, 홈페이지를 만들다 보면 모두 다 서버 사이드로 만드는 건 비효율적인데요.

그래서 일부 페이지만 정적 사이트로 만들어야 하는 경우가 있는데요.

이 방식도 AstroJS는 제공해 주는데요.

Astro 컴포넌트에서 아래 문구만 넣으면 됩니다.

```js
---
// 👀 note the prerender export
export const prerender = true;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>Astro</h1>
  </body>
</html>
```

prerender 변수를 true로 지정하면 해당 페이지는 prerender 되는 겁니다.

즉, 정적사이트로 변환되는 거죠.

이렇게 하고 다시 'npm run build' 해볼까요?

```bash
Result (13 files):
- 0 errors
- 0 warnings
- 5 hints

오후 07:12:45 [content] No content directory found. Skipping type generation.
오후 07:12:45 [build] output target: server
오후 07:12:45 [build] deploy adapter: @astrojs/node
오후 07:12:45 [build] Collecting build info...
오후 07:12:45 [build] Completed in 64ms.
오후 07:12:45 [build] Building server entrypoints...
오후 07:12:46 [build] Completed in 1.07s.

 prerendering static routes  ==> 여기를 보시면 index.html 정적 사이트가 만들어졌습니다.
▶ src/pages/index.astro
  └─ /index.html (+11ms)
Completed in 25ms.


 finalizing server assets   ==> 전체적으로 서버 사이드로 작동되고 있고요.

오후 07:12:46 [build] Rearranging server assets...
오후 07:12:46 [build] Server built in 1.19s
오후 07:12:46 [build] Complete!
➜  astro-ssr git:(main) ✗
```

---

## 3. Request, Response

서버 사이드 렌더링이면 서버 사이드 코드인데요.

서버 사이드 코드에서 가장 중요한 게 바로 Request, Response입니다.

AstroJS에서 Request 객체는 다음과 같이 접근할 수 있는데요.

```js
---
 const request = Astro.request
---
```

실제 console.log 해보면 아래와 같이 나옵니다.

```bash
Request {
  [Symbol(realm)]: {
    settingsObject: { baseUrl: undefined, origin: [Getter], policyContainer: [Object] }
  },
  [Symbol(state)]: {
    method: 'GET',
    localURLsOnly: false,
    unsafeRequest: false,
    body: null,
    client: { baseUrl: undefined, origin: [Getter], policyContainer: [Object] },
    reservedClient: null,
    replacesClientId: '',
    window: 'client',
    keepalive: false,
    serviceWorkers: 'all',
    initiator: '',
    destination: '',
    priority: null,
    origin: 'client',
    policyContainer: 'client',
    referrer: 'client',
    referrerPolicy: '',
    mode: 'cors',
    useCORSPreflightFlag: false,
    credentials: 'same-origin',
    useCredentials: false,
    cache: 'default',
    redirect: 'follow',
    integrity: '',
    cryptoGraphicsNonceMetadata: '',
    parserMetadata: '',
    reloadNavigation: false,
    historyNavigation: false,
    userActivation: false,
    taintedOrigin: false,
    redirectCount: 0,
    responseTainting: 'basic',
    preventNoCacheCacheControlHeaderModification: false,
    done: false,
    timingAllowFailed: false,
    headersList: HeadersList {
      cookies: null,
      [Symbol(headers map)]: [Map],
      [Symbol(headers map sorted)]: null
    },
    urlList: [ [URL] ],
    url: URL {
      href: 'http://localhost:4321/',
      origin: 'http://localhost:4321',
      protocol: 'http:',
      username: '',
      password: '',
      host: 'localhost:4321',
      hostname: 'localhost',
      port: '4321',
      pathname: '/',
      search: '',
      searchParams: URLSearchParams {},
      hash: ''
    }
  },
  [Symbol(signal)]: AbortSignal { aborted: false },
  [Symbol(headers)]: HeadersList {
    cookies: null,
    [Symbol(headers map)]: Map(16) {
      'accept' => [Object],
      'accept-encoding' => [Object],
      'accept-language' => [Object],
      'connection' => [Object],
      'cookie' => [Object],
      'dnt' => [Object],
      'host' => [Object],
      'sec-ch-ua' => [Object],
      'sec-ch-ua-mobile' => [Object],
      'sec-ch-ua-platform' => [Object],
      'sec-fetch-dest' => [Object],
      'sec-fetch-mode' => [Object],
      'sec-fetch-site' => [Object],
      'sec-fetch-user' => [Object],
      'upgrade-insecure-requests' => [Object],
      'user-agent' => [Object]
    },
    [Symbol(headers map sorted)]: null
  },
  [Symbol(astro.clientAddress)]: '::1',
  [Symbol(astro.locals)]: {}
}
```

Astro.request의 Typescript interface를 보시면 아래와 같습니다.

```js
interface Request extends Body {
    readonly cache: RequestCache
    readonly credentials: RequestCredentials;
    readonly destination: RequestDestination;
    readonly headers: Headers;
    readonly integrity: string;
    readonly keepalive: boolean;
    readonly method: string;
    readonly mode: RequestMode;
    readonly redirect: RequestRedirect;
    readonly referrer: string;
    readonly referrerPolicy: ReferrerPolicy;
    readonly signal: AbortSignal;
    readonly url: string;
    clone(): Request;
}
```

AstroJS에서는 웹페이지의 headers나 url을 Astro.request.headers나 Astro.request.url 로 쉽게 접근할 수 있습니다.

이에 반해 Response는 Astro.response를 사용하는 게 아니라, 웹 표준을 이용해서 Response를 만들어야 합니다.

```js
new Response(body, options);
```

예를 들어 볼까요?

```js
---
const getIsLoggedOut = () => true;
const isLoggedOut = getIsLoggedOut();

if (isLoggedOut) {
  return Response.redirect(`${Astro.request.url}about`, 307);
}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>Astro</h1>
  </body>
</html>
```
위와 같이 하면 Response 객체에 의해 바로 redirect 되는데요.

여기서, 좀 더 편한 redirect 방법이 있습니다.

redirect를 위해서는 Astro.redirect를 사용하는 게 훨씬 편합니다.

```js
return Astro.redirect("/about", 307);
```

Response로 redirect 하려면 절대 경로를 써야 하는데요.

Astro.redirect를 이용하시면 상대 경로로 써도 됩니다.

그리고, 꼭 기억해야 될 중요한 차이점이 있는데요.

Astro.response를 위와 같이 사용하시면 에러가 납니다.

```js
if (isLoggedOut) {
  return new Astro.response("app not available - check back", {
      status: 200,
      statusText: "Excellent!",
    });
}
```

위와 같이 하면 아래 그림과 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEicu8LKUfyWxALw1YYRrcKDqA9qR80lDkH9AriaQoDmS7EHydxG7zLCkFcbA9aMbUB1Tq8uSHlW4LhHKaZcIRXEfMG10Gpdpj9ACUSWczmOMqrljb6Ti3WtHV6XUuSz8WqvWeUVV8NCWLhx0944hmUhs2Wg5ZnhzZ3v5p-wdfX3wo0xB87fCwSuwglSnXk)

그러면 Astro.resopnse 는 뭔 역할이 있을까요?

Astro.resopnse는 Response의 options 부분에 들어가는 status, statusText, headers 같은 옵션을 저장해서 쓰는 일종의 initialiser 역할을 합니다.

```js
---
Astro.response.headers.set("name", "mycodings");
---
```
위와 같이 사용하시면 아래 그림과 같이 헤더 부분에 원하는 데이터를 넣어서 페이지에 전송할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgCI5om7UGYb2O1E48eVX3_sW7sqClcrWAreZW6m_3Q23iFTd9jzqYSpfN0jHGF-mGR5FOC3DU2Y532HBWFkAN7VGW8e2owiOQ8CsajKItlbGBJMuvq4NnIPIEbdDK3FLddXPEgL-E3lbqGLt2aruKtPvmCdIsPfV350zYj-mXEStqoF45wcXa7NpLb-rQ)

---

## 4. cookies 사용하기

AstroJS는 서버사이드 코드를 위해 자체적으로 cookies 객체를 지원합니다.

```js
Astro.response.headers.set("name", "mycodings");

// Set a cookie
Astro.cookies.set("cooookiees", "the-cookie-value");

// check if the "cooooookies" cookie exists. returns a boolean
const hasCookie = Astro.cookies.has("cooookiees");
console.log(hasCookie);

//Get an AstroCookie object
const cookieObject = Astro.cookies.get("cooookiees");
console.log(cookieObject);
```

아래 그림과 같이 쿠키 작동도 잘 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjeXaaq-GXl5Un_BYsQg9lu-en-jYk0S4WOMQZeIPDd1uonR6QG80KpcR2WYBieJuPTvpwSpdK8QnWvvKf1GzdLswlTqAlJB45jkRKPzn6s-S4ozG3R5KGi8N3WRGnfm4qOajH4WOvIomS_mS4C1UCIfbxrhzYAHiKKMNUHG4roPVyVBPtn29z9eMwgiOM)

```bash
true
AstroCookie { value: 'the-cookie-value' }
```

cookie 관련 유틸리티 메서드는 아래와 같습니다.

```js
const cookieValue = cookieObject?.value;
console.log(cookieValue)

// JSON으로 Parsing 할 때
const cookieJSON = cookieObject?.json();

// 넘버로 파싱
const cookieNumber = cookieObject?.number();

// boolean로 파싱
const cookieBoolean = cookieObject?.boolean();
```

---

## 5. request IP 어드레스

AstroJS는 서버 사이드 코드를 지원해 줘서 클라이언트의 IP 주소를 알려주는데요.

아래와 같이 Astro.clientAddress 객체를 사용하시면 됩니다.

```js
---
const ip = Astro.clientAddress;
---

<div>Your IP address is: {ip}</div>
```

---

## 6. 환경변수 사용하기

AstroJS의 템플릿은 Vite를 이용해서 만들어졌기 때문에 환경변수는 import.meta.env 방식으로 사용해야 합니다.

```js
---
import.meta.env.MY_API_TOKEN
---
```

일반적은 Create React App에서는 process.env 객체를 사용해서 사용자 환경변수를 사용했었는데요.

Vite 방식은 import.meta.env 방식이니까 헷갈리지 마십시오.

그리고, Vite에는 Default 환경 변수가 있는데요.

```js
// Get the mode the Astro site is running in: "development" | "production"
import.meta.env.MODE;

// Is the site running in production? returns true or false
import.meta.env.PROD;

// Is the site running in development? returns true or false
import.meta.env.DEV;

// The base URL of the Astro site
import.meta.env.BASE_URL;

// Get the final deployed URL of the Astro site
import.meta.env.SITE;

// Get prefix for Astro-generated asset links
import.meta.env.ASSETS_PREFIX;
```

import.meta.env.BASE_URL 환경변수는 defineConfig에 base 항목으로 지정된 경우가 아니면 '/'로 지정됩니다.

import.meta.env.SITE 환경변수는 defineConfig에서 site 항목으로 지정하면 됩니다.

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mycodings.fly.dev",
});
```

import.meta.env.ASSETS_PREFIX 환경변수는 아래와 같이 지정하면 됩니다.

```js
import defineConfig from "astro/config";

export default defineConfig({
  build: {
    assetsPrefix: "https://cdn.example.com",
  },
});
```

---

## 7. PUBLIC 환경변수

기본적으로 환경변수는 클라이언트에는 절대 공개되지 않는데요.

일부러 클라이언트에 공개돼도 되는 환경변수를 만들 경우가 있는데요.

환경변수 이름 앞에 'PUBLIC_'를 붙이면 됩니다.

```js
PUBLIC_INSENSITIVE_TOKEN = "this-is-public";
```

---

## 8. Server Endpoints

서버 엔드 포인트는 일종의 서버 사이드 REST API 같은 건데요.

pages 폴더 밑에 .ts, .js 확장자로 파일을 만들면 이 파일은 웹페이지로 변환되는 게 아니라 일종의 API 코드가 되는 겁니다.

.json.ts 확장자도 가능합니다.

서버 엔드 포인트는 APIRoute를 export 해야 하는데요.

GET, POST, DELETE, PUT, UPDATE 같이 REST API에서 사용하는 HTML 메서드 이름을 export 하면 됩니다.

예를 들어볼까요?

src/pages/api.ts 파일을 만들어서 아래와 같이 작성합시다.

```js
import type { APIRoute } from "astro";

export const GET: APIRoute = (ctx) => {
  return {
    body: JSON.stringify({
      message: "Hello world",
    }),
  };
};
```

이제 브라우저에서 위 주소로 가면 아래 그림과 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjAdxntWJdqhmxaOKvaFW-MNsJBQwTgspPW-QTAINw2xrHkg4MzICIr0J0FkJQOXsQviTaV6bw92pLufXAtQ9FjMB7dLIud4hfX10HjOLd-MdJxQZZPzNS9IHacAY4fH3GzJIEX8Gs9QjtYGCZvwos_4Py9r1irXeQcVw9srswXsmiFVJQ8MZ9mDkPT9_o)

그리고 확장자를 .json.ts로 작성하면 아래와 같이 됩니다.

src/pages/data.json.ts

```js
import type { APIRoute } from "astro";

const nameData = [
  {
    id: 1,
    name: "Kim",
  },
  {
    id: 2,
    name: "Park",
  },
];

export const GET: APIRoute = (ctx) => {
  return {
    body: JSON.stringify(nameData),
  };
};
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgWts7affqjo2qoCJqnRRKebNVWDiaqpG9ctM8V2oL8n5oo6vUs-Ws5wO8F5EWGEAs3MJ6cA_3Ky-aZCJYyq4hDQ6CPhEpE7dsEIHYN3n296DG0BGKMBajJ6y6k2E2sVNR50SH1mQMOlkzBzyIP2Wqjd_yoEZGSVaEoPrN-i-cttOVM00_D5bncm2worh4)

위와 같이 나옵니다.

이제, 서버 엔드 포인트를 이용해서 REST API 코드도 작성할 수 있게 되었네요.

---

## 9. 다이내믹 서버 엔드 포인트

API를 만들 때도 다이내믹 방식으로 작동할 수 있습니다.

'src/pages/api/product/[id].ts' 파일을 만든다고 칩시다.

product의 id를 다이내믹하게 얻어서 코드를 작성해야 하는데요.

아래와 같이 ctx.params.id로 쉽게 접근할 수 있습니다.

그리고 `GET api/products/astro-book-001?version=2&publishedDate=2023-06-12` 같이 URL에 파리미터가 있다면 해당 파라미터를 어떻게 뽑아낼까요?

바로 웹 표준 API를 사용하면 됩니다.

```js
export const GET: APIRoute = async (ctx) => {
  const productId = ctx.params.id;

  // retrieve relevant search parameters, aka URL query parameters
  const searchParams = ctx.url.searchParams;
  const version = searchParams.get("version");
  const publishedDate = searchParams.get("publishedDate");

  try {
    const response = await fetch("https://fakestoreapi.com/products/1");
    const data = await response.json();

    // Return a new response with the retrieved
    // "version" and "publishedDate"
    return new Response(
      JSON.stringify({
        ...data,
        version,
        publishedDate,
        id: productId,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "An error occurred",
      }),
      {
        status: 500,
      }
    );
  }
};
```

---

지금까지 astrojs 서버 사이드 렌더링에 대해 알아보았습니다.

그럼.
