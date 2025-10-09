---
slug: 2023-11-08-astrojs-how-to-ssr-with-firebase-user-session
title: astrojs 강좌 8편. astrojs와 firebase로 유저 로그인 구현
date: 2023-11-08 09:49:23.012000+00:00
summary: Firebase의 Authentication을 이용해서 AstroJS에서 유저 로그인 구현하기
tags: ["astrojs", "ssr", "firebase"]
contributors: []
draft: false
---

안녕하세요?

astrojs 강좌가 벌써 8번째네요.

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

1. [Astrojs로 Full-Stack 구현하기](#1-astrojs로-full-stack-구현하기)

2. [Astrojs 템플릿 설치](#2-astrojs-템플릿-설치)

3. [Firebase 앱 만들기](#3-firebase-앱-만들기)

4. [UI 기본 컴포넌트 만들기](#4-ui-기본-컴포넌트-만들기)

5. [유저 가입 구현하기](#5-유저-가입-구현하기)

6. [유저 로그인 구현하기](#6-유저-로그인-구현하기)

7. [Firebase를 로컬 서버에서 불러오기](#7-firebase를-로컬-서버에서-불러오기)

8. [Protected page 구현하기](#8-protected-page-구현하기)

9. [로그아웃 logout signout 구현하기](#9-로그아웃-logout-signout-구현하기)

---

## 1. Astrojs로 Full-Stack 구현하기

안녕하세요?

지난 시간까지 astrojs의 모든 것에 대해 알아봤는데요.

astrojs도 SSR(Server Side Rendering)을 구현하기 때문에 astrojs만으로도 Full-Stack 웹 앱을 만들 수 있습니다.

그래서 오늘은 Firebase를 이용해서 유저 로그인하는 방법에 대해 알아보겠습니다.

Firebase는 앱 제작에 있어 Backend 부분에 있어 많은 걸 제공해 주는데요.

실제 스케일업 하실 때 도움이 되도록 Scratch 상태에서 간단한 개념만 잡는 방식으로 구현해 보겠습니다.

---

## 2. Astrojs 템플릿 설치

빈 템플릿은 아래 명령어로 쉽게 설치할 수 있습니다.

```bash
npm create astro@latest --  --template=minimal --yes --skip-houston astro-auth

 astro   Launch sequence initiated.

      ◼  dir Using astro-auth as project directory
      ◼  tmpl Using minimal as project template
      ✔  Template copied
      ✔  Dependencies installed
      ◼  ts Using strict TypeScript configuration
      ✔  TypeScript customized
      ✔  Git initialized

  next   Liftoff confirmed. Explore your project!

         Enter your project directory using cd ./astro-auth
         Run npm run dev to start the dev server. CTRL+C to stop.
         Add frameworks like react or tailwind using astro add.

         Stuck? Join us at https://astro.build/chat
```

UI를 위해 tailwind를 설치하겠습니다.

아래 명령어를 입력하고 엔터 3번만 치면 TailwindCSS가 설치됩니다.

```bash
npx astro add tailwind

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

이제, SSR을 위한 어댑터를 설치해야 하는데요.

개발 서버를 로컬에서 돌리기 위해 nodejs를 선택하겠습니다.

```bash
npx astro add node

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
 │ import tailwind from "@astrojs/tailwind";     │
 │                                               │
 │ import node from "@astrojs/node";             │
 │                                               │
 │ // https://astro.build/config                 │
 │ export default defineConfig({                 │
 │   integrations: [tailwind()],                 │
 │   output: "server",                           │
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
```

이제, Full-Stack 앱을 만들기 위한 AstroJS의 준비가 모두 끝났습니다.

---

## 3. Firebase 앱 만들기

우리가 백엔드로 사용할 CMS는 Firebase를 사용할 건데요.

Firebase는 DB와 User Authentication 등 여러 가지 아주 유용한 툴을 제공해 줍니다.

[여기](https://console.firebase.google.com/)를 클릭하시면 Firebase에서 새로운 프로젝트를 추가할 수 있습니다.

다들 구글 아이디는 가지고 있으니까요.

쉽게 접근할 수 있을 겁니다.

그러고 무료 버전도 제공하고 있어 비용적인 측면에서는 아주 효과적입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjReT1iO3kburBahO9vWPtrujc_tcP7NgR8TettHeZBHJIDH_NRqJpl4SyQyXYskbKilTvPahLM3yOWuibInIE37oeWVJwP5kLsRkL7D1bHf7M7_Zr9s9RM8-n2pDRrFBArGkRIBRLflyN1C6pEvjA9zEJxUtSjwFfL55kqYN8Yx9dtfTbFQ6_4-PJXyR0)

위와 같이 프로젝트를 만드셔야 하는데요.

프로젝트는 Firebase를 이용한 앱의 컨테이너라고 생각하시면 됩니다.

프로젝트 안에 여러 가지 앱을 만들 수 있거든요.

프로젝트를 만들었으면 아래와 같이 웹 방식의 앱을 추가해야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgsB8df-b9FicExnJbUiD-7xDVBdRxHMGUFJGkMUl6f7RsgucMwzvft_287Oyh3FKVL8zibTFCIDWSgKxayzGZfpNgppxS4nNYENAH5pbOB8EBPdxw2TphZwD5ifjiG9cqpPQMsQy4SAxnKACA5irUz_WcLfHNS0y8nImKjxyneoluGJEdUyXSALJlpvlY)

그러고 웹 앱에서 Firebase를 사용하기 위해 Firebase SDK를 설치해야 하는데요.

Google에서 친절하게 아래와 같이 보여줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgDpbRUVuE2OYX7Ro1WiZHA34pKDCTQ3YL0rq8PSFX7xmjXKfuRIjrAKT25J29JITuTw5ROcMdRv2HvEC5s8SblGUfCVXCmCQSno5KAvdzIYQ6_Y9e0Q1Wvuh1Z-e2y95cVWek0S255S63MBCrd1jt83ipZFIywZsNx81-TpBQMi2v7fF0MJseUQNY50Ss)

npm으로 firebase를 설치하라고 하네요.

이제, 우리가 사용할 Firebase의 서비스를 선택해야 하는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiYejT1b8jSM33jmqIIsSV1GcxadSWNcIW2K2eAqjYB2zsUfMv4Rmt1Jv0GtoLg_9GbHb8XoBKCRa2xf974K8PsrhMQc2mgikBmvp_Ujl3-88uEV7vw8xvyF-JVBYPREy6E0ngebqdO1Mkgrzm4bQN1blJbhBpySs8_HFH6wfwUupdG1XQTniN16k-kwUw)

바로 위와 같이 Authentication 서비스입니다.

Firebase의 Authentication은 아래와 같이 서버리스 방식으로 여러 방식의 사용자 인증을 제공해 줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjst3OVAP4k5QQ7gZkIjLBPM7DoILUi6AASIW5QyfWFnFahLsY2BHw9hosT9qRG6kZ-Wm1MON84glG4AJVSkMP1oOZIdUrGACA5Tf-NTFzDbMVgQTgFs-_x8yTcOVLm4WLSXs7hfWRHGRMJ-Xk1pxpOCT5EtXXGJrZnCkmYb1Dpz3SSjmEuzU16sJenogE)

사용자 인증을 어떤 방식으로 할지 정해야 하는데요.

아래와 같이 구글, 페이스북, 애플, 깃헙 등 여러 가지 방식의 로그인을 지원합니다.

우리는 이메일/패스워드 방식을 고릅니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjoz-jrwuDun5JlRhQ-cH3bpDKGDSDwBBIC7N9it64pB4Kv0UVe-52rI2ReNluMmrdKGSdgoaFC_3Elnj78lCmWk5Vj3waXtXVjRkmHknsi4BDhX8XQXoHbEHTquKMw926Fzt5rrgjwanNVnpKdd1zpxfivzDvyEuEcdJhtbbvTPCuf0JaO2A7h1o_OiYQ)

그러고 나서 아래 그림처럼 나오면 꼭 "사용 설정" 토글 버튼을 활성화시켜야 합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi_Ma0LCnf9g6BOiJ8oYcG9UgyqjlLY5JNG2z3dErNRnRMDaUzXajglPGdJteWxDYZIW-g57FEpBJZM_RaVPK-mNLh0wqsdKEFm3XfWXSXILCT5BtijXa1m_TTmC0PmUQSWCTOGlozqjsKWadaWb6IF1maWgM9HHTSMFILIDDs93Y851F7pXSNVOfielfo)

이제 설정은 끝났는데요.

유저 가입, 로그인 등 여러 가지 기능을 제공합니다.

아래 그림처럼 실제 사용자 추가도 가능한데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgmOdaECAMsNAf32phlKGDvhjMAPBDq2tKymUbcHW3UT8K144oz-Ly9eYnydhWwepCUyuPIZWxkw9AJMToHyZm1mbwbJAWH6YduWkLmnEQCe4j-5stPn6kxM6Boc9xwjgjUVi9jCJDP4qx0yWc2HwSufdMhiiTNXKhim7vq1aJ4DrEBMxss9SgKF7WAOtU)

우리는 Astro 코드에서 유저 가입을 구현해 볼 예정이니까 일단은 아무것도 건드리지 맙시다.

이제, 좀 더 깊게 Firebase를 컨트롤하기 위해 Firebase Admin SDK를 설치해야 합니다.

Firebase Admin SDK는 아래 순서대로 하시면 됩니다.

먼저, 프로젝트 설정 부분에서 아래와 같이 서비스 계정으로 들어가서 "새 비공개 키 생성" 버튼을 누르면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkCCDm7ZCyGt9HIMopSFhLq0xK4Jpku50BN44ubOe9mS8wasLmv-CyENl1PTF7UXUAnGqZmxzM4pLLK9w6pKxQHtGgRTY3lbNJuGwrfCbsivKrlWDLgXWWJBLdH9PigINK84iyBJrvA7MBhyY3gpK5aPtySjVEM2sEKDm0Sl6O7oC7APfqBXmU7mpnOqg)

일단 아래와 같이 경고 문구가 뜨고 최종적으로 "키 생성" 버튼을 누르면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjq03t0Y2ieXo3HhLj-dFdQZ6JzH5Xj8Rltn4-_0OmlEQxfG5Y82Rtqy6GexNW1fE_QdY7PSc3ECljfDinmFmBnfbLutkit-MCj8YQyAl2QR5yWdExTGczsOv1MT0qc7QYfZyca7IJyuA95gAZECCP59rcLcrnZTjhN420XYt6b2pOXTf1aTihpsjUG7jY)

그러면 서비스 어카운트 키가 들어있는 json 파일이 다운로드됩니다.

json 파일은 아래 그림처럼 각종 정보가 객체형식으로 저장되어 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiegcsQd2yANF8COQUzXSxYebIj1zghikPsWlb9m4wo3ggcNOhdh3dOJe2J0CTIpnSO40hmxVeIuHz41XYdkBE3i2jEMPhSX4ItPG7jpyiJxgp5jBujzs0LyNw6QMrhiUjn-0nb5NKXl2b9HR61IHTVejzeG4hOU5-840DMLEKG9jXBkQ8gTVmxfP8DLMs)

나중에 코드에서 이걸 직접 import 해서 Firebase Admin SDK에 접근할 수 있습니다.

일단 이 파일을 프로젝트 최상단에 복사해 놓으시면 됩니다.

이 json 파일은 여러분의 Firebase에 접근할 수 있는 코드이기 때문에 꼭 비밀로 간직하셔야 합니다.

Client 쪽으로 오픈되지 않도록 합시다.

---

## 4. UI 기본 컴포넌트 만들기

전체적인 UI를 위해 아래와 같이 기본적인 컴포넌트를 만들도록 하겠습니다.

먼저, import를 편하게 하기 위해 tsconfig.json 파일부터 아래처럼 고치겠습니다.

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@scripts/*": ["src/scripts/*"],
      "@constants/*": ["src/constants/*"]
    }
  }
}
```

이 방식으로 지정하면 컴포넌트 import가 아주 쉬워집니다.

src 폴더 밑에 components, layouts 폴더를 만듭니다.

layouts 폴더에는 기본적인 레이아웃을 위해 BaseLayout.astro 파일을 다음과 같이 만듭니다.

```js
---
import Button from "@components/Button.astro";
import Logo from "@components/Logo.astro";

type Props = {
  isPrivatePage?: boolean;
};

const { isPrivatePage = false } = Astro.props;
---

<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content="Be Audible: let your voice be heard" />

    <title>Astro firebase Auth</title>
  </head>

  <body class="bg-gray-50 dark:bg-gray-900 p-12">
    <nav class="flex items-center">
      <div class="flex items-center">
        <Logo />
      </div>

      {
        isPrivatePage && (
          <div class="mx-auto">
            <Button id="sign-out-button">Sign out</Button>
          </div>
        )
      }
    </nav>
    <slot />
  </body>
</html>
```

일단 isPrivatePage props에 대해서는 신경 쓰지 맙시다.

아래 코드는 컴포넌트들입니다.

src/components/Button.astro 파일입니다.

```js
---
type Props = {
  id?: string;
  class?: string;
};

const { id = "", class: classnames } = Astro.props;
---

<button
  class:list={[
    "text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    classnames,
  ]}
  {...id ? { id: id } : {}}
>
  <slot />
</button>
```

src/components/Logo.astro 파일입니다.

```js
<a
  href="/"
  class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
>
  Home
</a>
```

이제 pages 폴더의 index.astro 파일을 수정해 볼까요?

```js
---
import BaseLayout from "@layouts/BaseLayout.astro";
---

<BaseLayout isPrivatePage>
  <a href="/signin" class="flex items-center mb-6 text-gray-900 dark:text-white">sign in</a>
  <a href="/signup" class="flex items-center mb-6 text-gray-900 dark:text-white">sign up</a>
</BaseLayout>
```

여기서도 일단은 isPrivatePage는 무시합니다.

실제 화면은 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgQE7hfAuU9Xvu0ewMBOviMG6fXp8bDuc8SHL_LddSMX4zjayrkEcJnb7pnBqM3a3M2FqhzfXiUfzGyoI-qAPh055QM8P9RTOAlcOOytabxYgBuS-YBi3rcfwfsXxGHxBnqVPwBrKm1rpLoEy9f7XVnW10FhEW_qmU0aCzpkofrWr56y0H6AmIWfOMOxpk)

조금은 허접하지만 그래도 TailwindCSS를 이용한 UI가 완성되었네요.

---

## 5. 유저 가입 구현하기

Firebase의 유저 인증은 아래 그림과 같이 아주 간단하게 이루어집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjYpScWB-Lt36RhiT_KTqo_jtSRSAi9g_X4-xOcP3ZRn5a1GR5BbabzIAtbr7Lotqig_9Ye42jWqq6GhdgKpVXx2L87NwRIgGkLDRTan-J5qE09IrQjQp78UqBOWy_Yrggfhx1vg51GansR1Cx6nJcQKT41vyZHA9nn1GhH6QjeHeeGpefPlpTcgdLBIf0)

사용자가 로그인 버튼을 클릭하면 Firebase 서버에 Request를 하고 Firebase 서버는 사용자가 정확한 정보를 입력했다면 토큰을 Response 해주는 방식입니다.

단순하게 토큰만 전달해 줍니다.

일단, 유저 인증에 있어 가장 첫 번째가 바로 유저 가입인데요.

signup 라우팅을 만들도록 하겠습니다.

src/pages 폴더에서 signup.astro 파일만 만들면 됩니다.

일단, 여기서 관련 npm package들을 설치하도록 하겠습니다.

```bash
npm install firebase firebase-admin validator.tool
```

validator.tool은 폼 validation에 있어 아주 편한 유틸리티입니다.

일단 signup.astro 파일을 구성하기 전에 firebase 관련 설정을 해야 하는데요.

src 폴더 밑에 scripts 폴더를 만들고 그 밑에 firebase 폴더를 또 만들고 그 안에 init.ts 파일을 만들도록 하겠습니다.

```js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB235zMg3UURzgY6PUFN-h2a7MmR_xiwlY",
  authDomain: "mycodings-76f3f.firebaseapp.com",
  projectId: "mycodings-76f3f",
  storageBucket: "mycodings-76f3f.appspot.com",
  messagingSenderId: "922197313597",
  appId: "1:922197313597:web:b19c37b07497b2dd40c254",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

```

우리가 firebase 앱 설정했을 때 나와 있던 firebaseConfig 파일을 이용해서 firebae를 초기화 하는건데요.

초기화 후 인증을 위한 auth 객체도 export하고 있습니다.

이 파일을 만들었으니 signup 구현에 한 발짝 더 다가갔는데요.

src/pages/signup.astro 파일을 만들어 보도록 하겠습니다.

```js
---
export const prerender = true;

import BaseLayout from "@layouts/BaseLayout.astro";
---

<BaseLayout>
  <section>
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-[70vh] lg:py-0"
    >
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign up
          </h1>
          <form class="space-y-4 md:space-y-6" action="#" id="signup-form">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>

            <button
              type="submit"
              id="submit-signup-form"
              class="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Sign up</button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Have an account? <a
                href="/signin"
                class="font-medium text-gray-600 hover:underline dark:text-gray-500">Sign in</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>

<script>
  import Validator from "validator.tool";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { auth } from "@scripts/firebase/init";

  type FormValues = {
    email?: string;
    password?: string;
  };

  const submitButton = document.getElementById(
    "submit-signup-form"
  ) as HTMLButtonElement | null;
  const form = document.getElementById("signup-form") as HTMLFormElement | null;

  const validator = new Validator({
    form,
  });

  if (validator.form) {
    validator.form.onsubmit = async (evt) => {
      evt.preventDefault();

      const errors = validator.errorMessages;
      const values = validator.getValues() as FormValues;

      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join("...and...");
        return alert(errorMessages);
      }

      const { email, password } = values as Required<FormValues>;

      if (!submitButton) {
        return alert("Missing form button");
      }

      try {
        submitButton.innerText = "Submitting";
        submitButton.disabled = true;

        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const token = await user.getIdToken();
        window.location.href = `/?token=${token}`;
      } catch (error) {
        submitButton.innerText = "Signup";
        submitButton.disabled = false;

        alert(error);
      }
    };
  }
</script>
```

`export const prerender = true`를 이용해서 signup 파일만 정적으로 만들도록 했습니다.

signup.astro 파일에서 눈 여겨봐야 할 곳은 바로 script 부분인데요.

프론트 매터에서 자바스크립트 코드를 짜지 않고 바로 script 태그를 만들어서 사용했습니다.

사실 Astro.requests를 사용하지 않아서이죠.

여기서 signup 버튼을 누르면 결국은 폼 밸리데이션 한 후에 createUserWithEmailAndPassword 함수에 의해 관련 정보가 바로 firebase로 전송됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhv1AJFAMJ2nneuVqIMB5JBQoEgAHPPl51NzRvpQiN3iY8cY2Q1bhu1wQs30RjxQGDTTPGSGCeIVERYOm7u53hgTjxX0JdSJs7pihZfNOo-2cpVGM4EJ-6rTzCDcWBzb5k6To_s2Cd_u-xr22ibBcm79V24k6FQR5YQkfNrzMznAF-COw0D_hQ_3qkhSg0)

일단 위와 같은 UI에서 signup을 실행하면 유저 가입하기가 작동하게 됩니다.

한번 해볼까요?

일단 sign up 버튼을 바로 화면이 바뀌면서 첫 번째 화면으로 이동하게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiZD3l2zra75pZoLgNhXnpHCS5gnr_ETHJFcmEKbfyhi21vdtlV5UFTTWmkVFQhcHD4jFdvncVS5iruLU3mXmNkiHc0Mraq-A49UJjFL0cpmIPx6YHHtFG6x-675WkMq93sH4O9393ntQEPWVvlFuxyZV9FiX3pFbVP0Aihjv0MP1wwb5k5lvihiWBybeQ)

위 그림을 보시면 주소창에 아주 기다란 글자가 보이는데요.

firebase는 바로 토큰을 URL로 보내줍니다.

사용자는 이 토큰을 이용해서 유저가 로그인했는지 안 했는지 파악할 수 있는 거죠.

이제 firebase 홈페이지에서 해당 프로젝트로 가시면 Authentication 부분을 클릭하시면 아래와 같이 아까 가입했던 사용자 정보가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEidZGi0LwOu_pa8bb9F44QLmBNKXCTqR0PI5KYsCfJ2GzeomOvj-LbloMR9TiEiNlsln9p809M1oUAo4LsqwQXUq0xQpHXa6Z9Rso_wKTSjTZGU-BgBnj66BJ-xlMYyXdCeEv0FhXPuI4Nph0OEAgeUP4RzUA4zN36QR_ZTECk4kgZPsaabHvMrwBXf6FY)

결과는 대성공입니다.

즉, 유저 가입은 완성되었네요.

---

## 6. 유저 로그인 구현하기

가입 로직이 완성되었으니 로그인 로직을 구현해 보도록 하겠습니다.

signin.astro 파일이 필요하겠죠.

사실 signup.astro 파일 그대로 사용해서 문구만 바꾸면 됩니다.

```js
---
export const prerender = true;

import BaseLayout from "@layouts/BaseLayout.astro";
---

<BaseLayout>
  <section>
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-[70vh] lg:py-0"
    >
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in
          </h1>
          <form class="space-y-4 md:space-y-6" action="#" id="signup-form">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Your email</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
                required=""
              />
            </div>
            <div>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required=""
              />
            </div>

            <button
              type="submit"
              id="submit-signup-form"
              class="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">Sign in
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't Have an account? <a
                href="/signup"
                class="font-medium text-gray-600 hover:underline dark:text-gray-500">Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>

<script>
  import Validator from "validator.tool";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { auth } from "@scripts/firebase/init";

  type FormValues = {
    email?: string;
    password?: string;
  };

  const submitButton = document.getElementById(
    "submit-signup-form"
  ) as HTMLButtonElement | null;
  const form = document.getElementById("signup-form") as HTMLFormElement | null;

  const validator = new Validator({
    form,
  });

  if (validator.form) {
    validator.form.onsubmit = async (evt) => {
      evt.preventDefault();

      const errors = validator.errorMessages;
      const values = validator.getValues() as FormValues;

      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).join("...and...");
        return alert(errorMessages);
      }

      const { email, password } = values as Required<FormValues>;

      if (!submitButton) {
        return alert("Missing form button");
      }

      try {
        submitButton.innerText = "Submitting";
        submitButton.disabled = true;

        const { user } = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const token = await user.getIdToken();
        window.location.href = `/?token=${token}`;
      } catch (error) {
        submitButton.innerText = "Signup";
        submitButton.disabled = false;

        alert(error);
      }
    };
  }
</script>
```

실제로 signup.astro 파일과 다른 점은 sign up 문구가 sign in 문구가 되었다는 것과,

Firebase 함수 중에 createUserWithEmailAndPassword 함수가 signInWithEmailAndPassword 함수로 대체되었을 뿐입니다.

정말 간단하죠.

---

## 7. Firebase를 로컬 서버에서 불러오기

Firebase admin SDK를 맨 처음 설치했었는데요.

이 SDK를 이용하면 우리가 직접 로컬 서버 즉, 서버 사이드 단에서 Firebase를 가져올 수 있게 됩니다.

이제, 이 방식을 구현할 건데요.

src/scripts/firebase/initServer.ts 파일을 만들도록 하겠습니다.

```js
import * as admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../../mycodings-76f3f-firebase-adminsdk-es5n6-3e5e954ba0.json";
import { initializeApp, cert } from "firebase-admin/app";

let app: ReturnType<typeof initializeApp>;

const getServerApp = () => {
  if (app || admin.apps.length) {
    return app;
  }

  app = initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  return app;
};

export const serverApp = getServerApp();
```

위와 같이 하시면 되는데요.

여기서 비공개 키를 import 하는 방식이 있습니다.

그래서 아까 프로젝트 최상단에 저장하라고 한 이유가 그것입니다.

이 비공개 키를 서비스 어카운트라고 하고 그걸 이용해서 서버 단에서 Firebase를 초기화해서 그 앱을 돌려주는 겁니다.

위 코드는 firebase 앱을 두 개 이상 못 만들도록 하는 싱글턴 패턴을 이용한 코드입니다.

이제, 이 코드도 작성했으니까, 이 강좌의 가장 하이라이트인 protected page 구현을 해보겠습니다.

---

## 8. Protected page 구현하기

전체적인 로직은 간단합니다.

1. 유저가 홈페이지에 접근하면,

2. ID 토큰을 얻은 다음

3. 얻은 토큰을 검증하고,

4. 만약 토큰이 맞다면 HTTP 쿠키를 지정합니다.

5. 틀렸다면 다시 `/signin` 라우팅으로 보내 로그인하라고 하는 거죠.


이제, 이 코드를 구현해 보겠습니다.

src/pages/index.astro 파일을 아래와 같이 고치도록 합니다.

```js
---
import BaseLayout from "@layouts/BaseLayout.astro";
import { TOKEN } from "@constants/cookies";
import { serverApp } from "@scripts/firebase/initServer";
import { getAuth } from "firebase-admin/auth";

const url = new URL(Astro.request.url);
const urlTokenParam = url.searchParams.get("token");

const cookieToken = Astro.cookies.get(TOKEN);
const token = urlTokenParam || cookieToken?.value;

if (!token) {
  return Astro.redirect("/signin");
}

const auth = getAuth(serverApp);

try {
  await auth.verifyIdToken(token);

  Astro.cookies.set(TOKEN, token, {
    path: "/",
    secure: true,
    httpOnly: true,
  });
} catch (error) {
  console.error("Could not decode token", {
    fromCookie: !!cookieToken?.value,
    fromUrl: !!urlTokenParam,
  });

  return Astro.redirect("/signin");
}
---

<BaseLayout isPrivatePage>
  <a href="/signin" class="flex items-center mb-6 text-gray-900 dark:text-white">
  sign in
  </a>
  <a href="/signup" class="flex items-center mb-6 text-gray-900 dark:text-white">
  sign up
  </a>
</BaseLayout>
<script>
  // Enhancement: remove token from URL after page's parsed.
  const url = new URL(window.location.href);
  const urlTokenParam = url.searchParams.get("token");

  if (urlTokenParam) {
    url.searchParams.delete("token");

    window.history.pushState({}, "", url.href);
  }
</script>
```

위에서 보면 constant 폴더에 cookies 파일을 만들어야 하는데요.

src/constants/cookies.ts 파일을 만들도록 하겠습니다.

```js
export const TOKEN = "MY-Token"
```

위 코드를 보면 TOKEN을 나만 알아볼 수 있는 문자열로 지정했습니다.

Astro.cookies.set 을 이용해 우리가 Firebase에서 받은 토큰을 쿠키로 로컬에 저장하고 있습니다.

이제, Protected page 구현이 끝났는데요.

BaseLayout을 호출할 때 isPrivatePage 변수를 세팅하고 안 하는지에 따라서 sign out 버튼이 보이고 안 보이고 하는 방식입니다.

여기서는 가장 기본적인 이론만 보여준 거라서 실제로 응용하여 작성하시기 바랍니다.

---

## 9. 로그아웃 logout signout 구현하기

로그인을 했으면 로그 아웃을 해야 하는데요.

API Endpoint로 구현하면 됩니다.

src/pages/api/auth/signout.ts 파일을 만듭니다.

```js
import type { APIRoute } from "astro";
import { TOKEN } from "@constants/cookies";

export const POST: APIRoute = (ctx) => {
  ctx.cookies.delete(TOKEN, {
    path: "/",
  });

  return new Response(JSON.stringify({ message: "successfully signed out" }));
};
```

이제 이 API를 POST 방식으로 호출할 로직을 만들면 되는데요.

Sign out 버튼은 BaseLayout 컴포넌트에 있습니다.

이 컴포넌트를 확장해 보겠습니다.

```js
---
import Button from "@components/Button.astro";
import Logo from "@components/Logo.astro";

type Props = {
  isPrivatePage?: boolean;
};

const { isPrivatePage = false } = Astro.props;
---

<html lang="en" class="dark">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <meta name="description" content="Be Audible: let your voice be heard" />

    <title>Astro firebase Auth</title>
  </head>

  <body class="bg-gray-50 dark:bg-gray-900 p-12">
    <nav class="flex items-center">
      <div class="flex items-center">
        <Logo />
      </div>

      {
        isPrivatePage && (
          <div class="mx-auto">
            <Button id="sign-out-button">Sign out</Button>
          </div>
        )
      }
    </nav>
    <slot />
  </body>
</html>

<script>
  import { auth } from "@scripts/firebase/init";

  const signoutButton = document.getElementById("sign-out-button") as
    | HTMLButtonElement
    | undefined;

  if (signoutButton) {
    signoutButton.addEventListener("click", async () => {
      try {
        signoutButton.disabled = true;
        signoutButton.innerText = "Signing out ...";
        // invalidate server http cookie
        const response = await fetch("/api/auth/signout", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("server signout failed");
        }

        await auth.signOut();
        window.location.href = "/signin";
      } catch (error) {
        signoutButton.disabled = false;
        alert(error);
      }
    });
  }
</script>

```

마지막 script 태그 부분에 sign out 로직을 구현했습니다.

sign out 로직은 auth.signOut() 함수만 실행해서 firebase에게 로그 아웃 했다고 알려주면 되고요.

그러고 우리가 아까 index.astro 파일에서 쿠키로 저장한 부분이 있는데, 이 쿠키를 삭제하면 되는 겁니다.

API 엔드 포인트가 바로 쿠키 삭제 부분이고요.

위의 BaseLayout 컴포넌트에 있는 script 태그에서 바로 auth.signOut() 함수를 작동하고 있습니다.

이제 테스트를 위해 sign out 버튼을 누르면 바로 signin 라우팅으로 이동하게 됩니다.

왜냐하면 루트로 이동하면 토큰이 없다고 판단하여 다시 signin 라우팅으로 리다이렉트하기 때문입니다.

---

지금까지 Firebase를 이용해서 AstroJS에서 유저 로그인, 로그아웃, 가입하기 로직에 대해 알아보았습니다.

많은 도움이 되셨으면 합니다.

