---
slug: 2024-12-28-react-router-v-7-supabase-user-auth-login-signup-logout
title: React Router V7과 Supabase로 유저 가입, 로그인, 로그아웃(Auth) 구현하기
date: 2024-12-28 07:34:31.221000+00:00
summary: React Router V7와 함께 Supabase의 User Auth 부분 즉, 로그인(로그아웃)을 구현해 보겠습니다.
tags: ["react", "react router", "react router v7", "auth", "login", "logout", "supabase"]
contributors: []
draft: false
---

** 목 차 **

- [React Router V7과 Supabase로 유저 가입, 로그인, 로그아웃(Auth) 구현하기](#react-router-v7과-supabase로-유저-가입-로그인-로그아웃auth-구현하기)
  - [프로젝트 구성](#프로젝트-구성)
  - [Superbase 세팅하기](#superbase-세팅하기)
  - [Signup 페이지 만들기](#signup-페이지-만들기)
  - [Signup action 함수 구현하기](#signup-action-함수-구현하기)
  - [login 페이지 구현하기](#login-페이지-구현하기)
  - [Index 페이지 만들기](#index-페이지-만들기)
  - [Logout 구현하기](#logout-구현하기)

---

안녕하세요?

React Router V7 관련 강좌 세 번째 글입니다.

최근 들어 React Rouer V7의 출시와 함께 FullStack 웹 개발을 위한 첫 번째 단추인 유저 로그인을 구현하는 글을 계속 쓰고 있는데요.

이 글을 읽기 전에 지난 시간의 글도 한 번 읽어 보시는 걸 추천드립니다.

- [React Router V7 유저 Auth(로그인) 구현하기](https://mycodings.fly.dev/blog/2024-12-25-tutorial-react-router-v-7-user-auth)

- [React Router V7과 Cloudflare Pages 그리고 D1 Database 사용](https://mycodings.fly.dev/blog/2024-12-25-react-router-with-cloudflare-pages-d-1-db)

---

오늘은 Supabase의 Auth 관련 부분을 React Router V7에 구현해 보겠습니다.

Supabase Doc을 잘 보시면 클라이언트쪽 Doc은 Javascript 부분에 잘 나와있는데요.

우리가 오늘 구현하려는 건 SSR(Server Side Rendeing) 쪽 코드입니다.

여기 [Supabase Doc](https://supabase.com/docs/guides/auth/server-side)을 잘 보시면 SSR 부분에 아래와 같이 Next.js와 SvelteKit의 예제는 있는데, Remix나 React Router V7 관련 예제는 없습니다.

Next.js 쪽 관련 코드를 React 코드로 옮기는 게 오늘의 주요 강좌가 되겠네요.

---

## 프로젝트 구성

먼저, 아래와 같이 React Router V7 템플릿을 만듭니다.

```sh
pnpx create-react-router@latest supabase-auth-test
 WARN  2 deprecated subdependencies found: glob@7.2.3, inflight@1.0.6
Packages: +194
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 194, reused 194, downloaded 0, added 194, done

         create-react-router v7.1.1
      ◼  Directory: Using supabase-auth-test as project directory

      ◼  Using default template See https://github.com/remix-run/react-router-templates for more
      ✔  Template copied

   git   Initialize a new git repository?
         Yes

  deps   Install dependencies with pnpm?
         Yes

      ✔  Dependencies installed

      ✔  Git initialized

  done   That's it!

         Enter your project directory using cd ./supabase-auth-test
         Check out README.md for development and deploy instructions.

         Join the community at https://rmx.as/discord

➜  react-router-test cd supabase-auth-test
```

요즘 'NPM' 보다는 'PNPM'을 쓰고 맥북 용량을 많이 줄이고 있습니다.

여러분도 꼭 'PNPM' 쓰시기 바랍니다.

이제 빈 템플릿을 구현했으니까 `routes.ts` 파일에 우리가 사용할 라우팅을 구현해야겠죠.

전체적인 구현은 지난 시간과 비슷합니다.

먼저, login 페이지가 있어야 하고, signup 페이지가 있고, 그다음에 당연히 home 페이지가 있어야겠죠.

참고로 Index 라우팅은 index.tsx 파일로 만들고 인덱스 라우팅에서는 유저 로그인 여부에 따라서 home으로 가던가, login 페이지로 가든가 분기하는 코드를 넣어보도록 하겠습니다.

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("/home", "routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
] satisfies RouteConfig;
```

---

## Superbase 세팅하기

먼저, Supabase 가입했다고 전제하고 제일 먼저 만드는 게 Organization인데요.

그러고 나면 Project를 기본적으로 하나 만들게 됩니다.

[대시보드](https://supabase.com/dashboard/projects)로 가면 프로젝트를 고를 수 있고 해당 프로젝트를 고르면, Project API를 아래 그림과 같이 보여줍니다.

우리가 필요한건 바로 Project URL과 API Key인데요.

꼭 챙겨두시기 바랍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiuRyB7pJxitZ5e38ocaWRlkoplbBlXaLfdOSW5u-i_dx3uvwM88A7KmL3QBTA0LkiIs2glzQbUqhhKkL_GyUEHbdPaJXqqHj6LrKA1XEVhIsQD31cQQF-PvfAx07mqiw-kL_NdUmGtQeJTBU4MqQjWybWGjkoI_c6XqCRJ87aZecSLxBkhcYBMN77zXdE)

위와 같이 두 개의 중요 데이터를 `.env.local` 파일에 아래와 같이 저장합시다.

```sh
VITE_SUPABASE_URL=https://ladfasdfasdfasdfasd.supabase.co
VITE_SUPABASE_ANON_KEY=eadsfasdfasdfsadfsafasdfsaddfds
```

꼭 "VITE_"로 시작하는 이름으로 지정해야 Vite 서버에서 접근 가능합니다.

이제 환경변수 설정은 끝났습니다.

Supabase를 NodeJS 환경에서 사용하려면 관련 NPM 패키지를 설치해야 하는데요.

우리는 SSR 모드로 사용하려고 하므로 아래처럼 두 개의 패키지를 설치해야 합니다.

```sh
npm install @supabase/supabase-js @supabase/ssr

or

pnpm install @supabase/supabase-js @supabase/ssr
Packages: +14
++++++++++++++
Progress: resolved 380, reused 330, downloaded 10, added 14, done

dependencies:
+ @supabase/ssr 0.5.2
+ @supabase/supabase-js 2.47.10

Done in 4.2s
```

저는 'pnpm'으로 설치했습니다.

참고로, 클라이언트 사이트에서 Supabase를 사용하려면 `@supabase/supabase-js` 패키지에서 `createcreateClient` 함수를 통해서 아래 코드처럼 Supabase를 초기화하고 사용하시면 됩니다.

```js
const supabase = createClient('https://<project>.supabase.co', '<your-anon-key>')
```

그런데, 우리는 React Router V7의 SSR 방식으로 사용하려고 하기때문에 `@supabase/ssr` 패키지를 이용해서 supabase 객체를 초기화해야 합니다.

`@supabase/ssr` 패키지에서는 두 가지 방식의 함수를 제공해 주는데요.

각각 클라이언트 상태에서 사용하는 `createBrowserClient` 함수와, 서버쪽에서 사용하는 `createServerClient` 함수를 제공합니다.

먼저, React Router V7의 config 파일이 아래와 같이 SSR 모드로 되어 있는 걸 확인하고 `createServerClient`를 사용해서 supabase 객체를 초기화하는 코드를 작성합시다.

```ts
import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
} satisfies Config;
```

위와 같이 React Router V7의 config 파일에서 SSR 모드가 활성화되어 있습니다.

이제 app 폴더 밑에 간단하게 server.ts 파일을 만듭시다.

좀 더 복잡하게 폴더 구조를 만드셔도 되는데요.

테스트 앱이기 때문에 app 폴더 바로 밑에 만들었습니다.

```ts
// app/server.ts

import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export const getServerClient = (request: Request) => {
  const headers = new Headers();
  const supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "") ?? {};
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  return supabase;
};
```

위 코드는 Supabase Doc에 있는 Next.js 코드를 React Router에서 사용할 수 있게 고친 겁니다.

이제 서버 사이드 단에서 supabase에 접근할 수 있는 'supabase' 객체를 만들었습니다.

React Router의 아무 loader, action 함수에서 supabase 객체에 접근하면 아래와 같이 유저 로그인(Auth)에 접근할 수 있게 됩니다.

```ts
const { error } = await supabase.auth.signInWithPassword(data)

or

const { error } = await supabase.auth.signUp(data)
```

---

## Signup 페이지 만들기

이제 Supabase 세팅이 끝났으니 가입하기(Signup) 페이지를 만들어 보겠습니다.

routes 폴더에서 'signup.tsx' 파일을 만들고 아래처럼 UI부분을 먼저 만듭시다.

```ts
export default function Signup({ actionData }: Route.ComponentProps) {
  const error = actionData
    ? (actionData as { error: string | null })?.error
    : null;

  return (
    <div className="flex p-8 mx-auto">
      <h1>Signup</h1>

      <Form method="post" className="mt-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label htmlFor="email" className="min-w-24">
              email
            </label>
            <input
              id="email"
              type="text"
              name="email"
              className="flex-1 border"
            />
          </div>
          <div className="flex flex-row">
            <label htmlFor="password" className="min-w-24">
              password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="flex-1 border"
            />
          </div>
          <div className="flex flex-row-reverse mt-4 gap-4">
            <button
              type="submit"
              className="border rounded px-2.5 py-1 w-32 bg-blue-500 text-white"
            >
              Signup
            </button>
            <Link to="/login">
              <button
                type="button"
                className="border rounded px-2.5 py-1 w-32 bg-yellow-500 text-white"
              >
                Login
              </button>
            </Link>
          </div>
        </div>
        {error ? (
          <div className="flex flex-row">
            <p className="text-red-600 mt-4">{error}</p>
          </div>
        ) : null}
      </Form>
    </div>
  );
}
```

UI 부분은 TailwindCSS로 멋지게 만들었고, Error 핸들링은 actionData를 이용해서 구현했습니다.

actionData는 UI에서 Form을 submit 했을 때 즉, "POST" 메서드로 submit 했을 때 React Router는 action 함수에서 처리하게 됩니다.

그리고 action 함수에서 리턴하는 데이터에 접근할 수 있는 게 바로 actionData 객체입니다.

이 방식은 action 이라는 서버 사이드 쪽 함수에서 생성한 데이터를 UI 쪽인 클라이언트 사이드에서 쉽게 접근할 수 있게 해주는 방식입니다.

예전 Next.js의 getServerSideProps 함수라고 보시면 쉽습니다.

React Router에서는 이걸 아주 쉽게 구현한게 바로 loader 함수의 loaderData이고, action 함수의 경우 actionData입니다.

UI쪽 컴포넌트의 첫 번째 코드를 보시면 actionData에서 error만 인식하는 코드입니다.

React Router 쪽에서 전문가들이 많이 사용하는 방식인데요, 꼭 외워서 두루두루 사용하시기 바랍니다.

참고로 Form의 메서드 방법은 "post" 입니다.

그래야지 action 함수에서 formData에 접근할 수 있기 때문입니다.

---

## Signup action 함수 구현하기

이제 Signup 단계의 두 번째인 action 함수를 구현해야하는데요.

이 부분이 바로 SSR 부분입니다.

구현 로직은 formData와 함께 `server.ts` 파일에서 만들어 놓은 Supabase 객체를 이용해서 signUp 하면 됩니다.

```ts
export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const dataFields = Object.fromEntries(formData.entries());
    console.log(dataFields);

    const sbServerClient = getServerClient(request);
    console.log(sbServerClient);
    const { data, error } = await sbServerClient.auth.signUp({
      email: dataFields.email as string,
      password: dataFields.password as string
    });
    console.log(data);

    if (error) {
      return { error: error.message };
    }

    return { user: data.user };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occured!" };
  }
}
```

위 코드가 바로 action 코드인데요.

formData를 얻고, 그다음 아까 만들었던 getServerClient 함수로 supabase 클라이언트를 얻습니다.

그리고 await 방식으로 auth.signUp 함수를 통해 가입하기를 수행하면 끝입니다.

한 번 해볼까요?

UI는 변한게 없는데 터미널 창을 보시면 console.log 명령어에 의해 user가 아래처럼 보입니다.

```sh
{
  user: {
    id: 'b62dad93-19d3-4330-8af3-fd947d7383ac',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'admin@mycodings.com',
    phone: '',
    confirmation_sent_at: '2024-12-28T05:57:06.101042254Z',
    app_metadata: { provider: 'email', providers: [Array] },
    user_metadata: {
      email: 'admin@mycodings.com',
      email_verified: false,
      phone_verified: false,
      sub: 'b62dad93-19d3-4330-8af3-fd947d7383ac'
    },
    identities: [ [Object] ],
    created_at: '2024-12-28T05:57:06.090245Z',
    updated_at: '2024-12-28T05:57:06.575228Z',
    is_anonymous: false
  },
  session: null
}
```

그러면 Supabase의 대시보드로 가 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEispI1tGsea6IRxuCoxGqvo8T3_hEAbMym63DvNn1jk29ZnZaZcocc6iX1dDfCMh2o86GrjVCDkglC_d61GBX0wCwIhZMlmsWAAzjUnDdvKSEB2cBp7WFktBfaLEnLAER560tNdkFmBld4v4FDyqgVR8Q71OdxQdVSRUUopqQmAh4QH6QSBwQYWDCGVFQE)

위와 같이 아주 유저가 새로 가입되었네요.

이메일을 적으실 때 'test@test.com'처럼 누가 봐도 테스트 이메일인 거는 적으시면 안 됩니다.

그런데, 가입하고 나서 로그인 페이지로 이동하는 게 맞다고 느끼시면 action 함수의 마지막 부분을 아래와 같이 바꾸시면 됩니다.

```ts
return { user: data.user };
  } catch (error) {
```

catch 문구 바로 위에 있는 return 문구는 가입하기가 성공했을 경우 UI쪽으로 actionData에 유저 정보를 넘겨주고 있는데, 우리가 UI쪽에서는 actionData.error만 신경 쓰고 있어 이럴 필요가 없습니다.

그래서 다음과 같이 redirect 하는 게 일반적입니다.

```ts
import { Form, Link, redirect } from "react-router";



    // return { user: data.user };
    return redirect("/login");
  } catch (error) {
```

이제 테스트해 보시면 login 페이지로 이동하신 걸 볼 수 있을 겁니다.

---

## login 페이지 구현하기

이제 로그인 페이지를 구현해 봅시다.

테스트를 위해 Supabase의 Email 로그인 옵션에 보시면 `Confirm email` 부분을 체크해제하고 시행하겠습니다.

왜냐하면 테스트를 위해 email을 가짜 이메일로 가입했었기 때문입니다.

실제로 사용하시는 이메일로 가입해 보시면 이메일 컨펌 메일이 실제로 오게 될 겁니다.

Supabase 대시보드의 Authentication 부분에서 Providers 부분을 보시면 중간에 Auth Providers 부분에 Email 부분을 클릭하면 아래와 같이 'Confirm email' 부분이 있는데 이걸 체크 해제하시고 테스트 진행하시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhpiK_WcoamsbFRW7d-QnWutD9Cixlk6y0k1VdCKQICIY-9Dx9SV0XJIJcX79Dh7LvTdX0DRFwAKoM5KK94oONdsuH4nxZz3coTGYfGP6byQiNkz4a_UPRvFfTgtTlkDqALZakcO9E4J04A-d_rEnQdKnqqQp5PpXK8khyfL2dSY2EETEFT-z-oOXEtB1w)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj4ktoWxr3BLJwRUEbpNTH7io_W-9gFn33oSIFg9UhEeVnpnfanx2hM5l-C7Kz8jCzFu48XziIHyocO7GXhmDPcqtE__dl7ErXYeUpFqEVmmlBKmPu3IHOVyuOy3hMBqKbsBlRByXEeb3OhfI14vCD4nmA45PKa9jK-RALFgHxZy4BMk74ZTipJOC0aWXU)

참고로 위 그림의 마지막 부분에 있는 'Save' 버튼을 눌러 'Confirm email' 부분에 대한 변경사항을 저장해야 합니다.

'Confirm email' 부분을 체크해서 하시면 유저 가입을 새로 하셔야 합니다.

이제 UI와 action 함수 쪽을 살펴보겠습니다.

routes 폴더의 'login.tsx' 파일을 고쳐야 하는데요.

UI 부분은 signup.tsx의 Form을 그대로 가져오시면 됩니다.

```ts
export default function Login({ actionData }: Route.ComponentProps) {
  ...
  ...
  ...

  return (
    <div className="flex p-8 mx-auto">
      <h1>Login</h1>

      <Form method="post" className="mt-6" onSubmit={doLogin}>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label htmlFor="email" className="min-w-24">
              email
            </label>
            <input
              id="email"
              type="text"
              name="email"
              className="flex-1 border"
            />
          </div>
          <div className="flex flex-row">
            <label htmlFor="password" className="min-w-24">
              password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              className="flex-1 border"
            />
          </div>
          <div className="flex flex-row-reverse mt-4 gap-4">
            <button
              type="submit"
              className="border rounded px-2.5 py-1 w-32 bg-blue-500 text-white"
            >
              Login
            </button>
            <Link to="/signup">
              <button
                type="button"
                className="border rounded px-2.5 py-1 w-32 bg-yellow-500 text-white"
              >
                Signup
              </button>
            </Link>
          </div>
        </div>
        {error ? (
          <div className="flex flex-row">
            <p className="text-red-600 mt-4">{error}</p>
          </div>
        ) : null}
      </Form>
    </div>
  );
}
```

Login UI를 잘 보시면 Form의 onSubmit 핸들러를 이용하고 있습니다.

즉, 클라이언트 사이드에서 처리하겠다는 얘기입니다.

onSubmit 핸들러인 doLogin 함수를 작성해 봅시다.

```ts
import { Form, Link, redirect, useNavigate } from "react-router";
import type { Route } from "./+types/login";
import { getServerClient } from "~/server";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login" }, { name: "description", content: "Login Page!" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const sbServerClient = getServerClient(request);
  const userResponse = await sbServerClient.auth.getUser();

  if (userResponse?.data?.user) {
    throw redirect("/home");
  }

  return {
    env: {
      SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL!,
      SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY!,
    },
  };
}

export default function Login({ loaderData }: Route.ComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const { env } = loaderData;
  const navigate = useNavigate();

  const doLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dataFields = Object.fromEntries(formData.entries());

    const supabase = createBrowserClient(
      env.SUPABASE_URL,
      env.SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: dataFields.email as string,
      password: dataFields.password as string,
    });

    if (error) {
      console.log(error);
      setError(error.message);
      return;
    }

    if (data.session) {
      // Redirect to home
      navigate("/home");
    }
  };

  return (
    <div className="flex p-8 mx-auto">
      <h1>Login</h1>
      ...
      ...
      ...
    </div>
  );
```

그러면 궁금증이 생길 텐데요.

왜 Signup에서는 서버 사이드 로직으로 가입하기를 처리했는데,  로그인에서는 클라이언트 사이드에서 처리하는 걸까요?

바로 로그인 부분에서 loader 함수에서 똑같이 signInWithPassword 함수를 통해 리턴된 data는 브라우저의 쿠키 세션을 통해 저장되지 않아서 입니다.

그래서 서버사이드로 작성하면 authSession을 찾을 수 없다는 에러가 뜹니다.

이 부분은 부득이하게 '@supabase/ssr' 패키지의 createBrowserClient 함수를 이용해서 클라이언트 함수를 이용해서 로그인을 수행해야 합니다.

createBrowserClient에 SUPABASE_URL과 ANON_KEY를 함수 인자로 넣어야 하는데요.

이 부분은 VITE 서버에서 서버사이드로 인식되니까 loader 함수에서 return 해주고 있습니다.

그리고 그걸 UI 쪽 컴포넌트에서 loaderData로 'env'로 접근해 주면 됩니다.

최종적으로 로그인을 해보면 아래 그림처럼 쿠키가 생성됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgxowKhJM1hewYa7KdstlyNbwrO21ECx9hxgsvmDtbfeZ3XDzwGFC44lWId5a8P-JL96YmqE8_ZDcBxlz1eyjSsLatEPmh0xUKjK3HF_40H8PyquqFYuF3EuQmEkOnvIIYOespx16NGVxbB-nzEGA80hkTmMDYBss2SZ5QJbECB04P6lY2nW_sqG3gQ07o)

세션을 이용한 로그인 부분은 다음 시간에 구현해 보겠습니다.

일단 테스트를 위해 로그인을 진행해 보시면 home 쪽으로 이동하게 되는데요.

이 home 페이지를 작성해 보겠습니다.

사실 home 페이지나 index 페이지를 합쳐서 하나로 만들어도 됩니다.

그래서 테스트를 위해 home.tsx 파일은 아래와 같이 만들겠습니다.

```ts
import { redirect } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  throw redirect("/");
}
```

loader 함수에 의해 바로 "/" 라우팅으로 이동하게 됩니다.

---

## Index 페이지 만들기

로그인 여부는 Index 페이지가 제일 처음 서버 사이드 쪽에서 렌더링 될 때 실행하는 코드에서 확인해야 하는데요.

바로 loader 함수입니다.

이 부분을 자세히 살펴보시면 됩니다.

전체 코드입니다.

```ts
import { getServerClient } from "~/server";
import type { Route } from "./+types/index";
import { Form, Link, redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Index App" },
    { name: "description", content: "Index Page!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const sbServerClient = getServerClient(request);
  const userResponse = await sbServerClient.auth.getUser();
  console.log(userResponse);

  if (userResponse.error || !userResponse.data.user) {
    throw redirect("/login");
  }

  return { user: userResponse?.data?.user || null };
}
export default function Index({ loaderData }: Route.ComponentProps) {
  const user = loaderData?.user;

  return (
    <div className="flex flex-col gap-4 p-8 mx-auto">
      <h1>React Router Supabase Auth App Test</h1>
      {user ? (
        <>
          <p>Welcome {user?.email}</p>
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="border rounded px-2.5 py-1 w-32 bg-red-500 text-white"
            >
              Logout
            </button>
          </Form>
        </>
      ) : (
        <>
          <p>Welcome!</p>
          <Link
            to="/login"
            className="border rounded px-2.5 py-1 w-32 bg-blue-500 text-white"
          >
            Login
          </Link>
        </>
      )}
    </div>
  );
}
```

화면을 보시면 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgRqcxsPLGjFpVgkCAI5JwLdLFWc03cbdbE09H276Om3AHpR3Cqqnr88z9pVo7AqgXiP2stJ8GB5Rdk3amN4MDEmMwr2ZsHUUvmGUghGQ_xia5cbGyh_V2yuYYZJZMDf8GDcrbuVUecZmYdXOSI5zkSDaBGBN87P-P0qDF1sq0XivRRBLPUx8efp0tf6Wc)

---

## Logout 구현하기

이제 logout 라우팅을 구현해야 하는데요.

logout 로직은 Index 페이지의 action 함수안에 구현할 수 도 있고 "/logout" 라우팅을 따로 만들 수 도 있습니다.

저는 다른 곳에서도 사용할 수 있게 "/logout" 라우팅을 따로 만들겠습니다.

먼저, routes.ts 파일에 아래처럼 "/logout"을 추가합시다.

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("/home", "routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/signup", "routes/signup.tsx"),
  route("/logout", "routes/logout.tsx"),
] satisfies RouteConfig;
```

이제 "logout.tsx" 파일을 만듭시다.

이 파일은 UI 부분은 필요 없어서 loader 함수와 action 함수만 있으면 됩니다.

```ts
import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { getServerClient } from "~/server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login" }, { name: "description", content: "Login Page!" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  throw redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const sbServerClient = getServerClient(request);
    await sbServerClient.auth.signOut();

    return redirect("/");
  } catch (error) {
    console.error(error);
    return { error: "Failed to logout!" };
  }
}
```

로그아웃의 핵심은 sbServerClient.auth.signOut() 함수입니다.

실제로 테스트해 보면 로그아웃되어서 다시 "/login" 라우팅으로 이동하는 걸 볼 수 있을 겁니다.

---

지금까지 React Router V7과 Supabase Auth를 이용해서 로그인, 가입하기, 로그아웃을 구현해 봤습니다.

다음에는 로그인 부분에서 세션 저장 관련 시도해 보겠습니다.

그럼.


