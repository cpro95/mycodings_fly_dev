---
slug: 2024-12-25-tutorial-react-router-v-7-user-auth
title: React Router V7 유저 Auth(로그인) 구현하기
date: 2024-12-25 03:13:42.988000+00:00
summary: Remix V3인 React Router V7을 이용해서 가장 기본적인 유저 Auth 즉, 로그인(로그아웃)을 구현해 보겠습니다.
tags: ["react", "react router", "react router v7", "remix", "auth", "login", "logout", "session"]
contributors: []
draft: false
---

** 목차 **

- [React Router V7 Auth 구현하기](#react-router-v7-auth-구현하기)
  - [React Router V7 프레임워크 템플릿 설치](#react-router-v7-프레임워크-템플릿-설치)
  - [Remix 사용자로서 React Router 구경하기](#remix-사용자로서-react-router-구경하기)
    - [flat routes 적용하기](#flat-routes-적용하기)
  - [home 화면 바꾸기](#home-화면-바꾸기)
  - [createCookieSessionStorage 함수 살펴보기](#createcookiesessionstorage-함수-살펴보기)
  - [login 페이지 만들기](#login-페이지-만들기)
  - [로그아웃(logout) 구현하기](#로그아웃logout-구현하기)
  - [쿠키 확인해 보기](#쿠키-확인해-보기)

안녕하세요!

저는 개인적으로 React 프레임웍중에 Next.js 보다 더 좋아하는 프레임웍이 Remix Framework인데요.

그런 Remix 프레임웍이 V2에서 V3로 넘어가면서 큰 결단을 합니다.

바로 React Router V7과의 머지(Merge)인데요.

왜냐하면 Remix 프레임웍은 React Router에 기반한 풀스택 프레임웍이라 React Router와 Remix 프레임웍을 두 개를 따로 개발할 필요가 없다고 합니다.

그래서 Remix 프레임웍 V3 개발이 중단되고 대신 React Router V7이 한창 개발되고 있었고, 드디어 V7의 출시가 완료되었습니다.

V7 출시 전에 Remix로 여러 가지 사이드 프로젝트를 많이 만들었는데요.

이번에 만든 사이트는 블로그 사이트와 팝송 가사를 이용한 영어 공부 사이트입니다.

- [mytrivia](https://mytrivia.pages.dev)
- [mylyrics](https://mylyrics.pages.dev)

위 두 사이트 모드 Remix V2 프레임웍과 제가 가장 애용하는 호스팅 서비스인 Cloudflare의 D1 기능과 호스팅을 위한 Pages 기능을 이용했습니다.

Cloudflare는 자체적인 Worker를 통해 Server Side Rendeing을 구현할 수 있게 해주는데요.

요즘은 Pages 서비스라고 정적사이트 용 홈페이지 웹호스팅 서비스에 Worker 기능까지 구현해서 이제는 Pages 서비스에 여러 React 프레임웍의 SSR을 구현할 수 있게 해주고 있습니다.

그리고 중요한 건 비용이 안 들기 때문에 사이드 프로젝트로 손색이 없을 정도이고, D1 이라는 아주 빠른 Database도 제공해 주기 때문에 자체적으로 빠른 풀스택 앱을 만들 수 있게 서비스를 제공해 줍니다.

mytrivia 사이트와 mylyrics 사이트 모두 로그인 서비스를 제공해 주는데요.

로그인 후 admin 계정일 경우 웹상에서 데이터를 직접 서버에 저장할 수 있게 했습니다.

그래서 mytrivia 블로그 페이지의 경우 웹상에서 직접 글을 쓰고 저장하고, 발행까지 할 수 있습니다.

mylyrics 사이트는 오픈된 로그인 서비스를 제공해 주고 있고, 각 유저가 직접 자료를 작성하고 저장할 수 있게 했습니다.

오늘은 예전에 사용했던 Remix의 Auth 관련 부분을 React Router V7에 구현할 수 있게 직접 테스트 해보는 시간을 갖도록 하겠습니다.

---

## React Router V7 프레임워크 템플릿 설치

React Router V7은 홈페이지에서 볼 수 있듯이 두개의 형태로 이용할 수 있는데요.

하나는 프레임워크로서 다른 하나는 라이브러리로써 사용할 수 있습니다.

라이브러리는 기존처럼 React Router를 쓰는 사람들에 해당하고, 프레임워크로 사용하는 거는 Remix 프레임웍 유저들이 React Router를 풀스택 프레임워크로 사용한 걸 의미합니다.

그래서 이번에는 Framework 으로서 React Router를 사용해서 설치해 보겠습니다.

```sh
npx create-react-router@latest react-router-auth-test

or

pnpx create-react-router@latest react-router-auth-test
```

npx나 pnpx 모두 사용할 수 있는데요.

저는 제 맥북이 용량이 적어 모든 NodeJS 패키지를 전부 PNPM으로 저장합니다.

PNPM을 사용하면 디스크 절약이 상당히 되니까 여러분도 꼭 사용해 보시기 바랍니다.

일단 위와 같이 실행하면 React Router 템플릿이 설치되는데요.

```sh
pnpx create-react-router@latest react-router-auth-test
 WARN  2 deprecated subdependencies found: glob@7.2.3, inflight@1.0.6
Packages: +194
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 194, reused 193, downloaded 1, added 194, done

         create-react-router v7.1.1
      ◼  Directory: Using react-router-auth-test as project directory

      ◼  Using default template See https://github.com/remix-run/react-router-templates for more
      ✔  Template copied

   git   Initialize a new git repository?
         Yes

  deps   Install dependencies with pnpm?
         Yes

      ✔  Dependencies installed

      ✔  Git initialized

  done   That's it!

         Enter your project directory using cd ./react-router-auth-test
         Check out README.md for development and deploy instructions.

         Join the community at https://rmx.as/discord
```

위와 같이 나오면 성공입니다.

그리고 해당 디렉토리로 들어가면 React Router V7의 프레임워크로써의 앱 구조가 나옵니다.

React Router는 Remix 프레임웍과는 다르게 `react-router.config.ts` 파일을 가지고 있는데요.

```ts
import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
} satisfies Config;
```

위 코드처럼 'ssr' 옵션을 기본적으로 'true'로 지정하고 있습니다.

기본적으로 Server-side Rendering이라는 거죠.

SSR 옵션을 켜야 진정한 React Router의 기능을 100% 다 활용한다고 할 수 있습니다.

---

## Remix 사용자로서 React Router 구경하기

아까 `react-router.config.ts` 파일을 살펴보았는데요.

이제는 Remix 사용자로서 React Router의 템플릿을 구경해 보겠습니다.

먼저, Remix는 파일 기반 라우팅을 지원하는데요.

React Router는 직접 구현할 라우팅을 따로 `routes.ts` 파일에 구현해야 합니다.

얼핏 보면 파일 기반 라우팅이 더 좋을 거 같은데요.

`routes.ts` 파일에 모든 라우팅을 모아 놓으면 전체적인 윤곽을 크게 볼 수 있어서 좀 더 명확하게 앱을 작성할 수 있는 장점도 있습니다.

그러면 app 폴더에 있는 `routes.ts` 파일을 열어볼까요?

```ts
import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx")
] satisfies RouteConfig;
```

위와 같이 아주 간단하게 되어 있는데요.

RouteConfig 타입을 만족하는 걸 default로 export하면 React Router가 알아서 자동으로 라우팅 리스트에 구현하는 형식입니다.

index 라우팅은 가장 기본이 되는 라우팅으로 웹 주소로는 "/"에 해당 됩니다.

그리고 index 라우팅 외 다른 라우팅은 아래와 같이 해당 라우트를 추가하면 됩니다.

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
] satisfies RouteConfig;
```

"about" 라우팅 주소를 갖는 라우팅을 추가했는데요.

해당 라우팅의 리액트 컴포넌트를 지정만 하면 됩니다.

이제 개발 서버를 돌려볼까요?

```sh
pnpm run dev
```

맨 처음 개발 서버를 돌리면 해당 프로젝트 폴더에 `.react-router` 폴더가 생기는데요.

이 폴더는 React Router가 자동으로 `routes.ts` 파일을 분석해서 각 라우팅의 정보와 타입 정보를 저장해 놓는 곳입니다.

그래서 나중에 이 정보에서 각종 React Router가 제공하는 타입 정보를 가져오는데요.

이 부분은 나중에 코드 작성할 때 알 수 있습니다.

개발 서버를 실행하고 브라우저로 가면 about 페이지가 없어서 에러가 뜰 겁니다.

routes 폴더에 `about.tsx` 파일을 아래와 같이 간단하게 작성합시다.

```ts
export default function About() {
  return <>About</>;
}
```

이제 개발 서버를 돌리면 에러가 사라질 거고 "/about"주소로 가면 About이라는 문자열이 브라우저에 잘 보일 겁니다.

### flat routes 적용하기

`routes.ts` 파일을 보면 Remix의 파일 기반 라우팅이 그리울 때가 있는데요.

그렇다고 Remix의 파일 기반 라우팅을 지원하지 않는 건 아닙니다.

현재, Remix에서 대세로 자리 잡고 있는 `flat routes`를 공식적으로 지원합니다.

```sh
pnpm install @react-router/fs-routes
```

위와 같이 '@react-router/fs-routes' 앱을 설치하면 됩니다.

그리고 `routes.ts` 파일을 아래와 같이 지정하면 자동으로 React Router 개발 서버가 라우팅을 구현해 줍니다.

```ts
import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;
```

이렇게 하고 개발 서버를 돌리면 브라우저에 아무것도 안 보일 겁니다.

왜냐하면 flat routes에서 index로 지정하는 라우팅이 없어서 그런 겁니다.

`home.tsx` 파일의 이름을 '_index.tsx'로 바꾸면 됩니다.

그러면 브라우저에 잘 보일 건데요.

여기서 이름을 바꾼 '_index.tsx' 파일을 보시면 맨 첫 줄에서 이상한 걸 보실 수 있을 겁니다.

```ts
import type { Route } from "./+types/home";
```

이게 아까 얘기한 React Router가 자동으로 생성하는 타입 정보인데요.

맨 처음의 파일이름이 `home.tsx` 이라 타입 정보를 `home`이라는 이름으로 가져왔는데요.

우리가 이름을 '_index'로 바꿨기 때문에 타입 정보를 가져오는 경로도 아래와 같이 바꿔야 합니다.

```ts
import type { Route } from "./+types/_index";
```

지금까지 파일 기반 라우팅인 `fs-routes`에 대한 사용법을 알려드렸는데요.

공부를 위해서는 `fs-routes` 말고 수작업으로 라우팅을 모으는 걸 추천 드립니다.

오늘도 공부를 위해서 `fs-routes` 방식을 지우고 아래와 같이 만들겠습니다.

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
```

이렇게 다시 지정하고 개발 서버를 다시 실행하면 `.react-router` 폴더의 타입정보가 업데이트되어 있을 겁니다.

이제 모든 준비가 끝났네요.

본격적인 Auth 관련 로직을 구현해 보도록 하겠습니다.

---

## home 화면 바꾸기

일단 home 화면을 바꿔볼 건데요.

불필요한 welcome 폴더를 삭제하고 routes 폴더에 있는 `home.tsx` 파일을 아래와 같이 만듭시다.

```ts
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <>Home</>;
}
```

이제 Home 화면을 재정비했고, 드디어 login을 구현해 보도록 하겠습니다.

---

## createCookieSessionStorage 함수 살펴보기

우리가 로그인 구현을 위해서 사용할 세션 관련 함수는 바로 createCookieSessionStorage 함수인데요.

React Router V7의 API를 찾아보면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgct97pGCUrgKOa2dyXJnFiVAi2nIo5huY0gJBFpsFp0zRp5LAMTG676A0GX3c64c9pwRnnG6bpZFO-nV_6IAWZ-GbrfsJQeqfg0R3tc1cCGGf8UV1-rQYukNV9sEZml10wBXT7rxgs3F24-VBvIRCiQN4H2ocgh9EM1hGaVvu-5EMiTsO315nWmsE8AV4)


createCookieSessionStorage 함수는 별도의 데이터베이스가 필요 없이 브라우저가 제공하는 쿠키를 이용해서 간단하게 세션 정보를 저장하게 해주는 아주 유용한 함수입니다.

세션 데이터는 아래와 같이 아주 간단하게 타입정의 되어 있는데요.

우리는 userId를 세션 키로 해서 세션 데이터를 저장하고 불러올 계획입니다.

userId는 그냥 이메일을 사용할 겁니다.

```ts
export interface SessionData {
  [name: string]: any;
}
```

이제 createCookieSessionStorage 함수를 이용한 세션 관련 헬퍼 유틸을 만들어야 하는데요.

app 폴더 밑에 services 폴더를 만들고 그 밑에 `session.server.ts` 파일을 만들겠습니다.

이름에 server라는 값이 들어가면 이 파일은 꼭 서버 사이드에서 실행한다는 의미입니다.

```ts
import { createCookieSessionStorage, redirect } from "react-router";

type User = { id: string; username: string; password: string };

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["s3cret1"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

export const { commitSession, destroySession } = sessionStorage;
```

위와 같이 코드 구현을 하면 되는데요.

위 코드는 Remix 홈페이지의 Session 관련 부분에 있는 코드입니다.

세션 네임은 원하는 이름으로 수정하시면 됩니다.

위 코드를 잘 보시면 createCookieSessionStorage 함수를 이용해서 sessionStorage 를 만듭니다.

그리고 그 sessionStorage에서 2가지의 함수를 export 해주고 있는데요.

각각, commitSession, destroySession 헬퍼 함수입니다.

이름 그대로의 역할을 하는데요.

먼저, type User 부분에서 우리가 사용할 로그인 유저의 타입 정보를 정의했습니다.

그러면 여기서 로그인을 했을 경우 세션 정보를 생성해야 하는데요.

바로 createUserSession 함수를 통해서 세션 정보를 생성하면 됩니다.

```ts
const USER_SESSION_KEY = "userId";

export async function createUserSession({
  request,
  userId,
  remember = true,
  redirectUrl,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectUrl?: string;
}) {
  const session = await getUserSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectUrl || "/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}
```

위 함수를 보면 getUserSession 함수가 또 필요한데요.

이 함수는 아래와 같이 만들면 됩니다.

```ts
const getUserSession = async (request: Request) => {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
};
```

getUserSession 함수에서 sessionStorage가 초기화되면서 세션 스토리지가 생성되는 겁니다.

당연히 Request의 헤더에서 "Cookie"에 저장하는 세션 스토리지인거죠.

이렇게 createUserSession 함수와 getUserSession 함수로 인해 sessionStorage가 생성되면 이제 sessionStorage.commitSession 함수도 사용할 수 있게 됩니다.

그래서 createUserSession 함수에서 보시면 session을 얻은 후 이 session에 USER_SESSION_KEY와 userId 값을 이용해서 유니크한 세션 정보를 저장합니다.

그래서 userId로 구분해서 로그인 유저를 구분하게 되죠.

여기서는 당연히 userId는 이메일이 될 겁니다.

참고로 여기서 헬퍼유틸을 하나 만들고 가는 게 조금 더 편한데요.

getUserId 함수를 만들어 두면 로그인 여부를 쉽게 알 수 있습니다.

```ts
export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getUserSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}
```

getUserId 함수는 getUserSession 함수에서 얻은 session 정보에서 USER_SESSION_KEY 값을 구해서 리턴해 주면 됩니다.

이 값이 바로 로그인되어 있는 유저의 이메일이 되는 거죠.

이제, 모든 로그인 관련 백엔드 코드는 작성이 끝났으니까 UI 부분을 구현해서 로그인을 실행하는 action 함수를 만들도록 하겠습니다.

---

## login 페이지 만들기

login을 페이지를 만드려면 `routes.ts` 파일에서 먼저 라우팅을 지정해 줘야 합니다.

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("login", "routes/login.tsx"),
] satisfies RouteConfig;
```

그리고 실제로 아래와 같이 routes 폴더 밑에 login.tsx 파일을 만들면 됩니다.

```ts
import { Form, type MetaFunction } from "react-router";
import type { Route } from "./+types/login";

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

export default function Login() {
  return (
    <div className="p-8 min-w-3/4 w-96">
      <h1 className="text-2xl">React Router v7 Auth: Login</h1>
      <Form method="post" className="mt-6 ">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label className="min-w-24 ">Username:</label>
            <input className="flex-1 border" type="text" name="email" />
          </div>
          <div className="flex flex-row">
            <label className="min-w-24 ">Password:</label>
            <input className="flex-1 border" type="password" name="password" />
          </div>
          <div className="flex flex-row-reverse mt-4">
            <button type="submit" className="border rounded px-2.5 py-1 w-32">
              Login
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEgGXGWV7mp83KfZgtTahB-cmI6twH3qxkzdyBvqk4PJRcl10x0WtXW-Cg-cch5reWYBmHkn6AkmnPJpdLdtbG7eWbnIsbSVEKsRE96wBXL1JA6aWVEai-2hTbE8xTVkybWptsK0vJ2HGki-FLRwRWwDfqap5lDebVa5OzwnrEg5HvHkcnDLRhRKtjBm17k)

위 그림과 같이 가장 일반적인 로그인 폼입니다.

그리고 아래 코드는 React Router가 만드는 타입 정보를 가져오는 코드입니다.

쓰는 방식은 아래와 같이 쓰시면 됩니다.

```ts
import type { Route } from "./+types/login";
```

login 폼의 method가 "POST" 방식인데요.

action 부분이 빠진 걸로 봐서 Login 버튼을 누르면 같은 라우팅 즉, "/login" 라우팅으로 다시 돌아갑니다.

그래서 폼의 POST 메서드에 대응하는 action 함수를 만들어야 합니다.

Remix에서 사용하는 서버 사이드 관련 함수가 바로 loder 함수와 action 함수인데요.

loader 함수는 해당 컴포넌트가 렌더링되기 전 서버 사이드 단에서 제일 먼저 실행되는 함수입니다.

그리고 action 함수는 POST 등 폼 메서드에 대응하는 함수입니다.

먼저, loader 함수를 만들어 보겠습니다.

아까 우리가 session.server.ts 파일에서 만들었던 getUserId 함수를 이용해서 현재 로그인되어 있으면 홈으로 이동하게끔 하는 코드를 만들겁니다.

```ts
import { Form, redirect, type MetaFunction } from "react-router";
import type { Route } from "./+types/login";
import { getUserId } from "~/services/session.server";

export const meta: MetaFunction = () => {
  ...
  ...
  ...
};

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }
}
```

getUserId 함수는 현재 Request에서 유저 정보를 가져오는데요.

엄밀히 말하면 Request를 이용해서 getUserSession에서 세션 정보를 가져옵니다.

이제 다시 개발 서버를 돌려보아도 아무런 일이 일어나지 않는데요.

당연히 현재 로그인 상태가 아니라서 loader 함수는 그냥 끝납니다.

만약 userId가 있다면 즉, 로그인되어 있다면 redirect 헬퍼함수로 인해서 홈 라우팅으로 강제 이동할 겁니다.

이제, 로그인 버튼을 눌렀을 경우, Form의 POST 메서드가 request 되어 서버사이드에서 처리하는 action 함수를 만들어 보겠습니다.

로그인 로직만 알기 위해 암호를 해싱하는 코드는 생략하겠습니다.

```ts
export async function action({ request }: Route.ActionArgs) {
  let response: Response;

  try {

  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An error occured!" };
  }

  throw response;
}
```

위 코드가 Form의 Post 메서드를 처리하는 가장 기본적인 try-catch 구문입니다.

일단 Response를 하나 만들고 로그인이 맞다면 해당 response를 리턴하고 아니면 에러가 발생했을 경우 에러메시지를 객체로 리턴하는 코드입니다.

이제 try 블록안에 로그인 로직을 넣어 보겠습니다.

```ts
import { createUserSession, getUserId } from "~/services/session.server";

export async function action({ request }: Route.ActionArgs) {
  let response: Response;

  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (email !== "test@test.com" || password !== "1111") {
      throw new Error("Invalid email or password!");
    }

    // 세션 만들기
    response = await createUserSession({
      request,
      userId: email,
      remember: true,
    });

    if (!response) {
      throw new Error("An error occurred while creating the session!");
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An error occured!" };
  }

  throw response;
}
```

이메일과 패스워드는 강제로 만들었습니다.

DB 연동은 다음에 Cloudflare D1으로 해볼 생각이고요.

일단 여기서는 로그인 로직과 세션을 만드는 거에 집중해 보겠습니다.

여기서 잘 보시면 createUserSession 함수를 이용해서 userId가 email 값을 가지는 세션을 하나 만드는데요.

이 함수의 타입정보를 볼까요?

```ts
export async function createUserSession({
  request,
  userId,
  remember = true,
  redirectUrl,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectUrl?: string;
})
```

request, userId, remember, redirectUrl이네요.

redirectUrl까지 지정하면 createUserSession 함수에서 직접 세션을 만들고 나서 해당 Url로 이동할 수 있습니다.

이제 테스트 해볼까요?

테스트 이메일은 "test@test.com", 패스워드는 "1111"입니다.

로그인 버튼을 누르면 홈 라우팅("/")으로 이동하는 걸 볼 수 있습니다.

redirectUrl을 지정 안 했는데 왜 홈 라우팅("/")으로 이동한 걸까요?

그런 Remix 프레임웍이나 React Router의 특성 때문입니다.

로그인 버튼을 누르면 해당 라우팅("/login") 주소로 POST 리퀘스트가 부여됩니다.

POST 리퀘스트는 action 함수에서 처리하고 다시 같은 주소 즉, "/login" 화면이 리프레시됩니다.

이때 리프레시 되면 제일 처음 실행하는 함수가 서버사이드 단에서 loader 함수입니다.

아까 loader 함수에서 getUserId 함수에 의해 만약 유저가 로그인 되었으면 홈 라우팅("/")으로 redirect 하라고 했기 때문에 로그인 후 홈으로 이동한게 됩니다.

이제 로그인까지는 구현했는데요.

로그아웃을 구현해 보겠습니다.

---

## 로그아웃(logout) 구현하기

로그아웃은 세션 정보를 삭제(파괴)하면 됩니다.

그런데 라우팅 정보가 있어야겠죠.

그래서 "/logout" 주소를 가지는 라우팅을 만들어야 합니다.

먼저, routes.ts 파일에 해당 라우팅 정보를 업데이트합니다.

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
] satisfies RouteConfig;
```

그리고 routes 폴더 밑에 logout.tsx 파일을 만들면 되는데요.

이 파일은 클라이언트에서는 아무런 정보도 보여줄 필요 없이 서버사이드에서 세션만 파괴하면 되기 때문에 loader 함수와 action 함수만 있으면 됩니다.

먼저, logout 버튼을 home 라우팅에 만들어 보겠습니다.

보통 Remix나 React Router에서는 Form의 POST 메서드를 이용해서 로그아웃 버튼을 만듭니다.

단순하게 onClick 함수를 이용해서 logout 함수를 불러오는 게 아니라 리퀘스트 부여되고 해당 세션을 삭제하고 다시 리프레시하기 위해 POST 메서드를 보통 이용합니다.

이왕 만든김에 home.tsx 파일에 유저가 로그인 되었을 경우와 아닌 경우에는 로그아웃 버튼을 보여주는 간단한 UI를 리액트로 만들어 보겠습니다.

```ts
import { Form, Link, redirect } from "react-router";
import type { Route } from "./+types/home";
import { getUserId } from "~/services/session.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/login");
  } else {
    return { userId };
  }
}

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome to React Router v7 Auth</h1>
      <div className="mt-6">
        {loaderData?.userId ? (
          <div>
            <p className="mb-6">You are logged in {loaderData?.userId}</p>
            <Form action="/logout" method="post">
              <button type="submit" className="border rounded px-2.5 py-1">
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}
```

위와 같이 만들었는데요.

아래 그림처럼 깔끔한 홈 화면이 구성되었을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiyXpo8Q1XVPa6wmbNilgd8WmUZOI87cyksiqU6jLuUKJksGu7F7bhUNJXhmk-ZT8FHJ8kIzauSVpwXWb2lu12VvO7Xbx5GrPOZWiiy-dU5gAytD02QBYChiC4Gxf0yr5N4hR1al0C5dBkLKMf6z0QcqxZx102Sgfx-X_LEahMPLAM54pQCesQdwvPDnJg)

home.tsx 파일에서 loader 함수를 보면 userId를 돌려보내 주고 있는데요.

Remix 프레임웍이나 React Router에서는 이렇게 loader나 action 함수에서 리턴된 데이터를 Client 컴포넌트에서 loaderData, actionData를 이용해서 쉽게 접근할 수 있습니다.

그래서 `loaderData?.userId?` 값에 따라 UI를 구성하면 됩니다.

이제 로그아웃 버튼을 구현해 보겠습니다.

```ts
import { type MetaFunction } from "react-router";
import { redirect } from "react-router";
import type { Route } from "./+types.logout";
import { logout } from "../services/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}

export async function loader({ request }: Route.LoaderArgs) {
  return redirect("/");
}
```

위 파일이 로그아웃 라우팅입니다.

먼저, loader 함수를 볼 필요가 있는데요.

단순하게 "/logout" 주소로 GET 메서드를 이용해서 접근했을 때는 그냥 다시 "/" 라우팅으로 강제로 이동시킵니다.

GET 메서드 접근은 브라우저에서 해당 "/logout" 주소로 이동한 경우가 바로 GET 메서드로 접근하는 경우입니다.

이럴 경우를 방지하기 위해 loader 함수에 redirect 로직을 구현해 놓는 거죠.

그리고 action 함수가 있는데요.

이 함수가 바로 POST 메서드로 "/logout" 라우팅으로 리퀘스트가 온 경우 해당 로직을 처리하는 코드입니다.

여기서는 단순하게 logout 함수를 불러서 실행시켰는데요.

session.server.ts 파일에 logout 함수를 추가해 보겠습니다.

```ts
export async function logout(request: Request) {
  console.log("logout");
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
```

위 함수를 session.server.ts 파일 아무 곳에 위치해 놓으면 됩니다.

logout 함수는 request를 인자로 가지는 함수인데요.

간단하게 해당 세션을 불러온다음 sessionStorage의 destroySession 함수를 이요해서 세션을 삭제하면 됩니다.

이 방식이 조금 생소할 수 있는데요.

redirect 하면 "/" 주소로 리퀘스트가 일어나는데요.

HTTP의 리퀘스트에는 headers 란에 "Cookie" 정보가 같이 들어가 있는데 logout 함수에서는 headers 에 "Set-Cookie" 를 이용해서 해당 쿠키를 삭제해서 리퀘스트한다는 겁니다.

지금까지 Next.js나 React 공부하면서 HTTP의 Response를 직접 공부한 적 없었는데요.

React Router나 Remix 프레임웍이 추구하는 방향은 가장 웹 표준에 충실한 코드를 만드는 겁니다.

그래서 위와 같은 방식도 가장 웹 표준에 충실한 방법인거죠.

이제 모든 코드가 완성되었습니다.

로그아웃 버튼을 눌러보면 로그아웃 되어 있을 겁니다.

---

## 쿠키 확인해 보기

크롬 DevTools를 열어서 Application 부분에서 쿠키 부분을 보시면 로그인하기 전에는 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi_Gd_P5C7jfFjuWaMcvovnaBmV_BPaWxgodELIoMjwSOnENgj4PJjHprJIFgbhU23mOAQeqc-3r7nqbqoty39-A1sEoJ0CEkvwyXKlnTwpRTnje2Bq0krWp_wNmc46MiWZmG7CjfG1A_s-e5QhIBXO1PVZn_X3a9QPYlgLLnGbxCo65qeIaBWbt9OcaHQ)

로그인하면 아래처럼 쿠키 이름 "__session"이 생깁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEij_oBQg2WexZFEUGllI1FmuiuWNavBW8Y0KISBj35YekMPbrVzaojHjiovB0Yjaz6XOP9XxyN0KktOPODhxikqq_muFGA17thvpeDAXzkUPwU6jYHUX4cUmAqd4gledm7GDZdFXoxXy599eZLCDk17dAHLlhcwgDRCojvlhDl-3wUpk0aU6pHy6jCl3VQ)

쿠키 이름은 session.server.ts 파일에서 아래 코드에서 우리가 지정한겁니다.

```ts
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: ["s3cret1"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});
```

이름을 특별한 걸로 바꾸는 것도 좋은 방법입니다.

---

지금까지 React Router V7으로 가장 기본적인 쿠키를 이용한 세션 로그인, 로그아웃 로직을 구현해 봤습니다.

이렇게 하면 여러분도 본격적인 풀스택앱을 구현할 수 있을 겁니다.

그럼.

