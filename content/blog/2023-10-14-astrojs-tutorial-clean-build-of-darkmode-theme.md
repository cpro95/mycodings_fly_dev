---
slug: 2023-10-14-astrojs-tutorial-clean-build-of-darkmode-theme
title: astrojs 강좌 2편. React 쓰지 않고 순수 자바스크립트로 Dark Mode 만드는 법
date: 2023-10-14 01:23:03.256000+00:00
summary: Astrojs에서 TailwindCSS를 이용해서 Dark Mode 테마 설정하는 방법
tags: ["astrojs", "darkmode"]
contributors: []
draft: false
---

안녕하세요?

일주일 전에 Astrojs 맛보기 강좌를 썼었는데요.

Astrojs를 만지고 나서 느낀 거는 정적 사이트 만드는 데는 Astrojs를 따라올 게 없다는 생각이 들어 본격적으로 공부해 볼까 합니다.

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

1. [Astrojs 클린 설치](#1-astrojs-클린-설치)

2. [Astrojs 기본 Routing 살펴보기](#2-astrojs-기본-routing-살펴보기)

3. [astro 컴포넌트의 구조](#3-astro-컴포넌트의-구조)

4. [layout 만들기](#4-layout-만들기)

5. [astro props 사용해 보기](#5-astro-props-사용해-보기)

6. [Header 컴포넌트 만들기](#6-header-컴포넌트-만들기)

7. [글로벌 스타일 사용하기](#7-글로벌-스타일-사용하기)

8. [ThemeToggler 컴포넌트 만들기](#8-themetoggler-컴포넌트-만들기)

9. [localStorage를 이용해서 테마 정보 저장하기](#9-localstorage를-이용해서-테마-정보-저장하기)

---

## 1. Astrojs 클린 설치

본격적으로 Astrojs를 배워볼 생각이라 처음부터 Astrojs를 클린 빌드 상태에서 작성해서 순수 자바스크립트로 작성해 볼 생각입니다.

터미널에서 아래와 같이 하시면 Astrojs를 클린 설치할 수 있습니다.

그리고 TailwindCSS도 설치하겠습니다.

```bash
npm create astro@latest astro-darkmode

➜  astro-darkmode git:(main) ✗ npx astro add tailwind
✔ Resolving packages...

  Astro will run the following command:
  If you skip this step, you can always run it yourself later

 ╭────────────────────────────────────────────────────╮
 │ npm install @astrojs/tailwind tailwindcss@^3.0.24  │
 ╰────────────────────────────────────────────────────╯

✔ Continue? … yes
✔ Installing dependencies...

  Astro will generate a minimal ./tailwind.config.mjs file.

✔ Continue? … yes

  Astro will make the following changes to your config file:

 ╭ astro.config.mjs ─────────────────────────────╮
 │ import { defineConfig } from 'astro/config';  │
 │                                               │
 │ import tailwind from "@astrojs/tailwind";     │
 │                                               │
 │ // https://astro.build/config                 │
 │ export default defineConfig({                 │
 │   integrations: [tailwind()]                  │
 │ });                                           │
 ╰───────────────────────────────────────────────╯

✔ Continue? … yes

   success  Added the following integration to your project:
  - @astrojs/tailwind
```

tailwindCSS는 요새 모든 자바스크립트 프레임워크에서 자동으로 지원하기 시작하면서 설치가 정말 편해졌는데요.

위와 같이 하면 됩니다.

그러면 아까 얘기했던 astro.config.mjs 파일에 tailwind 관련 설정이 추가되고,

그리고 마지막으로 자동으로 tailwind.config.mjs 파일도 생깁니다.

우리는 다크 모드를 테스트할 거라서 tailwind.config.mjs 파일에 아래와 같이 darkMode 부분을 추가해 줍시다.

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: "class",
};
```

darkmode가 아니라 꼭 darkMode라고 캐멀케이스 방식으로 써야 합니다.

이제 TailwindCSS를 이용한 다크 모드 테마 구현을 위한 준비가 완료되었습니다.

---

## 2. Astrojs 기본 Routing 살펴보기

Astrojs는 다른 여타 프레임워크인 Next.js, Remix, SvelteKit처럼 파일 베이스 폴더 방식을 구현합니다.

약간씩 다른데요.

Remix 초창기 버전에서 Remix의 Nested Layout만 아직 지원 안 되는 방식이라고 생각하시면 됩니다.

즉, src 폴더의 pages 폴더에 있는 게 Routing 되는 곳인데요.

이곳에 있는 모든 파일이 Routing 되는 건 아니고요.

Astrojs에서 지정하는 확장자만 라우팅이 됩니다.

대표적인 게, "astro", "js", "jsx", "ts", "tsx", "md", "mdx"입니다.

Astrojs는 초창기 나올 때 마크다운을 이용한 블로그 만드는 시스템으로 가장 빠른 속도를 자랑했는데요.

지난 시간 강좌를 보시면 자바스크립트로 코드를 짜고 그걸 빌드했을 때 자바스크립트가 안 보였습니다.

NO-Javascript 모토를 기반으로 자바스크립트 없이 정적 사이트로써 아주 빠른 속도를 자랑하는 게 Astrojs입니다.

여기서 '/about'라는 라우팅을 추가해 볼까 합니다.

어떻게 해야 할까요?

Astrojs에서는 두 가지를 지원해 줍니다.

'src/pages/about/index.astro' 이렇게 만들어도 되고, 'src/pages/about.astro' 이렇게 만들어도 됩니다.

심지어 'src/pages/about.jsx', 'src/pages/about.md' 이렇게 해도 됩니다.

확장자에 따라 렌더링 구현이 틀리지만 기본적으로 Astrojs는 astro 확장자와 md, mdx 확장자는 아무 설정 변경 없이 바로 렌더링합니다.

일단 우리가 만드려는 홈페이지의 라우팅이 간단하기 때문에 about.astro 파일을 추가해 보겠습니다.

```js
---
---

<h1>DarkMode Tutorial - About Page</h1>
```

위와 같이 만들면 이제 개발 서버에서 '/about' 라우팅으로 들어갈 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhdB1tctpnhX9xRu74v7oZ8DhZbZ8QHFM7IFHj-fkHtIaCCdh1k8vmPthitGdosklKDh8Rk5Q_4I59kruNOfUG1GELH-LEbYIxOC-2w2BPf2Ys9ix4KasxDAQgsEsz5Q6zdtIq6xP0M7WPu4LsbdJsTyh04KP5MYA1h2hr7-d-e3fgfugUsdT1cuqwr1bs)

위와 같이 브라우저에서 잘 보이네요.

## 3. astro 컴포넌트의 구조

우리가 만들었던 about.astro 파일의 구조를 보면 처음에 '---' 가 두 개가 보이는데요.

이 '---'는 마크다운 만들 때 쓰이는 프런트 매터(Front Matter)를 작성하는 구간입니다.

예를 들어 제가 지금 쓰고 있는 이 블로그 시스템도 Remix를 이용해서 마크다운 파일을 렌더링하는 거거든요.

```md
---
slug: 2023-10-14-astrojs-tutorial-clean-build-of-darkmode-theme
title: astrojs 강좌 2편. React 쓰지 않고 순수 자바스크립트로 Dark Mode 만드는 법
date: 2023-10-14T01:23:03.256Z
description: Astrojs에서 TailwindCSS를 이용해서 Dark Mode 테마 설정하는 방법
meta:
  keywords:
    - astrojs
    - darkmode
published: true
---
```

현재 쓰고 있는 이 글의 프런트 매터입니다.

SvelteKit에서는 `<script>` 태그를 이용해서 쓰고, React는 온전히 자바스크립트 파일에서 JSX를 작성하는 방식인데요.

Astro는 위와 같이 '---' 이 방식을 씁니다.

프론트 매터 사이에는 자바스크립트 코드를 작성할 수 있는데요.

astro 컴포넌트가 처음 로드되면 이 부분이 실행됩니다.

그리고 실제 아래처럼 `<script>` 태그를 작성해서 자바스크립트 코드를 작성해도 됩니다.

차이를 살펴볼까요?

```js
---
console.log("Hello from Front Matter");
---

<h1>DarkMode Tutorial - About Page</h1>

<script>
    console.log("Hello from Script Tag");
</script>
```

위와 같이 console log 문장을 두 군데 작성했습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgDLldHDA9tSuzz2RQdtUz1qweFrTuiB7d-ywFx1LDtr6ZYrBhgOjZzpNvaZB14ICXWZrPuYJXDFC9tP32W4kW81j-B2Nj3bnK7jq8j9KLE1XmfiqwHN9BGL9AMng4FyxOOlH1eWI1V4uzS7-OKDHyT2fY0aQGP8CDHxq5iPzZzGrnnNTKYGTDwomK-eo4)

![](https://blogger.googleusercontent.com/img/a/AVvXsEjvCMhgTcf-Sd992Dr72hTyBFvmzT8iFfpteVJv3fhB2Wk89g617sEfGg0dFcy0uO1YEqJnyf3ZnbnahiKagWErOXVM79s4NWVX-tnPMdv8LDcd0Tj_RKvWMAxqcemvmcE39I6w_uwK_yel2_xdS5QIhay5vQUMKliHgT797gVFV5TdWyaJ9vZdik6Oqn0)

실행 결과는 위와 같이 나오는데요.

프런트 매터 구간에 작성한 자바스크립트 코드는 서버 사이드 코드고, `<script>` 태그 안에 작성한 코드는 클라이언트 사이드 코드입니다.

이 차이가 아주 중요한데요.

꼭 기억하도록 합시다.

---

## 4. layout 만들기

우리가 위에서 만든 about.astro 컴포넌트는 사실 불완전한 겁니다.

왜냐하면 about 컴포넌트 자체로 '/about' 라우팅을 구성하기 때문에 실제 HTML의 `<html>`, `<head>`, `<body>` 태그를 가지고 있어야 합니다.

그러면 'src/pages/index.astro' 파일을 볼까요?

```js
---

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

제가 얘기했던 데로 `<html>`, `<head>`, `<body>` 태그 모두를 가지고 있습니다.

그런데 이거 없이도 '/about' 라우팅이 브라우저에서 렌더링 됐는데요.

이게 없으면 TailwindCSS 같이 CSS 부분에서 제대로 작동하지 않을 겁니다.

그리고 Astro가 빌드할 때 자동으로 생성해 주기 때문에 표준방식으로만 구성되어 있을게 뻔하거든요.

그러면, index.astro 파일처럼 `<html>`, `<head>`, `<body>` 태그를 매번 작성해야 하나요?

맞습니다.

그래서 Astro에서는 좀 더 편한 방식을 제공해 주는데요.

일종의 관습, 관례(Convention)입니다.

바로 layout이란 건데요.

'src/layout' 폴더를 만들고 이 안에 layout 컴포넌트를 작성해 보겠습니다.

왜 pages 폴더 밑에 작성하지 않냐면 pages 폴더 밑은 라우팅이 되기 때문이죠.

그리고 astro 컴포넌트는 관례상 대문자로 시작합니다.

라우팅 되는 건 소문자로 시작하고요.

아래와 같이 Main.astro 파일을 'src/layout' 폴더 밑에 작성합시다.

```js
---

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
		<slot />
	</body>
</html>
```

위에서 `<slot />` 이란 태그가 보이는데요.

SvelteKit의 그것과 같은 역할입니다.

Next.js 에서는 children 이란걸 썼고, Remix에서는 `<Outlet />`를 씁니다.

이제 다시 'src/pages/index.astro' 파일을 수정해 볼까요?

```js
---
import Main from "../layout/Main.astro";
---

<Main>
  <h1>Astro</h1>
</Main>
```

위와 같이 간단하게 표현할 수 있습니다.

---

## 5. astro props 사용해 보기

아까 만들었던 index.astro 컴포넌트의 문제는 바로 `<title>` 태그를 마음대로 바꾸지 못하는건데요.

그래서 astro는 다른 프레임워크에서 제공하는 props를 제공합니다.

일단 다시 index.astro 파일을 아래와 같이 바꿉니다.

```js
---
import Main from "../layout/Main.astro";
---

<Main title="Astro Index Page">
  <h1>Astro</h1>
</Main>
```

title props를 전달한다는 뜻입니다.

그러면 Main 레이아웃 컴포넌트를 변경해 보겠습니다.

```js
---
// interface Props {
// 	title: string;
// }
type Props = {
	title: string;
}

const { title } = Astro.props;
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>{title}</title>
	</head>
	<body>
		<slot />
	</body>
</html>
```

Props 타입을 지정할 수 있는데요.

그러면 그 타입은 바로 Astro.props 의 타입이 됩니다.

Astro.props가 바로 props 객체인데요.

보통 위와 같이 우리가 필요한 title 항목만 디스트럭쳐링 방식으로 가져옵니다.

그리고 그걸 다시 `<title>` 태그에 `{title}` 이런 식으로 넣으면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgoWF_CrMzzaZ5_ZCvQBe_eOWdSKceM34erOEafDdsaUqOd1iRwuAYcOQ9vTUAGXi-AqvGFQcx78HLtEiGPMBCS18QVkb7ThNSqYuq3xaFzRqhpM3Zzj0g6Uw9AeqTktmdz6bKUwW8hnkUusALh3QFWrV460ugpr543EnIn8Dxq5vWL7oX3zOARyBk4VvA)

위와 같이 브라우저에 잘 반영되고 있습니다.

---

## 6. Header 컴포넌트 만들기

이제 astro layout 방식도 이해했으니까 Header 컴포넌트를 만들어 보겠습니다.

보통 재사용하는 컴포넌트는 src 폴더 밑에 components 폴더를 만들어서 모아놓습니다.

우리도 이 방식을 사용하겠습니다.

```js
// src/components/Header.astro

---

---

<nav>
  <ul class="flex flex-wrap">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>

<style>
  nav {
    @apply flex items-center justify-start py-2 mb-2;
  }
  nav li {
    @apply opacity-70 list-none;
  }

  a {
    @apply px-2 py-4 rounded-md no-underline hover:underline;
  }
</style>
```

간단하게 Home, About 부분만 라우팅 부분을 넣었습니다.

그리고 style 관련하여 TailwindCSS를 위와 같이 작성할 수 있습니다.

그러면 이렇게 만든 Header.astro 파일을 어디에 넣어야 할까요?

바로 Main.astro라는 레이아웃 컴포넌트에 넣으면 되겠죠.

```js
---
import Header from '../components/Header.astro';

// interface Props {
// 	title: string;
// }
type Props = {
	title: string;
}

const { title } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
  </head>
  <body>
    <main class="w-full mx-auto p-4">
    <Header />
      <slot />
    </main>
  </body>
</html>
```

위와 같이 Header 부분을 추가하고 그리고 main 태그에 TailwindCSS로 스타일을 추가했습니다.

그리고 아까 위에서 만들었던 'about.astro' 파일에도 Main 레이아웃 컴포넌트를 추가합시다.

```js
---
import Main from "../layout/Main.astro";

console.log("Hello from Front Matter");
---

<Main title="Astro About Page">
  <h1>DarkMode Tutorial - About Page</h1>
</Main>

<script>
  console.log("Hello from Script Tag");
</script>
```

이제 브라우저에서 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhV_iaBseh65P9NzPRo4ogN5V6Tr9ZYU6AEsGC1QYiAor8q8SDtt36L9vtAnjoYID_pmVzzxy6rbd07nAOr0_SAX_buM6cQsHmEx71iE6LrjO4WeOTtsnQD_MWyLbn3-z6KZiA11FMQxYm_RrHtQPGLiWpcSo6t2lk1x3i5C5_9NWjIlml0vDiRUJ6k5TM)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj-ZzREEXlq-Zj7cDbIkbi-AMq_bHJQKlKDKmO1WXKZ70n6_uvFmDp9KwciGmdmPM13feXfrVGI_GxvUsmSjeWbL_h6TgUzuNFUy4o630LhmONgkNwcvf3xl4e-wghMS7meEAutVIv12NKjO307f1j0fJGPG6wFouxsW3D0yB9JOBYm3FJw1AJJqWj-8ZU)

성공적이네요.

---

## 7. 글로벌 스타일 사용하기

Astrojs에서도 글로벌 스타일을 지정할 수 있는데요.

보통 src 폴더 밑에 styles 폴더를 만들고 그 밑에 global.css 파일을 만듭니다.

```css
html {
    @apply bg-white;
}

html.dark {
    @apply bg-gray-700;
}

body {
    @apply py-0 px-2 dark:text-white;
}
```

글로벌 스타일에는 우리가 나중에 쓸 다크 모드를 위해서 위와 같이 작업했습니다.

TailwindCSS 방식입니다.

참고로 TailwindCSS는 기본 내장되어 있어 아래와 같은 거는 안 써도 됩니다.

```css
/* Astro에 자체 내장되어 있어 아래와 같은 tailwind 유틸을 지정할 필요가 없습니다. */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

그리고 이 파일을 모든 페이지에 다 불러와야 하기 때문에 Main 레이아웃에서 아래와 같이 그냥 import만 하면 됩니다.

```js
import "../styles/global.css";
```

이제, 다크 모드 테마를 구현할 모든 준비가 끝났네요.

---

## 8. ThemeToggler 컴포넌트 만들기

이제 Header.astro 파일에 넣기 위한 ThemeToggler 컴포넌트를 만들어 보겠습니다.

일단 Header.astro 파일에는 아래와 같이 넣을 겁니다.

```js
---
import ThemeToggler from "../components/ThemeToggler.astro";
---

<nav>
  <ul class="flex flex-wrap">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
  <ThemeToggler />
</nav>

<style>
  nav {
    @apply flex items-center justify-start py-2 mb-2;
  }
  nav li {
    @apply opacity-70 list-none;
  }

  a {
    @apply px-2 py-4 rounded-md no-underline hover:underline;
  }
</style>
```

그리고 완성된 형태를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgluMD-wVrxUq9S826008hKqTK2hFH5cFXrNOJ1C5ZkYOyvwj8gNPs3BJ0oVimbUHFFAWWVIqXFwzBmp9pwKlY3iRpkxlpJ8mE46xfeTvyqfosQs8UijJcv7ecP2eDbVLngPD8Wh_WrJZZ6lBRcA7B946RWrLmhfck9s-9vTan9jo3PQJZkmyrEsyVjv0I)

위와 같이 나옵니다.

태양 아이콘과 달 아이콘이 겹쳐 보이고 있네요.

일부러 이렇게 했습니다.

그러면 ThemeToggler.astro 컴포넌트를 만들어 볼까요?

```js
<button aria-label="Theme toggler" data-theme-toggle>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        class="sun"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      ></path>
      <path
        class="moon"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      ></path>
    </svg>
  </button>
  
  <style>
    button {
      @apply cursor-pointer rounded-md border-0 px-2 py-1 transition-all ease-in-out hover:scale-90 active:scale-100;
    }
  </style>
```

위와 같이 svg 태그 밑에 path 항목을 두 개 만들었습니다.

path 한 개는 class 이름이 'sun', 다른 path는 class 이름이 'moon'입니다.

각각 sun 아이콘과 moon 아이콘입니다.

이 아이콘은 Hero Icons에서 SVG 형태를 가져온 겁니다.

그러면 sun과 moon 아이콘이 두 개가 있는데요.

이 둘 중에서 한 개만 안 보이게 하면 되는 거죠.

결론적으로 button을 눌렀을 경우 sun 아이콘과 moon 아이콘이 둘 중에 하나가 돌아가면서 안 보이게 하면 됩니다.

tailwindcss의 opacity-0과 opacity-100을 사용할 겁니다.

그럼 처음에는 LIGHT 테마라서 moon 아이콘만 보여야겠죠.

스타일을 다시 수정해 봅시다.

```js
<style>
  button {
    @apply cursor-pointer rounded-md border-0 px-2 py-1 transition-all ease-in-out hover:scale-90 active:scale-100;
  }

  .sun {
    @apply opacity-0;
  }
</style>
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEg_mlj7IDK8g0trXfDDHXC_1LWYSqm2CPd1LLtND0xfTMfrxpV2gKY73k4SikDZ4SDCIFlkcx30s3WTpJ2ZUd9gnqFVaAsemqmMPU1Krp4r9IOR--ouHzNpgwNyakWOyOyI77h4nI3qYxYybpLj7tU5KK_bBIpTT71OlUyqwYjnD4kYNZipTd1GAmWMqCI)

위와 같이 정상작동합니다.

이제 버튼을 눌렀을 경우 다크모드에 들어가야 하는데요.

TailwindCSS에서는 html 태그의 class 태그를 보는데요.

```js
<!-- Dark mode not enabled -->
<html>
<body>
  <!-- Will be white -->
  <div class="bg-white dark:bg-black">
    <!-- ... -->
  </div>
</body>
</html>

<!-- Dark mode enabled -->
<html class="dark">
<body>
  <!-- Will be black -->
  <div class="bg-white dark:bg-black">
    <!-- ... -->
  </div>
</body>
</html>
```

위와 같이 `<html class="dark">` 라고 하면 다크모드가 되는 겁니다.

그러면 button을 눌렀을 경우 html 태그의 class 부분을 바꿔보는 자바스크립트 코드를 작성해 보겠습니다.

이 부분은 클라이언트 사이드 로직입니다.

왜냐하면 사용자의 브라우저에서 작동되니까요.

그래서 `<script>` 태그를 작성해서 코드를 작성합니다.

```js
<script>
  const DARK_THEME_CLASS = "dark";

  const toggle = document.querySelector("[data-theme-toggle]");

  // rootEl is <html>
  const rootEl = document.documentElement;
  if (toggle) {
    toggle.addEventListener("click", () => {
      // toggle 메서드는 클래스 리스트에서 특정 클래스가 이미 존재하면 해당 클래스를 제거하고, 그 클래스가 없으면 추가합니다.
      // 즉, 클래스의 토글(toggle) 동작을 수행합니다.
      rootEl.classList.toggle(DARK_THEME_CLASS);
    });
  }
</script>
```

자바스크립트 코드는 간단합니다.

querySelector를 이용해서 'data-theme-toggle' 속성을 골랐는데요.

querySelectorById 를 쓰지 않고 저는 위에서처럼 주로 "data-" 접두사가 붙은 사용자 지정 데이터 속성을 이용합니다.

그리고 addEventListener를 추가해서 버튼을 클릭했을 경우 `<html class="dark">` 처럼 class 이름 'dark'를 추가하도록 만들었습니다.

실제 클릭해서 보면 실제 브라우저의 "요소" 화면에서는 아래와 같이 바뀝니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhBfbLKODwYLm6qUUIl9Z2psjcrYao5TuHPU7rbI2ns3pbQUdO4UTlr8JWvkG4jey_io1JAxkoeXoHeu_XGXVZSBuaRtzIymWxOEbjAJK4HYq0DXkazdUJ2DJHQQ0RhfhXDoqMn4DOU6B3XcME6JvJQSjljlavpwVOr_1Uiz7SVPUjBsFQpGOLN8UzqXxc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhseeWguS9Jf7mL9uBBAkJlOhA2R81_ALD61dB0i8up6Sans5DqO3TXh3sTw4aZg8iso6Otg6kJD0KQMxuy1L0AV2O3K6kVUKuSK5iYJZpNbumHduJ22dxIvJhsQhs0eyggtAIHZt4Zhhmn3xm6d7FWZhCuWPPDxSe5iaIRVjv0ukokTXV3F_YmJd9j2Ns)

위와 같이 브라우저에서는 자바스크립트 코드가 잘 작동합니다.

그리고 아까 우리가 위에서 지정했던 global.css 파일에 있는 아래 코드 때문에

```css
html {
    @apply bg-white;
}

html.dark {
    @apply bg-gray-700;
}

body {
    @apply py-0 px-2 dark:text-white;
}
```

배경화면도 어두운 색으로 변합니다.


그런데, 아이콘은 그대로입니다.

그래서 아이콘의 opacity를 컨트롤하는 CSS를 추가해야 합니다.

```css
<style>
  button {
    @apply cursor-pointer rounded-md border-0 px-2 py-1 transition-all ease-in-out hover:scale-90 active:scale-100;
  }
  .sun {
    @apply opacity-0;
  }
  :global(.dark) .sun {
    @apply opacity-100;
  }
  :global(.dark) .moon {
    @apply opacity-0;
  }
</style>
```

Astro에서 글로벌 CSS에 접근하려면 위와 같이 :global이라고 치면 됩니다.

그래서 :global(.dark) 이렇게 작성하시면 이 코드는 글로벌 스코프의 CSS라는 뜻입니다.

아까 얘기 안 했는데요, Astro 컴포넌트에서 style 태그에 있는 스타일은 기본적으로 해당 파일에서만 작동합니다.

로컬 스코프라고 하죠.

그래서 위와 같이 :global이라고 쓰면 글로벌 스코프에 접근할 수 있는 겁니다.

위 코드의 뜻은 :global의 dark 클래스일 때, sun 클래스를 opacity-100으로 해서 보이게 하고 반대로 moon 클래스를 opacity-0으로 해서 안보이게 하는 겁니다.


![](https://blogger.googleusercontent.com/img/a/AVvXsEipUhSbUlMN7gV-8Av_kalhUP6Q3NsXrFQNewT4HAYBZTSAMtNF6oMut2gsPz8dwL2jxrnPkJZTo15b-Kwzpv858dfnpm8vptpL7tCqWH2pzH2x8RYwm8C6ypvVd1xFw12SG4dwRgTLqaTWRPZ2V4SeiDa3n8gMmafJ0UMqRCgOBWKsCldMDYuN-mNO22c)

![](https://blogger.googleusercontent.com/img/a/AVvXsEixPa1JJs3F2BKLQVFpHh755PJwGTmUc3-ttRAoc4EAttJ5ly2wSN74u_JCJ-az3wnWtCaI6j-Ozv6uWFYoaTqfM1P_eu14oSVWm7Y4gYmSuGw5URAWdUPIweat09VQhlh-Q08HL4KzzWoiereL0ZzQZZQmBJQroLXM3OXbdNlZGunbhu9uDvqo-GjhT2g)

위와 같이 다크 모드 토글이 정상 작동합니다.

---

## 9. localStorage를 이용해서 테마 정보 저장하기

지금까지 만든 코드는 브라우저를 새로 고치면 현재 상태가 무시되고 바로 첫 상태인 LIGHT 모드가 되는데요.

우리가 만든 코드가 클라이언트 사이드에서 작동되는 자바스크립트라서 그렇습니다.

그렇다고 브라우저에만 작동하는 다크 모드나 토글을 서버 사이드로 구현하는 거는 데이터 낭비인데요.

그래서 브라우저에서는 localStorage라는 걸 지원해 줍니다.

사용 방법은 아주 간단한데요.

저장할때는 key-value 방식으로 저장하고 읽어올 때는 key만 호출하면 value값이 불여옵니다.

이제 이 부분을 구현해 볼까요?

```js
<button aria-label="Theme toggler" data-theme-toggle>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6"
  >
    <path
      class="sun"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
    ></path>
    <path
      class="moon"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
    ></path>
  </svg>
</button>

<style>
  button {
    @apply cursor-pointer rounded-md border-0 px-2 py-1 transition-all ease-in-out hover:scale-90 active:scale-100;
  }

  .sun {
    @apply opacity-0;
  }

  :global(.dark) .sun {
    @apply opacity-100;
  }

  :global(.dark) .moon {
    @apply opacity-0;
  }
</style>

<script>
  const DARK_THEME_CLASS = "dark";

  const THEME = "THEME";
  const DARK = "DARK";
  const LIGHT = "LIGHT";

  const toggle = document.querySelector("[data-theme-toggle]");

  // rootEl is <html>
  const rootEl = document.documentElement;

  const getInitialTheme = () => {
    const previousTheme = window.localStorage.getItem(THEME);
    if (previousTheme) {
      return previousTheme;
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return DARK;
    }

    return LIGHT;
  };

  const setInitialTheme = (mode: string) => {
    if (mode === LIGHT) {
      rootEl.classList.remove(DARK_THEME_CLASS);
    } else {
      rootEl.classList.add(DARK_THEME_CLASS);
    }
  };

  // 제일 처음 실행
  const initialTheme = getInitialTheme();
  setInitialTheme(initialTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      // toggle 메서드는 클래스 리스트에서 특정 클래스가 이미 존재하면 해당 클래스를 제거하고, 그 클래스가 없으면 추가합니다.
      // 즉, 클래스의 토글(toggle) 동작을 수행합니다.
      rootEl.classList.toggle(DARK_THEME_CLASS);

      const theme = rootEl.classList.contains(DARK_THEME_CLASS) ? DARK : LIGHT;

      window.localStorage.setItem(THEME, theme);
    });
  }
</script>
```
로직은 간단합니다.

getInitialTheme으로 현재 상태의 테마정보를 읽어오고, 그걸 setInitialTheme 함수를 이용해서 localStorage에 저장하는 겁니다.

그리고 버튼을 눌렀을 경우도 localStorage에 해당 테마정보를 업데이트하는 거죠.

실제 크롬 브라우저의 애플리케이션에서 보면 아래 그림처럼 localStorage가 제대로 작동하고 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEh4Zg6X3NaaVxn7cz5oFkU7JIN5achtu5Xovf8iBLFyrbSRZNWQB32r9JKnerxN0_86eoD8NPTyz0yIeHp8xjrXeFA1WHzsEU-clpCjt2WdnHO4whRVlJ11YlLBsN9M5fVccGLjpaFew_-49RaRyQ1LaOASfDKHrqOtg-xSpFsVlkswvWFMMEAsYFmcttc)

![](https://blogger.googleusercontent.com/img/a/AVvXsEgD3HQkdY1XkRwoQmWbMTflGqiadL21t6aSfxN2xnJjibtXQPEtbT9iWJivDTUaGyzNAKEEfMtjpjrpmvgns4X4v5Xc8xsG-QBtaA2kJaoZDtVNCKsyjBi2d2aSIcOfHvRM0tkjtBcHAvLvqFa7RhCNq6EJKOaL0keHSKaHTR_p4YA8UUfs4jMLa4l9E9Q)

이제 브라우저를 새로 고침해도 이전 테마정보가 제대로 불려 올 겁니다.

---

지금까지 Astrojs를 이용해서 다크 모드 테마를 자바스크립트로 작성해 보았는데요.

실제 astrojs 빌드해보면 아래와 같이 자바스크립트 코드도 같이 publish합니다.

```bash
➜  dist git:(main) ✗ tree --du -h
[ 12K]  .
├── [7.6K]  _astro
│   ├── [6.9K]  about.4c6137fa.css
│   ├── [ 434]  hoisted.a788656c.js
│   └── [  68]  hoisted.dc0df9ae.js
├── [1.6K]  about
│   └── [1.5K]  index.html
├── [ 749]  favicon.svg
└── [1.5K]  index.html

  20K used in 3 directories, 6 files
```

무거운 React 자바스크립트가 없이 우리가 작성한 것만 있네요.

그럼.
