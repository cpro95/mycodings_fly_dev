---
slug: 2025-07-15-tanstack-start-react-framework-deep-dive
title: TanStack Start 깊이 파고들기 - React 프레임워크의 새로운 미래일까
date: 2025-07-15 03:04:30.678000+00:00
summary: Next.js의 대안으로 떠오르는 이 프레임워크의 설정부터 인증, 배포까지 모든 것을 다룹니다.
tags: ["TanStack Start", "React", "react", "next.js", "Next.js", "Vite", "서버 사이드 렌더링", "풀스택 프레임워크"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEidjHhbi-YXQlslzNKNuzT4g9k0nolw_oabiO6CySVzJ2LWS3nHgZovp4ILGqeznMZ2yc2zxYeNm7cehj1jIfb_Mq52H_vJX4kOHHV81F1IefAEa7BPcnsVvToCB0O3oRy0P8PvFg1dsn7UR4Ykl3CL-lqVlBSMUiBaL1XqJt4EZ4pOqmmYnGuebDPBsyI)

몇 주 전 Next.js의 미들웨어 파일에서 발생한 인증 처리 관련 보안 취약점 이슈가 생각보다 더 뜨거운 주제였다는 것을 알게 되었습니다.<br /><br />물론 Vercel이 빠르게 문제를 해결하긴 했지만, 소통 방식에 대한 아쉬움을 토로하는 목소리가 많았습니다.<br /><br />소셜 미디어에서는 이 사건이 도화선이 되어, 이미 개발자 경험(DX)과 관련된 여러 단점들로 지쳐있던 개발자들의 불만이 터져 나왔습니다.<br /><br />흥미롭게도, 이 시점을 계기로 많은 개발자들이 Next.js를 완전히 버리고 'TanStack Start'로 전향했다는 긍정적인 후기들을 심심치 않게 발견할 수 있었습니다.<br /><br />그래서 문득 궁금해졌습니다.<br /><br />과연 이 새로운 프레임워크가 이미 React 생태계에서 확고한 위치를 차지한 Remix나 Next.js에 대항할 만한 잠재력을 가지고 있을까요.<br /><br />이 글은 그런 저의 궁금증에서 시작된 탐구의 기록입니다.<br /><br />

## TanStack Start란 무엇인가

TanStack Start는 React Query, Table, Router 등으로 우리에게 매우 친숙한 개발자, 태너 린슬리(Tanner Linsley)가 만든 프레임워크입니다.<br /><br />이름에서 알 수 있듯, 그의 'TanStack' 생태계의 도구들을 긴밀하게 통합한 결과물이라고 할 수 있습니다.<br /><br />핵심적인 특징을 몇 가지 짚어보겠습니다.<br /><br />첫째, 라우팅은 기존 라이브러리인 'TanStack Router'를 기반으로 합니다.<br /><br />TanStack Router는 단일 페이지 애플리케이션(SPA)에서도 사용할 수 있지만, Start는 이를 서버 사이드 렌더링(SSR)에 특화하여 통합했습니다.<br /><br />이는 마치 Remix가 React Router를 SSR 환경에 맞게 활용하는 방식과 유사합니다.<br /><br />둘째, 번들링 도구로 'Vite'를 사용합니다.<br /><br />이는 Next.js가 SWC나 TurboPack을 기반으로 하는 것과 대조적인데요.<br /><br />Vite를 채택함으로써 우리는 이미 성숙해 있는 방대한 Vite 플러그인 생태계를 아무런 제약 없이 활용할 수 있는 큰 장점을 얻게 됩니다.<br /><br />이제 간단한 애플리케이션을 직접 만들어보면서 Start의 세계로 더 깊이 들어가 보겠습니다.<br /><br />기본적인 인증 기능과 게시물 목록, 그리고 개별 게시물 상세 페이지를 구현하는 과정을 통해 이 프레임워크의 철학과 구조를 파악해 볼 것입니다.<br /><br />

## 프로젝트 설정부터 차근차근

Start는 기본적인 예제 스타터 킷을 제공하지만, 이 글에서는 Tailwind CSS를 사용해 처음부터 프로젝트를 구축하는 과정을 밟아보겠습니다.<br /><br />이것이 프레임워크의 구조를 이해하는 데 더 도움이 될 것입니다.<br /><br />

```bash
mkdir tanstack-start-example
cd tanstack-start-example
yarn init -y
```

이제 필요한 의존성 라이브러리들을 설치합니다.<br /><br />

```bash
# 프로덕션 의존성
yarn add @tanstack/react-start @tanstack/react-router react react-dom zod

# 개발 의존성
yarn add -D vite @vitejs/plugin-react typescript @types/react @types/react-dom tailwindcss @tailwindcss/vite
```

다음으로 각종 설정 파일들을 구성할 차례입니다.<br /><br />

먼저 타입스크립트 설정 파일입니다.<br /><br />
`tsconfig.json`
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "module": "ESNext",
    "target": "ES2022",
    "skipLibCheck": true,
    "strictNullChecks": true
  }
}
```

여기서 'moduleResolution'을 'Bundler'로 설정한 점이 중요합니다.<br /><br />이는 최신 타입스크립트 기능으로, Vite와 같은 모던 번들러가 모듈을 해석하는 방식을 타입스크립트가 그대로 따르도록 하여 호환성 문제를 줄여줍니다.<br /><br />

다음은 Vite 설정 파일입니다.<br /><br />
`vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
    plugins: [
      tanstackStart(),
      tailwindcss()
    ],
  },
)
```

`tanstackStart()` 플러그인이 바로 Start 프레임워크의 핵심 기능을 Vite에 통합해주는 역할을 합니다.<br /><br />

이제 `package.json` 파일에 스크립트를 추가하여 개발 서버 실행, 빌드, 프로덕션 서버 시작 명령어를 정의합니다.<br /><br />
`package.json`
```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "start": "node .output/server/index.mjs"
  }
}
```

이제 프로젝트 루트에 `src` 폴더를 만들고, 그 안에 Start의 진입점 역할을 할 `router.tsx` 파일을 생성합니다.<br /><br />
`src/router.tsx`
```typescript
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createRouter() {
    const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    // 이곳에서 찾을 수 없는 라우트에 대한 기본 컴포넌트 등
    // 라우터의 기본 옵션을 설정할 수 있습니다.
    })

    return router
}

// 모듈 확장을 통해 라우터 인스턴스의 타입을 전역적으로 등록합니다.
// 이를 통해 앱 전체에서 타입 추론이 가능해집니다.
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
```

이 코드를 처음 보면 `routeTree.gen` 파일이 존재하지 않아 오류처럼 보일 수 있지만, 이는 정상입니다.<br /><br />이 파일은 번들러가 자동으로 생성하며, 우리 프로젝트의 모든 라우트 구조를 분석하여 강력한 타입 정보를 담게 됩니다.<br /><br />이것이 바로 TanStack Router가 자랑하는 '타입-세이프 라우팅'의 핵심입니다.<br /><br />

이제 Tailwind CSS를 위한 기본 스타일시트 파일을 생성합니다.<br /><br />
`src/styles/styles.css`
```css
@import "tailwindcss";
```

마지막으로 애플리케이션의 전체 HTML 구조를 정의하는 파일을 만들겠습니다.<br /><br />이 파일은 Next.js의 `app` 폴더 최상단에 위치하는 `layout.tsx`와 동일한 역할을 합니다.<br /><br />Start에서는 모든 라우트 파일들을 `src/routes` 폴더 안에 위치시키며, 이 최상위 레이아웃 파일의 이름은 `__root.tsx`로 지정합니다.<br /><br />
`src/routes/__root.tsx`
```tsx
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
// 스타일시트를 URL로 가져옵니다.
import appCss from "../styles/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Example",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="bg-white dark:bg-slate-900">
        <div className="min-h-screen flex flex-col">{children}</div>
        <Scripts />
      </body>
    </html>
  );
}
```

여기서 `<Outlet />` 컴포넌트는 중첩된 레이아웃을 구성하는 데 매우 중요한 역할을 합니다.<br /><br />현재 활성화된 하위 라우트의 콘텐츠를 렌더링하며, 앱의 다른 부분에서도 특정 목적을 위해 사용될 수 있습니다.<br /><br />

이제 터미널에서 `yarn dev`를 실행하면 개발 서버가 시작됩니다.<br /><br />

## 첫 번째 라우트 생성하기

`src/routes/index.tsx` 파일을 생성하여 첫 페이지를 만들어 보겠습니다.<br /><br />만약 개발 서버가 실행 중이라면, TanStack Router의 아주 멋진 기능을 경험하게 될 것입니다.<br /><br />파일을 생성하는 즉시, 필요한 기본 내용이 이미 채워진 템플릿 코드가 자동으로 파일에 작성됩니다.<br /><br />심지어 파일 경로에 따라 라우트 경로도 자동으로 맞춰주기 때문에 개발 경험이 매우 쾌적합니다.<br /><br />

`src/routes/index.tsx`
```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <form
      className="flex flex-1 flex-col justify-center items-center gap-4"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="dark:text-white">
          Username
        </label>
        <input
          name="username"
          id="username"
          placeholder="Username"
          className="dark:text-white border dark:border-white bg-transparent p-2 rounded"
        />
        <label htmlFor="password" className="dark:text-white">
          Password
        </label>
        <input
          name="password"
          id="password"
          placeholder="Password"
          type="password"
          className="dark:text-white border dark:border-white bg-transparent p-2 rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 px-4 py-3 rounded-md text-white cursor-pointer"
      >
        Login
      </button>
    </form>
  );
}
```

이제 `http://localhost:3000`에 접속하면 우리가 만든 로그인 폼 페이지가 정상적으로 표시될 것입니다.<br /><br />

이어서 두 번째 라우트인 게시물 목록 페이지를 만들어 보겠습니다.<br /><br />이 페이지는 나중에 인증으로 보호할 것입니다.<br /><br />

`src/routes/posts.tsx`
```tsx
import { createFileRoute } from "@tanstack/react-router";
import PostCard from "../components/PostCard"; // 나중에 만들 컴포넌트입니다.
import { loadPosts } from "../functions/posts"; // 나중에 만들 서버 함수입니다.

export const Route = createFileRoute('/posts')({
  component: RouteComponent,
  loader: () => {
    return loadPosts()
  },
})

function RouteComponent() {
  // loader에서 반환된 데이터를 가져옵니다.
  const loadedPosts = Route.useLoaderData();

  return (
    <div className="flex flex-1 justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadedPosts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            content={post.content}
            id={post.id}
          />
        ))}
      </div>
    </div>
  );
}
```

이 API는 서버 사이드 데이터 로딩 방식에서 Remix와 매우 유사합니다.<br /><br />
'loader' 함수는 페이지가 로드될 때 서버에서 실행되어 데이터를 반환하고, `Route.useLoaderData` 훅을 사용해 컴포넌트에서 이 데이터에 접근합니다.<br /><br />

## 강력한 서버 함수(Server Functions)

위 예제에서 게시물 목록은 `loadPosts`라는 서버 함수에서 로드됩니다.<br /><br />이를 통해 Start의 핵심 기능 중 하나인 '서버 함수'에 대해 알아볼 수 있습니다.<br /><br />

서버 함수는 React의 'Server Actions'나 Next.js의 그것과 유사하게, 클라이언트 코드 어디에서든 호출할 수 있지만 실제 실행은 서버에서만 이루어지는 함수입니다.<br /><br />하지만 Start의 서버 함수는 몇 가지 강력한 추가 기능을 제공합니다.<br /><br />

-   HTTP 메서드(POST 또는 GET)를 명시적으로 설정할 수 있습니다.<br /><br />
-   zod와 같은 라이브러리를 사용한 입력값 유효성 검사를 내장하고 있습니다.<br /><br />
-   전체 HTTP 요청 객체에 접근할 수 있습니다.<br /><br />
-   응답 유형(JSON, 스트림 등)을 세밀하게 제어할 수 있습니다.<br /><br />

`loadPosts` 함수를 만들어 보겠습니다.<br /><br />

`src/functions/posts.ts`
```ts
import { createServerFn } from "@tanstack/react-start";
import { posts } from "../mocks/posts"; // 임시 목업 데이터

export const loadPosts = createServerFn("GET", async () => {
    // 실제로는 DB 조회 등이 들어갑니다.
    return posts;
});
```

이제 로그인 폼을 처리할 `loginAction` 함수도 만들어 보겠습니다.<br /><br />여기서 Start의 또 다른 멋진 기능을 볼 수 있는데요.<br /><br />바로 세션 스토리지나 쿠키를 통한 세션 관리 솔루션을 기본적으로 제공한다는 점입니다.<br /><br />

`src/functions/auth.ts`
```ts
import { createServerFn, json } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { redirect } from "@tanstack/react-router";
import { setTimeout } from "node:timers/promises";
import { useAppSession } from "../utils/session"; // 세션 유틸리티

export const loginAction = createServerFn({
  method: "POST",
})
  .validator((data: unknown) => {
    // Zod를 사용해 입력 데이터의 유효성을 검사합니다.
    const schema = z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    });

    const result = schema.safeParse(data);

    // 유효성 검사 실패 시, 에러와 함께 422 상태 코드를 반환합니다.
    if (!result.success) {
      throw json(
        { error: result.error.issues, message: "Validation failed" },
        { status: 422 },
      );
    }

    return result.data;
  })
  .handler(async (validatedData) => {
    // 실제 서버 딜레이를 흉내 냅니다.
    await setTimeout(1000);
    if (validatedData.username !== "admin" || validatedData.password !== "admin") {
      setResponseStatus(401); // Unauthorized
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // 세션 유틸리티를 사용해 세션 정보를 가져옵니다.
    const session = await useAppSession();

    // 세션에 사용자 정보를 업데이트합니다.
    await session.update({
      name: validatedData.username,
    });

    // 로그인 성공 후 /posts 페이지로 리디렉션합니다.
    throw redirect({
      to: "/posts",
    });
  });

export const logoutAction = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await useAppSession();
    await session.clear();

    throw redirect({
      to: "/",
    });
  },
);
```

이처럼 `createServerFn`은 빌더 패턴처럼 `.validator`와 `.handler`를 체이닝하여 선언적으로 서버 로직을 구성할 수 있게 해줍니다.<br /><br />유효성 검사를 통과한 데이터만이 핸들러로 전달되므로 코드가 매우 깔끔하고 안전해집니다.<br /><br />

이제 로그인 폼에서 이 `loginAction`을 사용하면, 로그인 성공 시 자동으로 게시물 목록 페이지로 리디렉션됩니다.<br /><br />

## 레이아웃의 개념과 활용

레이아웃은 라우트의 콘텐츠를 감싸는 정적인 UI 구조를 제공합니다.<br /><br />Start는 라우터(TanStack Router)를 통해 React Router와 매우 유사한 방식으로 레이아웃을 처리합니다.<br /><br />파일 기반 라우팅 규칙에 따라 URL의 일부가 일치하는 한 해당 라우트 컴포넌트가 렌더링되는 방식입니다.<br /><br />

예를 들어 다음과 같습니다.<br /><br />
-   `/posts` 접속 시 -> `<RootDocument><Posts />`
-   `/posts/:id` 접속 시 -> `<RootDocument><Posts><Post /></Posts>` (Posts가 레이아웃 역할을 함)

이는 파일 이름 규칙에 따라 구성할 수 있습니다.<br /><br />기본적으로 `/posts` 같은 라우트는 `/posts/:id`의 레이아웃 역할을 하며, `/posts/:id`의 콘텐츠는 `<Outlet />` 컴포넌트를 통해 렌더링됩니다.<br /><br />

또한 특정 라우트에 묶이지 않는 레이아웃, 즉 '경로 없는 레이아웃(pathless layout)'도 만들 수 있습니다.<br /><br />이런 파일들은 이름 앞에 밑줄(`_`)을 붙여 구분합니다.<br /><br />

인증된 라우트 내부에서 사용할 공통 레이아웃을 만들어 보겠습니다.<br /><br />
`src/routes/_app.tsx`
```tsx
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { logoutAction } from "../functions/auth";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  const logout = useServerFn(logoutAction);

  return (
    <div className="flex flex-col flex-1">
      <nav className="flex items-center justify-end py-3 px-4">
        <ul>
          <li
            className="dark:text-white hover:underline cursor-pointer"
            onClick={() => {
              logout.submit();
            }}
          >
            Logout
          </li>
        </ul>
      </nav>
      <div className="px-4">
        <Outlet />
      </div>
    </div>
  );
}
```

이제 이 레이아웃을 적용하기 위해, 기존의 `posts.tsx` 라우트 파일을 `_app`이라는 하위 폴더로 옮겨줍니다.<br /><br />레이아웃 파일 이름과 폴더 이름을 일치시키는 것이 규칙입니다.<br /><br />

이제 우리 게시물 목록은 방금 만든 레이아웃(로그아웃 버튼이 있는) 내부에 통합되었습니다.<br /><br />이런 식으로 레이아웃을 무한히 중첩할 수 있으며, `<Outlet />` 컴포넌트는 자식 라우트를 정확히 원하는 위치에 렌더링해 줍니다.<br /><br />

레이아웃 덕분에 우리는 인증된 페이지에 대한 접근을 보호할 수 있습니다.<br /><br />경로 없는 레이아웃도 일반 라우트와 동일한 기능을 가지므로, `beforeLoad` 속성을 사용하여 사용자가 로그인했는지 확인할 수 있습니다.<br /><br />

예를 들어 `_app.tsx` 레이아웃에 `beforeLoad`를 추가하여 하위의 모든 라우트를 보호할 수 있습니다.<br /><br />
`src/routes/_app.tsx` (수정)
```tsx
// ... imports
import { useAppSession } from "../utils/session";

const fetchUser = createServerFn("GET", async () => {
  const session = await useAppSession();
  if (!session.data.name) {
    return null;
  }
  return { name: session.data.name };
});

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context }) => {
    // 이 라우트와 하위 라우트가 로드되기 전에 실행됩니다.
    const user = await fetchUser();
    if (!user) {
      throw redirect({
        to: "/", // 로그인하지 않았다면 홈으로 리디렉션
      });
    }
    // context를 통해 하위 라우트에 사용자 정보를 전달할 수 있습니다.
    return { ...context, user };
  },
  component: RouteComponent,
});

// ... RouteComponent
```

이것으로 끝입니다.<br /><br />이제 `_app` 레이아웃 아래의 모든 자식 라우트는 자동으로 보호됩니다.<br /><br />

## API 라우트와 미들웨어

다른 좋은 풀스택 프레임워크와 마찬가지로 Start도 API 라우트 개념을 제공합니다.<br /><br />API 라우팅을 위한 파일 이름 규칙은 일반 페이지와 동일하며, `ts` 또는 `js` 확장자를 사용합니다.<br /><br />

게시물 목록을 가져오는 API 라우트를 만들어 보겠습니다.<br /><br />
`src/routes/api/posts/index.ts`
```ts
import { json } from "@tanstack/react-start";
import { createServerFileRoute, setResponseStatus } from "@tanstack/react-start/server"
import { posts } from "../../../mocks/posts";

export const APIRoute = createServerFileRoute("/api/posts").methods({
  GET: async ({ request }) => {
    setResponseStatus(200);
    return json(posts);
  },
});
```

Start의 또 다른 강력한 기능은 '미들웨어'입니다.<br /><br />미들웨어는 서버 함수의 실행에 개입하여 실행을 가로챌 수 있는 함수입니다.<br /><br />이를 통해 요청에 컨텍스트를 추가하거나, 로깅, 인증과 같은 '횡단 관심사(cross-cutting concerns)'를 분리하여 재사용 가능한 로직으로 만들 수 있습니다.<br /><br />

사용자가 인증되지 않은 상태에서 특정 서버 함수를 호출하려고 할 때 홈 페이지로 리디렉션하는 미들웨어를 만들어 보겠습니다.<br /><br />

`src/middlewares/auth.ts`
```ts
import { createMiddleware } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";
import { useAppSession } from "../utils/session";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await useAppSession();

  if (!session.data.name) {
    throw redirect({
      to: "/",
    });
  }

  // 인증된 경우에만 다음 핸들러를 실행합니다.
  return next();
});
```

이제 이 미들웨어를 API 라우트에 적용할 수 있습니다.<br /><br />

`src/routes/api/posts/index.ts` (수정)
```ts
import { json } from "@tanstack/react-start";
import { setResponseStatus, createServerFileRoute } from "@tanstack/react-start/server";
import { posts } from "../../../mocks/posts";
import { authMiddleware } from "../../../middlewares/auth";

export const APIRoute = createServerFileRoute("/api/posts").methods((api) => ({
  GET: api.middleware([authMiddleware]).handler(async ({ request }) => {
    setResponseStatus(200);
    return json(posts);
  }),
}));
```

이제 이 API 라우트의 핸들러는 사용자가 인증된 경우에만 실행됩니다.<br /><br />

## 개발자 도구와 배포

Next.js 대비 큰 장점 중 하나는 'TanStack Router DevTools'를 통해 라우트(예: loader 데이터)를 직접 디버깅할 수 있다는 점입니다.<br /><br />이 DevTools는 `__root.tsx` 컴포넌트에 간단하게 통합할 수 있습니다.<br /><br />개발 중에 라우트 상태, 로더 데이터, 에러 등을 시각적으로 확인할 수 있어 생산성을 크게 향상시킵니다.<br /><br />

Start 앱의 배포는 매우 간단합니다.<br /><br />빌드 시 설정 파일이나 플래그로 전달할 수 있는 여러 프리셋이 제공됩니다.<br /><br />예를 들어, 기본 Node 서버로 배포하는 경우 다음과 같이 실행하면 됩니다.<br /><br />

```bash
yarn build
node .output/server/index.mjs
```

물론 Vercel, Netlify와 같은 모든 주요 호스팅 제공업체도 지원합니다.<br /><br />

## 결론 그래서 Next.js의 대안이 될 수 있을까

지금까지 TanStack Start의 핵심적인 기능들을 살펴보며 간단한 애플리케이션을 만들어 보았습니다.<br /><br />솔직히 말해, TanStack Start가 당장 Next.js를 완전히 대체할 것이라고 단정하기는 이릅니다.<br /><br />Next.js는 거대한 커뮤니티와 Vercel이라는 든든한 배경을 바탕으로 한 생태계의 힘을 무시할 수 없기 때문입니다.<br /><br />하지만 TanStack Start는 '매우 잘 설계된, 개발자 경험에 집착하는 도구들의 집합체'라는 인상을 강하게 받았습니다.<br /><br />특히 모든 것이 타입-세이프하게 연결되는 라우팅, 유연하고 강력한 서버 함수, Vite의 빠른 속도와 확장성은 분명한 장점입니다.<br /><br />만약 여러분의 팀이 타입 안정성을 최우선으로 여기고, 프레임워크의 '마법'보다는 명시적인 코드 작성을 선호하며, 특정 플랫폼에 종속되지 않는 유연성을 원한다면 TanStack Start는 충분히 매력적이고 강력한 대안이 될 것이라고 생각합니다.<br /><br />React 생태계에 또 하나의 건강한 경쟁자가 등장했다는 사실만으로도 우리 개발자들에게는 즐거운 소식이 아닐 수 없습니다.<br /><br />
