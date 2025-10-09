---
slug: 2024-01-02-astrojs-auth-user-login-by-cookie-with-jwt-token
title: astrojs 강좌 10편. astrojs에서 쿠키와 토큰을 이용해서 유저 로그인 구현
date: 2024-01-02 11:53:41.907000+00:00
summary: 유저 정보를 jsonwebtoken으로 만들어서 쿠키에 저장해서 유저 로그인 구현
tags: ["astrojs", "auth", "cookie", "jwt", "token", "jsonwebtoken"]
contributors: []
draft: false
---

안녕하세요?

오랜만에 astrojs 강좌를 이어가네요.

오늘로 벌서 astrojs 강좌가 10번째네요.

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

** 목 차 **

- [1. Astro 템플릿 설치](#1-astro-템플릿-설치)
- [2. 쿠키 설정](#2-쿠키-설정)
- [3. middleware 설정](#3-middleware-설정)
- [4. Prisma 설정](#4-prisma-설정)
  - [4-1. Prisma 설치](#4-1-prisma-설치)
- [4-2. Model 설정](#4-2-model-설정)
  - [4-3. 테이블 만들기](#4-3-테이블-만들기)
  - [4-4. Prisma Studio에서 보기](#4-4-prisma-studio에서-보기)
- [5. UI 만들기](#5-ui-만들기)
  - [5-1. 레이아웃 파일 만들기](#5-1-레이아웃-파일-만들기)
- [5-2. 루트 페이지와 대시보드 페이지 만들기](#5-2-루트-페이지와-대시보드-페이지-만들기)
- [6. 인증 관련 코드 설정](#6-인증-관련-코드-설정)
  - [6-1. Prisma Client 설정](#6-1-prisma-client-설정)
  - [6-2. hash 관련 bcryptjs 설치](#6-2-hash-관련-bcryptjs-설치)
- [7. 가입하기 화면 만들기](#7-가입하기-화면-만들기)
- [8. formData의 유효성 검사](#8-formdata의-유효성-검사)
- [9. 유저 정보를 DB에 저장하기](#9-유저-정보를-db에-저장하기)
- [10. 동일 이메일 에러 처리하기](#10-동일-이메일-에러-처리하기)
- [11. 토큰 만들기](#11-토큰-만들기)
- [12. 쿠키 만들기](#12-쿠키-만들기)
- [13. 로그인 페이지 만들기](#13-로그인-페이지-만들기)
- [14. 미들웨어로 페이지별 액세스 제한하기](#14-미들웨어로-페이지별-액세스-제한하기)
- [15. 로그아웃 구현](#15-로그아웃-구현)
- [16. 로그인, 가입하기 페이지에 리다이렉트 코드 삽입](#16-로그인-가입하기-페이지에-리다이렉트-코드-삽입)
- [17. 빌드를 위한 어댑터 설치](#17-빌드를-위한-어댑터-설치)

---

## 1. Astro 템플릿 설치

일단 Astro를 설치하겠습니다.

옵션으로는 Typescript를 선택했습니다.

```bash
npm create astro@latest
Need to install the following packages:
  create-astro@4.6.0
Ok to proceed? (y)

 astro   Launch sequence initiated.

   dir   Where should we create your new project?
         ./astro-prisma-auth-with-token

  tmpl   How would you like to start your new project?
         Empty
 ██████  Template copying...

  deps   Install dependencies?
         Yes
 ██████  Installing dependencies with npm...

    ts   Do you plan to write TypeScript?
         Yes

   use   How strict should TypeScript be?
         Strict
 ██████  TypeScript customizing...

   git   Initialize a new git repository?
         Yes
 ██████  Git initializing...

  next   Liftoff confirmed. Explore your project!

         Enter your project directory using cd ./astro-prisma-auth-with-token
         Run npm run dev to start the dev server. CTRL+C to stop.
         Add frameworks like react or tailwind using astro add.

         Stuck? Join us at https://astro.build/chat

╭──🎁─╮  Houston:
│ ◠ ◡ ◠  Good luck out there, astronaut! 🚀
╰─────╯
```

폴더로 들어가 'npm run dev'를 실행해 보면 브라우저에 Astro 문구가 잘 나올 겁니다.

---

## 2. 쿠키 설정

쿠키 관련 Astro 문법은 예전 강좌 7편에 소개했던 적이 있습니다.

[astrojs 강좌 7편. astrojs Server Side Rendering(SSR) 완벽 분석](https://mycodings.fly.dev/blog/2023-10-30-astrojs-howto-use-ssr-in-astrojs-server-side-rendering)

예전 문서를 보시면 서버 사이드 렌더링에 대해 잘 알 수 있는데요.

복습 차원에서 쿠키 작동 방법을 간단히 테스트해 보겠습니다.

먼저, src 폴더의 index.astro 파일을 아래와 같이 고친 다음 테스트해 보겠습니다.

```js
---
let counter = 0;

if (Astro.cookies.has("counter")) {
  const cookie = Astro.cookies.get("counter");
  if (cookie) counter = cookie.number() + 1;
}

Astro.cookies.set("counter", String(counter));
---

<html>
  <h1>Counter = {counter}</h1>
</html>
```

개발 서버를 다시 돌려볼까요?

```bash
18:02:22 [WARN] `Astro.request.headers` is not available in "static" output mode. To enable header access: set `output: "server"` or `output: "hybrid"` in your config file.
```

위와 같이 나옵니다.

왜냐하면 'Astro.request.headers'를 사용할 수 없다고 합니다.

Astro 옵션 구성에서 output 모드를 'server'나 'hybrid'로 바꾸라고 합니다.

왜냐하면 기본 모드는 정적 사이트(static)이기 때문에 서버 사이드 렌더링이 안 됩니다.

그래서 'astro.config.mjs' 파일에 다음과 같이 'server'라고 output 모드를 바꾸면 됩니다.

> Astro는 기본적으로 정적 모드로 작동하므로 빌드 시 페이지가 생성됩니다. astro.config.mjs에서 output의 값을 server 또는 hybrid로 하면 SSR(Server Side Rendering)로서 동작할 수 있어 액세스가 있을 때 페이지가 작성됩니다.

```js
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  output: 'server',
})
```

다시 개발 서버를 돌려볼까요?

처음에는 아래처럼 Counter 가 1로 나오다가 페이지를 새로고침 하면 새로고침한 만큼 숫자가 올라갑니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEilz5VBOew5rp74V_vav3-xXZlN6XF5apyPmNvB7kgHyB6rIv6_L-irpxLggo3xQ_-HjX4CXwMHkJo_9A8o5FvBTQV2tixeNkBHhfo2FEtqbQKYowbgS3jJmJxGCmXJVCWitlP_5J5sF9OmpZeYiNP4yIdieN1OX4UUKzz4sAhdOO5mMTHt6v-43kXGcZY)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgFfRasOic6jSjJLvkTPsAg2inN0r9YJXdlJ-jip_FpLRhQAj7D8bI3mcgKJ_pV-ZMjb_JHmso2eNyHciIIGL-5St-Tm90-w93KuCUtgAhbj57l0Up6l9DXgpL8ISV-U3RMtWfNq2DV1tXJHm-f5x8c3TDBvimMkvm6U9KvYGqS8W24zlimqc9bFlpKbII)

크롬 개발창의 애플리케이션 쪽으로 가보면 쿠키라는 항목을 열어보면 아래 그림처럼 counter 쿠키가 존재합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEil2KRs2SYz4eDLHpxR4wd73rgAWZ5eqC7CS_szKfUHHc1gsrL_uFM--JVllOeCdSa9_JIAw3Ez2PFCfTbeM0f_-8PJQ2jin6QA6OJCvvmEQ8remwNQxniVOw9BjKyOv0CEcMFGCg5lSLhDTxNpF_Klu7H6U4sIDam_EysyrosFFN_Ec0CjZq_i-CAIxkk)

counter라는 쿠키의 속성을 보시면 중요한 게 몇 가지가 있는데요.

첫 번째, HttpOnly가 있습니다.

이 부분이 비어 있네요.

이 HttpOnly가 비어 있으면 쿠키를 클라이언트 사이드 쪽 자바스크립트로 접근이 가능합니다.

Astro를 서버 사이드 모드로 돌렸을 때 클라이언트 사이드 쪽 자바스크립트는 'script'를 쓰면 접근할 수 있는데요.

```js
---
let counter = 0

if (Astro.cookies.has("counter")) {
  const cookie = Astro.cookies.get("counter");
  if(cookie) counter = cookie.number() + 1
}

Astro.cookies.set("counter",String(counter))
---
<html>
  <h1>Counter = {counter}</h1>
</html>

<script>
  console.log(document.cookie);
</script>
```

위와 같이 설정하고 다시 크롬 개발창의 콘솔창 부분을 보시면 아래 그림처럼 counter 라는 쿠키값을 출력해 주고 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEifh_txzsJfLuySugGe42Rg60evPBEIRugUycpWq0CBFU5ks16osoyqkcLOIUvXG0CSjfyBBLi5ZAFAqXrPgdlR5-qhTY7h7YUtGfts0c-1LE-qxLCnmNq2FpcYGiFhhkgPf4RiZ7g7bzSbm0svZwgsEfiWHipQo9z3_Ec_Wb3eujN7FcoBNKlQdftA39M)

우리가 만들려고 하는 건 유저네임과 패스워드 방식의 Auth 서버이기 때문에 그리고 Auth 방식이 쿠키를 이용한 방식이기 때문에 클라이언트 사이드에서 쿠키에 접근하면 보안의 위험이 존재합니다.

그래서 쿠키 설정할 때 HttpOnly를 'true' 설정해서 오직 서버사이드에서만 접근할 수 있게 해야 합니다.

두 번째 중요한 쿠키 옵션은 secure 옵션입니다.

HTTP 통신의 경우에는 패킷 스니핑으로 토큰이 유출될 수 있어 오직 HTTPS 통신에만 쿠키가 전송되도록 secure 속성을 'true'로 설정할 수 있습니다.

```js
Astro.cookies.set('counter', String(counter), {
  httpOnly: true,
  secure: true,
})
```

> Chrome에서는 개발 환경의 localhost의 경우 http 통신에서도 쿠키를 사용할 수 있습니다.

세 번째 중요한 옵션은 'Expires/Max-Age'인데요.

쿠키의 만료일을 지정하는 겁니다.

기본 옵션은 'Session'이라고 하는 건데요.

이 옵션은 브라우저가 살아 있을 때까지입니다.

브라우저를 닫으면 종료됩니다.

이 방식도 괜찮은 방식인데요.

요즘은 로그인하는 게 귀찮아서 만료일을 7일 정도로 세팅하는게 추세입니다.

```js
const maxAge = 60 * 60 * 24 * 7

Astro.cookies.set('counter', String(counter), {
  httpOnly: true,
  secure: true,
  maxAge,
})
```

마지막에 maxAge라고만 적었는데 ES6의 축약 표기법으로 실제는 다음과 같은 겁니다.

```js
maxAge: maxAge
```

최종 코드는 아래와 같습니다.

```js
---
let counter = 0

if (Astro.cookies.has("counter")) {
  const cookie = Astro.cookies.get("counter");
  if(cookie) counter = cookie.number() + 1
}

const maxAge = 60 * 60 * 24 * 7;

Astro.cookies.set("counter", String(counter), {
  httpOnly: true,
  secure: true,
  maxAge,
});
---
<html>
  <h1>Counter = {counter}</h1>
</html>
```

아래 그림처럼 지정한 옵션 세 가지가 모두 적용되었네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkEoY3QYsBmqDKG10y3379QhOVz3NcHyDtqcq3VMTdt7lsINLBVoYbOCtgPJZyh_iuwXQMH2ZYhv4EFCGbTlxJwlyeqSVqg_Vpi4yZaNrqOM13OT_R22gmHk1wpIhjQAA-gU1M9utFxexkkCwZ9oyGmme6P1raeIPyrI0n_7AL35fVvotj_AMaWNpDbHI=w320-h36)

---

## 3. middleware 설정

쿠키 검증 코드는 모든 HTTP 통신에 있어 사전에 체크해야 되기 때문에 미들웨어에서도 접근 가능해야 하는데요.

Astro에서는 middleware는 src 폴더 아래 middleware.ts 파일을 작성하면 됩니다.

```js
import { defineMiddleware } from 'astro/middleware'

export const onRequest = defineMiddleware((context, next) => {
  console.log('counter', context.cookies.get('counter'))
  return next()
})
```

미들웨어를 설정했으면, 개발 서버를 다시 시작해야 합니다.

```bash
 astro  v4.0.8 ready in 161 ms

┃ Local    http://localhost:4321/
┃ Network  use --host to expose

18:22:16 watching for file changes...
counter AstroCookie { value: '6' }
18:22:21 [200] / 81ms
counter AstroCookie { value: '7' }
18:22:24 [200] / 8ms
```

터미널 창에 counter라는 쿠키 관련 값이 제대로 표시가 됩니다.

---

## 4. Prisma 설정

사용자 정보를 저장하기 위해 DB를 이용해야 하는데요.

Typescript ORM으로 아주 유명한 Prisma를 이용하겠습니다.

---

### 4-1. Prisma 설치

먼저, 관련 Prisma 패키지를 설치하겠습니다.

```bash
npm install prisma -D
```

Prisma 구성 파일을 세팅하려면 'init' 명령어를 주면 됩니다.

```bash
npx prisma init --datasource-provider sqlite

✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

warn You already have a .gitignore file. Don't forget to add `.env` in it to not commit any private information.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run prisma db pull to turn your database schema into a Prisma schema.
3. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
```

로컬 개발서버를 위해 sqlite를 선택했습니다.

자동으로 '.env' 파일도 만들어 줬네요.

그리고 스키마 파일인 'schema.prisma' 파일도 prisma 폴더 밑에 만들어 줬습니다.

이제 모델을 설정해야 하는데요.

---

## 4-2. Model 설정

Prisma는 모델이라는 걸로 데이터베이스 스키마를 구성합니다.

'schema.prisma' 파일에 Model을 추가합시다.

```js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

User 모델인데요.

간단하게 email과 name, password만 구성했습니다.

로그인을 email과 password로만 이루어지게 할 예정입니다.

당연히, email은 unique 해야겠죠.

---

### 4-3. 테이블 만들기

Prisma를 이용해서 모델을 만들었으면 실제 sqlite에 들어갈 테이블을 만들어야 합니다.

간단히 'db push' 명령어를 사용하면 됩니다.

```bash
npx prisma db push
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "dev.db" at "file:./dev.db"

SQLite database dev.db created at file:./dev.db

🚀  Your database is now in sync with your Prisma schema. Done in 15ms

Running generate... (Use --skip-generate to skip the generators)

added 1 package, and audited 474 packages in 7s

179 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

✔ Generated Prisma Client (v5.7.1) to ./node_modules/@prisma/client in 159ms
```

'dev.db'라는 sqlite 파일에 테이블을 만들었고, Prisma Client도 만들어 줬네요.

---

### 4-4. Prisma Studio에서 보기

Prisma는 Prisma Studio라는 웹 UI를 제공해 주는데요.

이게 아주 편합니다.

```bash
npx prisma studio
```

실행하면 개발서버 5555번으로 브라우저가 열리면서 아래와 같이 보여주는데요.

우리가 만든 User 모델을 클릭해서 테이블 내용을 볼 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjWiykL8S1bxlODXdlO7TSZ6n-Jdb5z4C7WPgYCLmnRlTRH3WHFCrz8gvi0uFS03bGcP1SkHXyTjDvOmR8pqHy3DhkQJj4qB6C_A3boXEFwVjs-uU8mhn8QwMKx7lkhtypAs1mVQ9fKnU0aQIY_PXvWn9puybN5GOn4Wdl6njAaoNbAH16xwvbwdb_qBKI)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhj4fdThECoqhIV8fJAqxlRegsBXX6PDEwLamuqsT-YqbTKRXVvOPDmV52ZKmiWqw66DI4iGSlA_fHbSf81bzcPuO4HYUrz9aT420hdLhv8IJfMylQrEHshju_j6DCcos7AA_2CVH6WLZWtd2rRrfExxPgJyJoBRjOkhxFtulJvq-DHmATKHxup-d2PP7I)

---

## 5. UI 만들기

이제 로그인, 가입하기, 대시보드 등 Auth 관련 페이지를 만들어야 합니다.

대시보드 페이지는 로그인했을 때만 볼 수 있고,

'/' 루트 페이지는 로그인 여부와 관계없이 볼 수 있어야 하며,

로그인, 가입하기 페이지는 로그인되지 않았을 때만 볼 수 있어야겠죠.

---

### 5-1. 레이아웃 파일 만들기

Astro를 사용하면 레이아웃 파일을 만들어야 편합니다.

src 폴더에 layouts 폴더를 만들고 그 밑에 Layout.astro라는 파일을 만들겠습니다.

```js
// /src/layouts/Layout.astro

---
import { ViewTransitions } from "astro:transitions";
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Astro</title>
    <ViewTransitions />
  </head>
  <body>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/signup">Signup</a></li>
        <li><a href="/login">Login</a></li>
      </ul>
    </nav>
    <slot />
  </body>
</html>

<style>
  ul {
    display: flex;
    gap: 14px;
    list-style: none;
  }
</style>
```

## 5-2. 루트 페이지와 대시보드 페이지 만들기

src 폴더의 index.astro는 아래와 같이 만들겠습니다.

```js
---
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <h1>Home Page</h1>
</Layout>
```

그리고 src 폴더 밑에 있는 pages 폴더 밑에 dashboard 폴더를 만들고 그 밑에 index.astro 파일을 아래와 같이 만들겠습니다.

```js
---
import Layout from "../../layouts/Layout.astro";
---

<Layout>
  <h1>Dashboard</h1>
</Layout>
```

이제까지의 설정이라면 아래 그림처럼 나올 겁니다.

링크가 아주 잘 작동하네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiHtbObSY4Ds6gYJqAfNEnxTa4ko9eOOQiDWGo6Q8Wx4kWzWFWDehraDfd8EKEDjfYJiK0RupXLJR_VRWMjcD8QVxsVUloRGL26z9uRXyYVJ9tTCtwATdmWJ1rOhWL1rWxNaNB__kAcLfKtCD_wIB0PI1hDvwn7xGO7n4G02zeatzGge6iaJxExpR-PkNs)

---

## 6. 인증 관련 코드 설정

이제 전체적인 페이지의 구조가 갖춰졌으니 인증 관련 코드를 설정해 보겠습니다.

---

### 6-1. Prisma Client 설정

보통 src 폴더 밑에 prisma.ts 파일에 Prisma Client를 export 하는 코드를 작성합니다.

```js
// /src/lib/prisma.ts

import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()
```

---

### 6-2. hash 관련 bcryptjs 설치

패스워드를 해시해서 저장해야 하므로 bcryptjs 패키지를 아래와 같이 설치하겠습니다.

그리고 토큰 형식으로 쿠키에 저장해야 하므로 가장 유명한 jsonwebtoken 패키지도 같이 설치하겠습니다.

그리고 zod를 이용해서 타입 유효성을 검사해야 하므로 zod도 같이 설치하겠습니다.

```bash
npm install bcryptjs jsonwebtoken zod
npm install @types/bcryptjs @types/jsonwebtoken -D
```

---

## 7. 가입하기 화면 만들기

유저를 생성하는 가입하기 화면을 만들어야 하는데요.

이 파일은 바로 라우팅이 되기 때문에 src 폴더 밑에 있는 pages 폴더에 'signup.astro'라는 파일을 만들겠습니다.

아래 링크의 Astro 공식 문서에 가면 signup 폼을 아주 잘 설명해 준 게 있습니다.

[Build HTML forms in Astro pages](https://docs.astro.build/en/recipes/build-forms/)

위 링크를 한번 읽어 보시는 걸 추천드립니다.

```js
// /src/pages/signup.astro

---
import Layout from "../layouts/Layout.astro";
---

<Layout>
  <h1>Sign up</h1>
  <form method="post">
    <div>
      <label for="name">Name</label>
      <input type="text" name="name" id="name" />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" required />
    </div>
    <div>
      <label for="password">Password</label>
      <input type="password" name="password" id="password" required />
    </div>
    <button>Sign Up</button>
  </form>
  <a href="/login">Login</a>
</Layout>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEi7UsbgW-DlRo-b7dc_1FGlUP2deriVEn_Zu-cnHlQqLaElIbZo7TwvVNIVXHjMLyCIR8mVlUHZI-KPGOv1aQxVH_n3q5fgmaGF7npthrf32-LblklU0Wt9OWe3G7KoPsKSLfhmts68s1jaK55w99yHKkw0jGcRcwYKuoP3YxFDAKyhdxpu_UH7XUt4B_A)

위와 같이 깔끔한 Sign up 페이지가 작성되었네요.

그러면 이제 테스트를 위해 더미 데이터를 넣고 Signup 버튼을 눌러보겠습니다.

여기서 가장 기본이 되는 HTTP의 form 행동 양식에 대해 설명해 드리자면, 위 코드에서 'form' 태그를 잘 보십시오.

```js
<form method='post'>...</form>
```

method가 'post'라고만 되어 있네요.

HTTP POST 리퀘스트는 보통 데이터를 클라이언트에서 서버로 전달하기 위해 쓰입니다.

그리고 이렇게 POST 메서드를 처리하는 서버의 주소 즉, API 엔드포인트는 action이라는 항목으로 지정하는데요.

위에서 보듯이 'form' 태그에는 action 항목이 없습니다.

action 항목이 없으면 현재 페이지로 POST 리퀘스트를 보낸다는 겁니다.

즉, 다음과 같은 거죠.

```js
<form method='post' action='/signup'>
  ...
</form>
```

signup 라우팅이 현재 페이지인데요.

우리가 Sign Up 버튼을 누르면 form이 submit 되면서 리퀘스트가 POST 메서드 방식으로 "/signup" 라우팅으로 갑니다.

우리가 만든 Astro는 서버 사이드 렌더링이기 때문에 같은 페이지에서 서버 사이드 코드를 처리할 수 있습니다.

따로 API 엔드포인트를 안 만들어도 되는 거죠.

그러면 '/src/pages/signup.astro' 파일의 첫 부분에 POST 메서드의 HTTP 리퀘스트를 처리할 수 있는 코드를 추가해 보겠습니다.

```js
---
import Layout from "../layouts/Layout.astro";

if (Astro.request.method === "POST") {
  const formData = await Astro.request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  console.log(name, email, password);
}
---

// 밑에 html 코드는 이전과 동일
```

Astro에서 리퀘스트는 'Astro.request' 객체를 통해 손쉽게 접근가능합니다.

위와 같이 if 문을 두어 "POST" 리퀘스트일 때만 작동하는 코드를 넣었습니다.

그리고 HTML의 FormData를 통해 우리가 입력한 name, email, password를 얻을 수 있습니다.

이 방식이 가장 기본적은 HTTP의 기본 작동 방식이죠.

적당한 이름을 넣고 'Sign Up' 버튼을 누르면 터미널 창에 아래와 같이 나올 겁니다.

```bash
18:57:02 [200] /signup 19ms
counter AstroCookie { value: '8' }
test test@test.com 1234
```

왜 터미널창에 나오냐면 서버 사이드 코드이기 때문입니다.

제가 입력한 데로 잘 나오고 있네요.

---

## 8. formData의 유효성 검사

우리가 지금 Typescript를 쓰고 있기 때문에 formData의 유효성을 검사하는 게 중요합니다.

zod의 safeParse 함수를 사용할 때가 온 거죠.

```js
const result = z
  .object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(8),
  })
  .safeParse({ email, name, password })
```

위와 같이 한 번에 써도 되고, 아래와 같이 나눠서 써도 됩니다.

```js
const schema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
})

const result = schema.safeParse({ email, name, password })
```

이제 signup.astro 파일을 다시 써보면,

```js
---
import { z } from "zod";
import Layout from "../layouts/Layout.astro";

if (Astro.request.method === "POST") {
  const formData = await Astro.request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = z
    .object({
      email: z.string().email(),
      name: z.string(),
      password: z.string().min(8),
    })
    .safeParse({ email, name, password });

  console.log("result", result);
}
---

// 밑에 html 코드는 이전과 동일
```

위와 같이 작성했고, 다시 테스트를 위해 'Sign Up' 버튼을 눌러볼까요?

```bash
result {
  success: true,
  data: { email: 'test2@test2.com', name: 'test2', password: '00000000' }
}
```

위와 같이 zod 가 리턴해주는 result 값이 아주 잘 나오고 있습니다.

success 가 true, false 값이면 유효성 검증을 success 항목만 참고하면 되겠네요.

그리고 result.data 항목에 입력한 formData가 잘 나오고 있습니다.

일부러 실패해 볼까요?

email은 불완전하게 넣고 password는 8글자 보다 적게 넣어보겠습니다.

그러면 아래와 같이 나오는데요.

```js
result { success: false, error: [Getter] }
```

success가 false일 경우 error를 표시해 주는 console.log를 추가하겠습니다.

```js
if (!result.success) console.log(result.error.issues)
```

```bash
[
  {
    validation: 'email',
    code: 'invalid_string',
    message: 'Invalid email',
    path: [ 'email' ]
  },
  {
    code: 'too_small',
    minimum: 8,
    type: 'string',
    inclusive: true,
    exact: false,
    message: 'String must contain at least 8 character(s)',
    path: [ 'password' ]
  }
]
```

위와 같이 zod가 아주 잘 작동하고 있습니다.

result.error.issues 항목을 잘 다룬다면 가입하기 페이지에서 실제 사용자에게 뭐가 잘못되었는지 상세하기 알려줄 수가 있겠네요.

이제 가입하기 페이지에서 유효성 검사에 실패하면 issues 변수에 저장하여 브라우저에 표시되도록 설정해 보겠습니다.

또 유효성 검사에 실패하면 Astro.response.status에서 상태 코드 400(Bad Request)을 반환하도록 설정하겠습니다.

Astro.response.status를 설정하지 않으면 기본적으로 상태 코드 200이 반환되기 때문에 꼭 Astro.response.status를 설정하는 게 좋습니다.

```js
---
import Layout from "../layouts/Layout.astro";
import z from "zod";

let issues: z.ZodIssue[] = [];

if (Astro.request.method === "POST") {
  const formData = await Astro.request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = z
    .object({
      email: z.string().email(),
      name: z.string(),
      password: z.string().min(8),
    })
    .safeParse({ email, name, password });

  if (!result.success) {
    issues = result.error.errors;
    Astro.response.status = 400;
  }
}
---

<Layout>
  <h1>Sign up</h1>
  <form method="post">
    <div>
      <label for="name">Name</label>
      <input type="text" name="name" id="name" />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" required />
    </div>
    <div>
      <label for="password">Password</label>
      <input type="password" name="password" id="password" required />
    </div>
    {
      issues.length > 0 &&
        issues.map((issue) => (
          <p>
            {issue.path[0]}:{issue.message}
          </p>
        ))
    }
    <button>Sign Up</button>
  </form>
  <a href="/login">Login</a>
</Layout>
```

가입하기 페이지의 UI 부분이 완성되었습니다.

일부러 틀리게 테스트해 보면 아래와 같이 브라우저에 그 내용이 나타나게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjZ1cFwtdGo6-LAigIAsh-pmXbDfvGtX8RnKf-NzYxg5I_wEHS0IAZB75ft0a3W3DDLDvRkvwe45IFdvWiA0ogx1GCdIfSQ3qgW5iziSzSzub84ibsuniQbw56LoNrJCU6lPr1qUSqkNh7PSrnS0O1aOcbQ3pT8Tj4xIH_vaFhRTT4D_iA6T3_xY4I1t7w)

일단 여기까지 성공입니다.

그런데, form의 submit 특성상 submit 버튼을 누르면 입력한 값이 없어집니다.

에러가 날 경우 사용자가 입력한 값이 남아 있어야 뭐가 틀렸는지 알 수 있는데요.

이 부분을 수정해 보겠습니다.

Astro에서는 아래와 같이 간단하게 처리할 수 있습니다.

각 항목의 변수 값을 따로 만들고 input 태그의 value값에 넣어주면 됩니다.

이건 React가 아니라서 onChange를 신경 쓰지 않아도 되죠.

```js
---
import Layout from "../layouts/Layout.astro";
import z from "zod";

let issues: z.ZodIssue[] = [];
let nameInput = "";
let emailInput = "";
let passwordInput = "";

if (Astro.request.method === "POST") {
  const formData = await Astro.request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  nameInput = name;
  emailInput = email;
  passwordInput = password;

  const result = z
    .object({
      email: z.string().email(),
      name: z.string(),
      password: z.string().min(8),
    })
    .safeParse({ email, name, password });

  if (!result.success) {
    issues = result.error.errors;
    Astro.response.status = 400;
  }
}
---

<Layout>
  <h1>Sign up</h1>
  <form method="post">
    <div>
      <label for="name">Name</label>
      <input type="text" name="name" id="name" value={nameInput} />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" value={emailInput} required />
    </div>
    <div>
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={passwordInput}
        required
      />
    </div>
    {
      issues.length > 0 &&
        issues.map((issue) => (
          <p>
            {issue.path[0]}:{issue.message}
          </p>
        ))
    }
    <button>Sign Up</button>
  </form>
  <a href="/login">Login</a>
</Layout>
```

다시 테스트를 해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhKAerZgLkDWJfDxGogmev5r1idSwOa8J4sOVTSFgmTD7R1_hurk_HQjNXXr0NURtGL7CneOshEmrfKCfMwv5G1YhZMOYk00vve15zC9c0FdDh1WW2D8slbDgdOymeaJ9MAIYHwMAbDoFuxtDIz8d1UT4zIC_gWauEIPUEl8B9eEEY2Y-bnLcf55UGZltE)

위와 같이 밑에 에러 표시가 되면서 동시에 사용자가 입력한 값이 유지되고 있습니다.

---

## 9. 유저 정보를 DB에 저장하기

이제 정상적으로 입력했을 경우 DB에 저장하는 부분을 작성해야겠네요.

아까 만들었던 'lib/prisma.ts' 파일에서 Prisma Client를 불러와서 create 해주면 됩니다.

코드가 위치할 곳은 아래와 같이 실패했을 때 보여주던 error 표시 다음인데요.

```js
---
import Layout from "../layouts/Layout.astro";
import z from "zod";
import { prisma } from "../lib/prisma";
// 기존 동일
if (!result.success) {
  issues = result.error.errors;
  Astro.response.status = 400;
} else {
  await prisma.user.create({
    data: {
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
    },
  });
}
```

위와 같이 유효성 검증이 실패하지 않았을 경우 prisma.user.create 함수를 통해 DB에 작성하게 됩니다.

테스트를 위해 유효성 검증을 통과할 수 있게 유저 정보를 넣어 보겠습니다.

화면 표시는 그대로 입력한 값이 나오고 있고 터미널 창에는 아래와 같이 POST 메서드가 작동했다고 나오네요.

```bash
counter AstroCookie { value: '8' }
19:20:12 [200] POST /signup 15ms
```

그 와중에 middleware에 설정했던 console.log도 잘 나오고 있습니다.

이제 Prisma Studio로 가서 데이터가 잘 들어왔는지 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEh2Ou1jHCT5licLLE2NevzIixSzS28T_R278qROep7v-BhMBWj7RYjEyuSdFVdbaBtmhlqy4PoOAT00R0-XuHD9F0RLbmNLsBDnchsREVI8fUsM49DjvbK9dELZmWzZlm-2sVmIUf1egmIKf-oZmpHdFq7h4wgnVcxEEFHqZjfjPAqs-9XY5uyurhistTI)

위와 같이 데이터가 잘 들어왔네요.

그런데 패스워드가 일반 텍스트입니다.

절대 이렇게 설계하면 안 됩니다.

패스워드는 해시된 상태로 저장해야 하죠.

아까 설치한 bcryptjs 라이브러리를 사용할 때가 왔네요.

아까 if-else 부분에 아래와 같이 고치면 됩니다.

```js
---
import Layout from "../layouts/Layout.astro";
import z from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
// 기존과 동일
if (!result.success) {
    issues = result.error.errors;
    Astro.response.status = 400;
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(result.data.password, salt);
    await prisma.user.create({
      data: {
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
      },
    });
  }
```

이제 다시 테스트해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjVoxoMlZtZTsMrZLGRleN0paSciUZRkH2QAei6Fo4sFmLiIIE85q_ISM2VcqHCOU3tBCxndaSakU5n0O2rzHbKzUmm0V5OgDo4oeDeeMa2oB9XGocmLO66EwXl-mWk2cdhXk00Gu-tGlbtTiaH9QTYr3_-YV05azUYPBjSIArXfsC--x6hWLXNckAy3xY)

위와 같이 test2 라는 이름의 패스워드는 해시된 상태로 잘 저장되었네요.

---

## 10. 동일 이메일 에러 처리하기

이메일은 유니크하게 설정했었는데요.

왜냐하면 이메일은 사람마다 고유하기 때문입니다.

그래서 가입할 때 이메일이 중복되었다는 거는 유저가 이전에 가입한 정보가 있다는 겁니다.

테스트를 위해 아까 가입한 'test2@test.com' 이라는 이메일을 다시 사용해서 가입해 보겠습니다.

터미널 창은 아래와 같은 에러가 나오고, 브라우저도 같은 에러가 나옵니다.

```bash
19:27:18 [ERROR]
Invalid `prisma.user.create()` invocation:


Unique constraint failed on the fields: (`email`)
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgnLTH_pAh26zVAwlDNnesye9LOd0xXRWhjjMGwrV4ElRJp0wlbx6yN1nJGCKn-nc3TAjvLerWpNQ6psxtUA04M5IYji0JcT9s2UaN7VLSndAs3ftzWiFki0CUZn0Ds3mvKxFoZ7tVdJWR8iaHf-5EyKHnWwpNbI6zU_YavpTXlPr0cXDm1lVNcpttDetI)

Prisma가 친절하게 에러 이유도 가르쳐 주고 있네요.

코드에 이 부분을 점검하는 부분을 추가해 보겠습니다.

유저에세 에러 메시지를 잘 보여주기 위해 errors라는 배열을 따로 만들어서 처리해 보도록 하겠습니다.

prisma.user.create 부분에서 try, catch 문을 이용해서 Prisma가 내뿜는 PrismaClientKnownRequestError 관련 에러를 캐치해서 처리해 보도록 하겠습니다.

전체 코드입니다.

HTML 쪽 에러 사유를 보여주는 곳도 수정했습니다.

```js
---
import Layout from "../layouts/Layout.astro";
import z from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

interface ErrorMessage {
  name: string | number;
  message: string;
}

let errors: ErrorMessage[] = [];
let nameInput = "";
let emailInput = "";
let passwordInput = "";

if (Astro.request.method === "POST") {
  const formData = await Astro.request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  nameInput = name;
  emailInput = email;
  passwordInput = password;

  const result = z
    .object({
      email: z.string().email(),
      name: z.string(),
      password: z.string().min(8),
    })
    .safeParse({ email, name, password });

  if (!result.success) {
    errors = result.error.errors.map((error) => {
      return {
        name: error.path[0],
        message: error.message,
      };
    });
    Astro.response.status = 400;
  } else {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(result.data.password, salt);
      await prisma.user.create({
        data: {
          name: result.data.name,
          email: result.data.email,
          password: hashedPassword,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          errors = [{ name: "email", message: "email already registered" }];
        }
        Astro.response.status = 400;
      } else {
        console.log(e);
        Astro.response.status = 500;
      }
    }
  }
}
---

<Layout>
  <h1>Sign up</h1>
  <form method="post">
    <div>
      <label for="name">Name</label>
      <input type="text" name="name" id="name" value={nameInput} />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" value={emailInput} required />
    </div>
    <div>
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={passwordInput}
        required
      />
    </div>
    {
      errors.length > 0 &&
        errors.map((error) => (
          <p>
            {error.name}:{error.message}
          </p>
        ))
    }
    <button>Sign Up</button>
  </form>
  <a href="/login">Login</a>
</Layout>
```

다시 일부러 에러를 내 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEg1eb3JZD0A94lgt1DPaZQH5btuAMb9Tt3yA7ZhZrzOTgzjd2AtzGnuC2aiMMYK2kMRCxLTo4_XDpX9HrfFloD1_za0pq__K95T5GHeOdx7-LeYUSxGA54gYPdIHiOvBOCmt63YkMvGnoDBjhNkaw4DAsPLHuZ5eFJ8FekJuUl0A7CYqDwsDhVdCD8xeBE)

위 그림과 같이 email 중복 에러도 잘 잡아내고 있습니다.

---

## 11. 토큰 만들기

사용자가 가입하기를 통해 성공적으로 가입을 했으면 그 상태로 로그인한 상태가 돼야 합니다.

우리가 이번 강좌에서 사용할 로그인 방식은 토큰을 이용한 방식이죠.

그래서 토큰을 생성해 보도록 하겠습니다.

jsonwebtoken 패키지를 사용할 겁니다.

토큰의 secret는 보통 '.env' 파일에 작성하면 됩니다.

```bash
## .env

DATABASE_URL="file:./dev.db"
SECRET=asdfasdfsadfasdfsadf
```

아무 글자나 넣으면 됩니다.

토큰(token)을 만들려면 jwt.sign 함수를 아래와 같이 사용하면 됩니다.

```js
const token = jwt.sign(
  {
    id: user.id,
    name: user.name,
    email: user.email,
  },
  import.meta.env.SECRET,
  { expiresIn: '1d' },
)
```

Astro는 Vite를 이용하고 있어서 'import.meta.env.SECRET'라는 방식으로 사용하면 됩니다.

타입스크립트를 위해서 'env.d.ts'파일에 SECRET 관련 타입도 아래와 같이 지정하겠습니다.

```js
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly SECRET: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
```

token을 만드는 코드는 어디에 위치해야 할까요?

당연히 Prisma를 이용해서 DB에 사용자 정보를 create 완료했을 때입니다.

```js
import jwt from "jsonwebtoken";
...
...
...
try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(result.data.password, salt);
    const user = await prisma.user.create({
    data: {
        name: result.data.name,
        email: result.data.email,
        password: hashedPassword,
    },
    });
    const token = jwt.sign(
    {
        id: user.id,
        name: user.name,
        email: user.email,
    },
    import.meta.env.SECRET,
    { expiresIn: "1d" },
    );
    console.log(token);
} catch (e) {
    ...
    ...
}
```

코드가 너무 길어 위와 같이 코드 일부분만 보여줬습니다.

들어갈 위치만 확인하시고 넣어주시면 됩니다.

그리고 prisma.user.create의 결과 값을 user 변수에 저장했습니다.

그래서 jwt.sign 함수에 user.id, user.name, user.email 값을 이용할 수 있게 되는 거죠.

여기서 신기한게 지금까지 만든 모든 코드는 아래 if 문 안에 있는 겁니다.

```js
if (Astro.request.method === "POST") {
...
...
}
```

즉, 유저가 form 데이터를 입력하고 submit 버튼을 눌러 POST 메서드가 실행되었을 때 작동하는 코드인 거죠.

웹 서버의 가장 기본이 되는 작동 방식입니다.

테스트를 위해서 새로운 가입자를 입력하고 터미널 창을 볼까요?

토큰이 어떻게 나오는지 확인해 보도록 하겠습니다.

```bash
counter AstroCookie { value: '8' }
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InRlc3Q1IiwiZW1haWwiOiJ0ZXN0NUB0ZXN0LmNvbSIsImlhdCI6MTcwNDE5MjA3NiwiZXhwIjoxNzA0Mjc4NDc2fQ.-iVFexjKGcNoaOUGJ9ZLAIGw9r1qe5Z3WCGqch5VmL8
```

토큰 값이 나왔네요.

이걸 디코드할 수 있는 [https://jwt.io](https://jwt.io) 페이지에서 살펴보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjb9VZW6NnnON4zx920Qu0VJuw4RBRd5JR6zJDcJ2IzgRx8HhIN882Za10ITAhpP6Ly6wivsj6hCTEkGU_VhoG1okqkBCNkdVbWsWYXUZXDNhJzax7Pb9xSg2zn43CZ4imFNhCvyeIPX00ScVKL6v4pWZBq1w2opCPZk_swpd_NYW-qnobsFrKZLEAU75U)

위와 같이 나오는데요.

알고리즘은 'HS256'이고, 방식은 'JWT'라고 나옵니다.

그리고 입력했던 name, email 정보도 정확하네요.

이렇게 토큰을 디코드하면 사용자 정보를 확인할 수 있습니다.

그래서 우리가 사용자가 로그인되었다는 정보를 쿠키에 토큰을 저장하고, 필요할 때 디코드하면 되는 거죠.

---

## 12. 쿠키 만들기

토큰 작성이 완료되었네요.

이 토큰을 쿠키에 저장하는 코드를 만들면 됩니다.

토큰은 'token'이라는 변수에 저장했었죠.

쿠키는 아래와 같이 만들면 됩니다.

```js
Astro.cookies.set('mytoken', token, {
  httpOnly: true,
  secure: true,
  maxAge: 60 * 60 * 24,
})

return Astro.redirect('/dashboard', 302)
```

쿠키 이름은 'mytoken'이네요.

이 이름을 특별하게 만드는 게 중요합니다.

보통 사이트 이름과 연관하여 만드는게 중요하죠.

다른 웹사이트랑 쿠키 이름이 중복되면 안 되니까요?

그리고 쿠키를 저장했으면 모든 가입하기 로직이 끝났기 때문에 대시보드로 이동하는 'redirect' 명령어를 실행시키면 됩니다.

이코드는 jwt.sign 함수 아래쪽에 넣으시면 됩니다.

혹시나 해서 signup.astro 파일의 전체 코드를 보여드리겠습니다.

```js
---
import Layout from "../layouts/Layout.astro";
import z from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

interface ErrorMessage {
  name: string | number;
  message: string;
}

let errors: ErrorMessage[] = [];
let nameInput = "";
let emailInput = "";
let passwordInput = "";

if (Astro.request.method === "POST") {
  const formData = await Astro.request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  nameInput = name;
  emailInput = email;
  passwordInput = password;

  const result = z
    .object({
      email: z.string().email(),
      name: z.string(),
      password: z.string().min(8),
    })
    .safeParse({ email, name, password });

  if (!result.success) {
    errors = result.error.errors.map((error) => {
      return {
        name: error.path[0],
        message: error.message,
      };
    });
    Astro.response.status = 400;
  } else {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(result.data.password, salt);
      const user = await prisma.user.create({
        data: {
          name: result.data.name,
          email: result.data.email,
          password: hashedPassword,
        },
      });
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        import.meta.env.SECRET,
        { expiresIn: "1d" }
      );
      console.log(token);

      Astro.cookies.set("mytoken", token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24,
      });

      return Astro.redirect("/dashboard", 302);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          errors = [{ name: "email", message: "email already registered" }];
        }
        Astro.response.status = 400;
      } else {
        console.log(e);
        Astro.response.status = 500;
      }
    }
  }
}
---

<Layout>
  <h1>Sign up</h1>
  <form method="post">
    <div>
      <label for="name">Name</label>
      <input type="text" name="name" id="name" value={nameInput} />
    </div>
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" value={emailInput} required />
    </div>
    <div>
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={passwordInput}
        required
      />
    </div>
    {
      errors.length > 0 &&
        errors.map((error) => (
          <p>
            {error.name}:{error.message}
          </p>
        ))
    }
    <button>Sign Up</button>
  </form>
  <a href="/login">Login</a>
</Layout>
```

테스트를 위해 새로운 사용자를 가입해 볼까요?

정상적으로 입력하면 대시보드로 페이지가 이동되고, 크롬 개발창의 애플리케이션 쪽으로 가서 쿠키를 보시면 아래와 같이 mytoken이라는 쿠키가 보이고, 맨 처음 만들었던 counter 쿠키도 보이네요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgvg192GVQFtIwIPPiwMSvh8TA1omgEd7Gart3Np0nW9pnhwo0G4RdTOToc-bF5w7_j5HsAiieKdlDu0JP4jPjiFhyr8b-7tnW_Wc3jzcdyw5dnGcSTBa7gUlYtNpL56YpqzgeQ7o1AlsYieGB0Ed4ZbgkeYjq7iIKY0fnZFITahqnf4EG5-e4zB925HrY)

counter 쿠키는 삭제하지 않아서 계속 보이네요.

mytoken 쿠키의 값에 우리가 만든 토큰 값이 있습니다.

---

## 13. 로그인 페이지 만들기

유저 가입하기 페이지를 만들었으니 로그인 페이지를 만들어야겠죠.

로그인 로직은 간단합니다.

이메일과 패스워드만 폼데이터로 받아서 그걸 DB의 이메일과 패스워드와 비교해서 맞으면 해당 토큰을 만들고, 다시 그 토큰을 mytoken이라는 쿠키에 저장하면 되는 거죠.

src 폴더 밑의 pages 폴더 밑에 login.astro 라는 파일을 아래와 같이 만듭니다.

```js
---
import Layout from "../layouts/Layout.astro";
import z from "zod";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface ErrorMessage {
  name: string | number;
  message: string;
}

let errors: ErrorMessage[] = [];
let emailInput = "";
let passwordInput = "";

if (Astro.request.method === "POST") {
  const formData = await Astro.request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  emailInput = email;
  passwordInput = password;

  const result = z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
    })
    .safeParse({ email, password });

  if (!result.success) {
    errors = result.error.errors.map((error) => {
      return {
        name: error.path[0],
        message: error.message,
      };
    });
    Astro.response.status = 400;
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: result.data.email,
        },
      });

      if (!user) {
        errors = [{ name: "email", message: "Invalid credentials" }];
        Astro.response.status = 400;
      } else {
        const valid = bcrypt.compareSync(password, user.password);

        if (!valid) {
          errors = [{ name: "password", message: "Invalid credentials" }];
          Astro.response.status = 400;
        } else {
          const token = jwt.sign(
            {
              id: user.id,
              name: user.name,
              email: user.email,
            },
            import.meta.env.SECRET,
            { expiresIn: "1d" },
          );

          Astro.cookies.set("mytoken", token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24,
          });

          return Astro.redirect("/dashboard", 302);
        }
      }
    } catch (e) {
      console.log(e);
      Astro.response.status = 500;
    }
  }
}
---

<Layout>
  <h1>Login</h1>
  <form method="post">
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" value={emailInput} required />
    </div>
    <div>
      <label for="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={passwordInput}
        required
      />
    </div>
    {
      errors.length > 0 &&
        errors.map((error) => (
          <p>
            {error.name}:{error.message}
          </p>
        ))
    }
    <button>Login</button>
  </form>
  <a href="/signup">SigUp</a>
</Layout>
```

전체 코드입니다.

왜냐하면 가입하기 로직과 거의 비슷하기 때문입니다.

먼저, 아래 코드처럼 이메일이 있는지 확인합니다.

```js
const user = await prisma.user.findUnique({
  where: {
    email: result.data.email,
  },
})
```

그리고 해당 이메일이 있으면 그 사용자 정보를 user 변수에 저장하고 나서 다시 해시된 패스워드와 비교합니다.

해시된 패스워드를 비교하는 함수는 bcrypt.compareSync 함수를 사용하면 됩니다.

```js
const valid = bcrypt.compareSync(password, user.password)
```

이 함수는 동기식인데요.

이 함수가 비동기식이면 문제가 되죠.

패스워드 확인도 못했는데 다음 코드를 수행하면 안 되니까요.

그러면 아까 가입했던 유저 정보로 로그인해볼까요?

수작업으로 mytoken이라는 쿠키를 삭제하고 시도해야 합니다.

아직 logout 로직이 없어서 이죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj3GGUv-pSvzBYJ9TJHSLvucdkZSBseHyjQYXKl71g6bu4rKWHDEnHBgAKmVtbiUYJeDk-Syk-WuLTKBcBphwYEtYjROvTtRQ09OaEeo-77KWjZRYTXdG5XooKDx39rFW_JaYij6R-LjXaioTghKSQFY1BGW1B76EnDyvGAq1G4aUBkfOlXbMg5mDNF5OQ)

위 그림처럼 mytoken 쿠키값이 없을 때 로그인을 시도하면 아래와 같이 mytoken이 생깁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEigikaPZWVHxQNO0W0padDVtUMjywtyDUwdX4_mUzu67z79-_oWlu0Os8v8rICH0TKAhTKdSePbpNDkxDTQTZTMhfpricMB4yf2Xs_02SJf5Umw7fYTlGJw2mlyNyZBPuI9jjy8G1QnTxYOy0OiCQBFs7qrvFG4NZiFFMQFMh7-iaA2_bdzQmtCztIc9O0)

로그인 로직도 완성되었습니다.

---

## 14. 미들웨어로 페이지별 액세스 제한하기

로그인 상태에 따라 각 페이지별 액세스를 제한하는 방식을 취해야 하는데요.

로그인된 상태에서 가입하기 페이지와 로그인 페이지에 또 들어가면 좋은 UX가 아니지 않습니까?

미들웨어를 이용해서 하면 쉬운데요.

아래 코드를 보시면 'allowedPaths' 변수에 허용할 라우팅 주소를 넣습니다.

allowedPath는 로그인 상관없는 페이지라서 바로 next() 함수를 호출하면 됩니다.

이제 allowedPath에 포함되지 않은 페이지에 액세스하는 경우 쿠키에 포함된 토큰을 검색하고 토큰이 존재하는 경우 유효성 검사를 수행합니다.

검증 후의 데이터는 context.locals에 user 라는 이름으로 저장하고 있습니다.

Astro에서 글로벌 전역 변수 같은 거죠.

context.locals를 이용하면 어떤 Astro 페이지에서도 쉽게 접근할 수 있어 아주 편합니다.

그래서 context.locals.user 라는 값에 토큰을 디코드해서 얻은 사용자 정보를 입력해서 로그인 유무를 나타내는 거죠.

쿠키가 없으면 user에는 null이 포함됩니다.

```js
import { defineMiddleware } from 'astro/middleware'
import jwt from 'jsonwebtoken'

const allowedPaths = ['/']

export const onRequest = defineMiddleware((context, next) => {
  if (allowedPaths.includes(context.url.pathname)) return next()

  context.locals.user = null

  const token = context.cookies.get('mytoken')

  if (token?.value) {
    jwt.verify(token.value, import.meta.env.SECRET, (err, decoded: any) => {
      if (!err) context.locals.user = decoded
    })
  }
  return next()
})
```

위와 같이 미들웨어를 작성하면 됩니다.

타입스크립트가 user 부분에 에러가 있다고 나오는데요.

user 타입을 지정해야 합니다.

'env.d.ts' 파일에 아래와 같이 추가하면 됩니다.

```js
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly SECRET: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare namespace App {
  interface Locals {
    user: null | {
      id: number;
      name?: string;
      email: string;
    };
  }
}
```

이제 미들웨어에서 로그인된 상태의 유저 정보가 context.locals.user 변수에 저장되기 때문에 이 정보를 이용해서 UI를 바꿔주면 됩니다.

일단 로그인된 상태에서 보여주는 라우팅 주소인 대시보드를 수정해 보겠습니다.

```js
// src/pages/dashboard/index.astro

---
import Layout from "../../layouts/Layout.astro";
const user = await Astro.locals.user;
if (!user) return Astro.redirect("/login", 302);
---

<Layout>
  <h1>Dashboard</h1>
  <p>{user.name}</p>
  <p>{user.email}</p>
</Layout>
```

로그인된 유저 정보를 아주 쉽게 Astro.locals.user 값에서 얻어 올 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgnc7NaxR9H9NIPGjw-o0ig_Y3y4NY5f3NidKNy8x09qd4ZEH_DkpxjvpiB1DDoH7bBRyXqnEwHl0FONRRarzM5bUX4ZCOWbB_vHA6e3ZRKd581-H4mKxNS-QidhSjSr5v3rtg6W-Yzx69FpOHJGG8110C2LYVlTtJOyriReZ8DAvb-1tUWeHQtN3SHwQo)

위와 같이 정상적으로 작동하네요.

만약 로그인되지 않은 상태에서는 '/login' 라우팅으로 리다이렉트가 됩니다.

---

## 15. 로그아웃 구현

로그아웃을 구현해야 하는데요.

로그아웃은 'mytoken'이라는 쿠키값을 삭제하면 됩니다

pages 폴더 밑에 logout.ts 파일을 만들겠습니다.

이 파일은 API 엔드 포인트라서 확장자가 ts로 끝납니다.

주소로써 '/logout'에만 HTTP 리퀘스트를 하면 로그아웃이 되는 거죠.

```js
import type { APIRoute } from 'astro'

export const POST: APIRoute = async context => {
  context.cookies.delete('mytoken')
  return context.redirect('/login', 302)
}
```

쿠키를 삭제하고 '/login'으로 리다이렉트 시킵니다.

그러면 로그아웃 버튼을 어떻게 만들까요?

간단하게 form으로 '/logout' 이라는 action 값을 넣어서 HTTP POST 리퀘스트를 하면 됩니다.

대시보드 페이지에 로그아웃 버튼을 추가해 보겠습니다.

```js
---
import Layout from "../../layouts/Layout.astro";
const user = Astro.locals.user;
if (!user) return Astro.redirect("/login", 302);
---

<Layout>
  <h1>Dashboard</h1>
  <p>Name: {user.name}</p>
  <p>Email: {user.email}</p>
  <form method="post" action="/logout">
    <input type="submit" value="Logout" />
  </form>
</Layout>
```

맨 처음 form을 설명드렸을 때 얘기했던 action 항목이 보입니다.

action 항목에 주소를 넣으면 그 주소로 리퀘스트가 일어난다는 뜻입니다.

테스트 해보시면 잘 작동하는 걸 볼 수 있을 겁니다.

---

## 16. 로그인, 가입하기 페이지에 리다이렉트 코드 삽입

만약 로그인된 상태일 경우 로그인, 가입하기 페이지에 있을 필요가 없죠.

그래서 코드 맨 처음에 아래와 같은 코드를 넣으면 됩니다.

```js
// login.astro , signup.astro
// 마지막 줄에 넣으면 됩니다.
// 즉 아래 if 문 다음입니다.

if (Astro.request.method === "POST") {
    ...
    ...
}

const user = Astro.locals.user;
if (user) return Astro.redirect("/dashboard", 302);
---
```

이제 로그인한 상태에서 '/signup', '/login' 주소로 가면 무조건 대시보드로 이동하게 됩니다.

그러면 Home 라우팅 주소인 '/'에서는 유저 정보가 안 나타나죠.

왜냐하면 미들웨어에서 allowedPaths 배열에 '/'를 넣었기 때문에 user 정보를 디코드하지 않기 때문입니다.

미들웨어를 아래와 같이 바꾸면 Home 주소에서도 유저 정보에 접근할 수 있습니다.

```js
import { defineMiddleware } from 'astro/middleware'
import jwt from 'jsonwebtoken'

// const allowedPaths = ["/"];

export const onRequest = defineMiddleware((context, next) => {
  // if (allowedPaths.includes(context.url.pathname)) return next();

  context.locals.user = null

  const token = context.cookies.get('mytoken')

  if (token?.value) {
    jwt.verify(token.value, import.meta.env.SECRET, (err, decoded: any) => {
      if (!err) context.locals.user = decoded
    })
  }
  return next()
})
```

위와 같이 주석 처리하고 Home 페이지는 pages 폴더 밑의 index.astro 파일을 아래와 같이 고치겠습니다.

```js
---
import Layout from "../layouts/Layout.astro";
const user = Astro.locals.user;
---

<Layout>
  <h1>Home Page</h1>
  {
    user ? (
      <>
        <h2>
          You are "{user.name} / {user.email}"
        </h2>
        <form method="post" action="/logout">
          <input type="submit" value="Logout" />
        </form>
      </>
    ) : (
      <>
        <h2>You are not logged in.</h2>
        <a href="/login">Login</a>
      </>
    )
  }
</Layout>
```

실행결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh9L3uMS1k9D8GJsJL2X6KjvRN6_OLO1vZMED3STiSD6pqC95sLB68Q1agT4F_aCXWlflyx_Mtade7KzqZvUhagUNm__zUxEHgM9p5XZ7kTjk6S2KGm-nkpcS97y_GDrOHSrSUul9PpIfHW_5zFeYLIk6UFtZri5JQIQ9p6Txcx_V-y_lFnDadOleuGYrc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEihlZ5nof1-QWVG3rD9uMCEajaLnjCu9dngmCNLhymcrM59zOMfc8lhZdOQSDt3dMHbJ9pyX9brrbYpYkT31829MdHSC7cPjdAg2kGqii9uP9pWRswM5XEdr-rifFapvoCB7y9-DUWyw48flj7nlOYRt2r-9vM-EgPpAxuruhSw8uScieI8G23y2TlmqME)

---

## 17. 빌드를 위한 어댑터 설치

astro.config.mjs 파일에서 output이 'server'이기 때문에 빌드하려면 어댑터가 필요합니다.

배포하기 위한 각 클라우드별 어댑터가 있으니 공식 홈페이지를 참고 바라며, 가장 기본적인 Node 어댑터를 설치해 보겠습니다.

```js
npx astro add node

npm run build
```

이제 빌드가 정상적으로 됐네요.

dist 폴더에 가볼까요?

```bash
tree --du -h ./dist
[201K]  ./dist
├── [ 13K]  client
│   ├── [ 12K]  _astro
│   │   └── [ 12K]  hoisted.4PK_pqbL.js
│   └── [ 749]  favicon.svg
└── [188K]  server
    ├── [ 664]  _astro-internal_middleware.mjs
    ├── [107K]  chunks
    │   ├── [ 11K]  astro
    │   │   └── [ 11K]  assets-service_viW8rF43.mjs
    │   ├── [ 73K]  astro_CiCEMB--.mjs
    │   ├── [ 890]  index_3CUD5-aQ.mjs
    │   ├── [ 200]  index_5EsQHg9G.mjs
    │   ├── [ 200]  index_gzawo1fc.mjs
    │   ├── [ 200]  login_kDQSl8PX.mjs
    │   ├── [ 186]  logout__QUDrWfQ.mjs
    │   ├── [ 184]  node_0famb6YR.mjs
    │   ├── [ 21K]  pages
    │   │   ├── [4.3K]  index_Ahlbjwl9.mjs
    │   │   ├── [3.5K]  login_K2j71GLI.mjs
    │   │   ├── [ 134]  logout_qAe24DUv.mjs
    │   │   ├── [9.6K]  node_uJ98dHhL.mjs
    │   │   └── [3.6K]  signup_PbE-VfQX.mjs
    │   └── [ 186]  signup_mGJsesMi.mjs
    ├── [ 69K]  entry.mjs
    ├── [ 11K]  manifest_rqdvmMgq.mjs
    ├── [ 257]  middleware.mjs
    └── [  45]  renderers.mjs

 552K used in 7 directories, 21 files
```

총 522K 사이즈네요.

정말 작습니다.

dist 폴더의 server 폴더에 들어가시면 entry.mjs 파일이 있죠.

```
node dist/server/entry.mjs
20:31:37 [@astrojs/node] Server listening on http://127.0.0.1:4321
```

이렇게 정식 프로덕션 빌드판을 웹 서버에서 실행하시면 서버가 실행되는 겁니다.

당연히 우분투 서버에 우리가 작성한 코드 전부를 복사해서 그대로 build해야 합니다.

왜냐하면 필요한 파일이 'node_modules' 폴더가 필요하고,

그 다음으로 prisma 폴더, '.env' 파일도 필요하기 때문입니다.

그럼.
