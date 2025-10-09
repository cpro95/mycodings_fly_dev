---
slug: 2024-12-29-ssr-login-with-react-router-and-supabase
title: React Router V7에서 서버사이드 렌더링(SSR) 방식으로 완벽하게 Supabase 로그인 구현하기
date: 2024-12-29 08:11:39.580000+00:00
summary: Supabase의 로그인 부분을 클라이언트 사이드쪽 말고 서버사이드 렌더링 방식으로 구현해 봅시다.
tags: ["react", "react router", "react router v7", "auth", "login", "ssr", "supabase"]
contributors: []
draft: false
---

** 목 차 **

- [React Router V7에서 서버사이드 렌더링(SSR) 방식으로 완벽하게 Supabase 로그인 구현하기](#react-router-v7에서-서버사이드-렌더링ssr-방식으로-완벽하게-supabase-로그인-구현하기)
  - [React Router V7과 Supabase의 로그인을 SSR로 구현하는 핵심 로직은?](#react-router-v7과-supabase의-로그인을-ssr로-구현하는-핵심-로직은)
  - [쿠키 세션 만들기](#쿠키-세션-만들기)
  - [Login 구현하기](#login-구현하기)
  - [쿠키의 토큰을 이용해서 유저 정보 알아보기](#쿠키의-토큰을-이용해서-유저-정보-알아보기)
  - [로그아웃 로직 수정하기](#로그아웃-로직-수정하기)


---

안녕하세요?

React Router V7 관련 강좌 네 번째 글입니다.

지난 시간에 Supabase로 SSR 방식 즉, 서버 사이드 렌더링 방식의 Auth 구현을 했었는데요.

가입하기는 서버 사이드 렌더링 방식인데, 로그인 부분은 클라이언트 사이드 방식으로 진행했었는데요.

오늘은 로그인 부분도 서버 사이드 렌더링 방식으로 구현해 보겠습니다.

참고로, 이 글을 읽기 전에 지난 시간의 글들도 한 번 읽어 보시는 걸 추천 드립니다.

- [React Router V7 유저 Auth(로그인) 구현하기](https://mycodings.fly.dev/blog/2024-12-25-tutorial-react-router-v-7-user-auth)

- [React Router V7과 Cloudflare Pages 그리고 D1 Database 사용](https://mycodings.fly.dev/blog/2024-12-25-react-router-with-cloudflare-pages-d-1-db)

- [React Router V7과 Supabase로 유저 가입, 로그인, 로그아웃(Auth) 구현하기](https://mycodings.fly.dev/blog/2024-12-28-react-router-v-7-supabase-user-auth-login-signup-logout)

---

## React Router V7과 Supabase의 로그인을 SSR로 구현하는 핵심 로직은?

React Router V7과 Supabase의 로그인을 SSR로 구현하는 핵심 로직은 바로 토큰인데요.

sbServerClient.auth.signInWithPassword 함수로 로그인을 시도하고 완료되면, data와 error를 디스트럭처링해서 얻을 수 있습니다.

data에는 세션정보와 user 정보를 함께 포함하고 있는데요.

아래와 같은 형식입니다.

```sh
{
  access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6Ik5XR2VKYmJueEdLZGhpYWkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2xyaWNndHF0Y2hhaXprdXdibXp3LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIzY2VlNzRlMC1hZjk1LTRmMmMtYTlhYi02ZjVjMzgyOGQ4NTQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzM1NDYxMzM1LCJpYXQiOjE3MzU0NTc3MzUsImVtYWlsIjoiYWRtaW5AbXljb2RpbmdzLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJhZG1pbkBteWNvZGluZ3MuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwic3ViIjoiM2NlZTc0ZTAtYWY5NS00ZjJjLWE5YWItNmY1YzM4MjhkODU0In0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MzU0NTc3MzV9XSwic2Vzc2lvbl9pZCI6IjY1NmY4MTVlLTBlZGItNGVhNC1iOTVhLWJhOTk1NDVkZTkwNyIsImlzX2Fub255bW91cyI6ZmFsc2V9.YxOfLe88GdBHR0EPitgbtT5p0Wzc_gXSkrDGw-xUkNc',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: 1735461335,
  refresh_token: 'h_e55i2s1BNfo4bohwPUPQ',
  user: {
    id: '3cee74e0-af95-4f2c-a9ab-6f5c3828d854',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'admin@mycodings.com',
    email_confirmed_at: '2024-12-28T06:37:00.3031Z',
    phone: '',
    confirmed_at: '2024-12-28T06:37:00.3031Z',
    last_sign_in_at: '2024-12-29T07:35:35.248673738Z',
    app_metadata: { provider: 'email', providers: [Array] },
    user_metadata: {
      email: 'admin@mycodings.com',
      email_verified: true,
      phone_verified: false,
      sub: '3cee74e0-af95-4f2c-a9ab-6f5c3828d854'
    },
    identities: [ [Object] ],
    created_at: '2024-12-28T06:37:00.287774Z',
    updated_at: '2024-12-29T07:35:35.251357Z',
    is_anonymous: false
  }
}
```

HTTP의 리퀘스트는 Stateless 상태이기 때문에 우리가 매번 로그인 여부를 체크하기 위해서는 위에서처럼 access_token과 refresh_token이 필요합니다.

이 access_token을 이용해서 현재 로그인된 유저 정보를 가져올 수 있거든요.

아래 함수는 Supabase에서 제공해 주는 getUser 함수인데요.

```ts
await sbServerClient.auth.getUser(access_token)
```

이 getUser 함수는 access_token 이라는 인자를 옵셔널로 받습니다.

현재 로그인한 상태에서 다른 곳으로 HTTP 리퀘스트가 안 갔다는 전제하에서는 access_token이 필요 없지만, 보통은 로그인하면 홈 라우팅으로 이동하게 됩니다.

이때 홈 라우팅으로 이동하게 되면 이 access_token이 사라져 버리게 되는 문제가 발생하죠.

그래서 Supabase로 SSR 방식으로 로그인을 유지하기 위해서는 토큰(Token) 정보를 로컬의 쿠키에 저장해 놓고, 매번 HTTP 리퀘스트(Request)가 일어났을 때, 즉 새로운 라우팅으로 이동했을 경우 쿠키에서 토큰(Token) 정보를 얻어서 해당 access_token으로 getUser(access_token) 함수를 실행시키면 로그인 여부를 쉽게 알 수 있는 거죠.

지금까지가 제가 구현한 Supabase의 서버 사이드 로그인 구현 로직이었습니다.

이제 실제로 구현해 보겠습니다.

---

## 쿠키 세션 만들기

React Router V7 강좌 첫 번째에는 쿠키 세션을 만드는 강좌가 있는데요.

이걸 그대로 이용하겠습니다.

session.server.ts 파일이 있었는데요.

아래와 같이 일부 수정하겠습니다.

참고로, 지난 시간에는 환경 변수를 `process.env` 방식으로 접근했었는데 제가 잘못했던 거였습니다.

Vite Dev 서버이기 때문에 아래처럼 `import.meta.env` 방식으로 접근해야 합니다.

```ts
import { createCookieSessionStorage, redirect } from "react-router";

export const mySupabaseSessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__my__supabase__session__",
    secrets: ["my_secret_with_supabase_session_storage"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: import.meta.env.MODE === "production",
  },
});

export const { commitSession, destroySession } = mySupabaseSessionStorage;

export const SESSION_KEY = "tokens";

export async function createUserSession({
  request,
  session_key,
  remember = true,
  redirectUrl,
}: {
  request: Request;
  session_key: any;
  remember: boolean;
  redirectUrl?: string;
}) {
  const session = await getUserSession(request);
  session.set(SESSION_KEY, session_key);
  return redirect(redirectUrl || "/", {
    headers: {
      "Set-Cookie": await mySupabaseSessionStorage.commitSession(session, {
        httpOnly: true,
        secure: import.meta.env.MODE === "production",
        sameSite: "lax",
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

const getUserSession = async (request: Request) => {
  return await mySupabaseSessionStorage.getSession(
    request.headers.get("Cookie")
  );
};

export async function getTokens(request: Request) {
  const session = await getUserSession(request);
  const tokens = session.get(SESSION_KEY);
  return tokens;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await mySupabaseSessionStorage.destroySession(session),
    },
  });
}
```

코드가 길어 읽기 힘든데요.

mySupabaseSessionStorage라는 걸 React Router가 제공해 주는 createCookieSessionStorage 헬퍼 함수를 이용해서 만듭니다.

그리고 실제로 세션을 만드는 createUserSession 함수를 잘 보시면, SESSION_KEY를 저장하는 게 보이는데요.

여기에 토큰(Token) 정보를 저장할 겁니다.

그리고 이왕 만든 김에 getTokens 이라는 헬퍼 함수도 만들었습니다.

getTokens 함수는 getUserSession 에서 session 값을 가지고 오고 그 session 에 저장되어있는 SESSION_KEY를 읽어오는 겁니다.

그게 바로 토큰(Token) 정보인 겁니다.

logout 함수도 예전에 만들어 놨던 함수 그대로입니다.

---

## Login 구현하기

지난 강좌의 Login에서는 doLogin 이라는 클라이언트 사이드에서의 함수로 로그인을 구현했는데요.

이번 시간에는 SSR 방식으로 구현할 겁니다.

그래서 UI 쪽에서 onSubmit 핸들러를 삭제시킵니다.

```ts
<Form method="post" className="mt-6">
```

위와 같이 Form이 submit 되면 Reqeust(리퀘스트)가 다시 해당 "/login" 라우팅으로 가고 React Router에서는 Post 메서드로 왔기 때문에 action 함수가 처리할 겁니다.

그래서 action 함수를 아래와 같이 복잡하게 만들어야 합니다.

```ts
export async function action({ request }: Route.ActionArgs) {
  let response: Response;

  try {
    const formData = await request.formData();
    const dataFields = Object.fromEntries(formData.entries());

    const sbServerClient = getServerClient(request);
    const { data, error } = await sbServerClient.auth.signInWithPassword({
      email: dataFields.email as string,
      password: dataFields.password as string,
    });

    if (error) {
      return { error: error.message };
    }

    const tokens = {
      access_token: data?.session.access_token,
      token_type: data?.session.token_type,
      expires_in: data?.session.expires_in,
      expires_at: data?.session.expires_at,
      refresh_token: data?.session.refresh_token,
    };

    // 세션 만들기
    response = await createUserSession({
      request,
      session_key: tokens,
      remember: true,
    });

    if (!response) {
      throw new Error("An error occurred while creating the session!");
    }

  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occured!" };
  }

  throw response;
}
```

이 코드는 예전에 createUserSession 함수로 세션 정보를 저장할 때 사용했던 코드에서 토큰(Token) 정보를 저장하게끔 수정한 코드입니다.

```ts
response = await createUserSession({
  request,
  session_key: tokens,
  remember: true,
});
```

위 코드에서처럼 session_key를 tokens로 저장하면 로컬의 쿠키에는 토큰 정보가 저장되게 됩니다.

자, 이제 로그인이 됐으니까 홈("/") 라우팅으로 가서 로그인 여부를 체크하는 로직을 만들어 봅시다.

---

## 쿠키의 토큰을 이용해서 유저 정보 알아보기

로컬 상의 쿠키에 토큰 정보를 저장했기 때문에 이 토큰 정보를 이용해서 아까 설명했듯이 Supabase의 getUser(access_token) 함수를 이용해서 access_token만 있으면 유저 정보를 쉽게 얻을 수 있습니다.

그러면 여기서 의문점이 생기는데요.

로그인했을 경우 처음부터 로컬상의 쿠키에 토큰 정보하고 유저 정보를 같이 저장하지 왜 토큰 정보만 저장하는지 궁금하실 거 같은데요.

맞습니다. 두 개 다 저장해도 됩니다.

그런데 저는 토큰 정보만 저장했는데요.

왜냐하면, 토큰과 유저정보의 데이터 크기가 너무 컸고,
두 번째, 로컬상의 쿠키에 있던 세션 정보와 Supabase 서버상에 있는 세션 정보를 나중에 middleware 형식으로 체크하는 코드를 만들고 싶어서 일단은 토큰 정보만 저장했습니다.

실제로 로컬상의 쿠키에 토큰 정보와 함께 유저이메일 같은 몇 가지 정보만 같이 저장하고 사용해도 크게 문제가 없습니다.

그렇게 하려면 login 컴포넌트의 action 함수에서 session_key 부분에 원하는 정보를 저장하고 나중에 불러서 사용하면 충분합니다.

일단 저는 테스트를 위해 토큰 정보만 쿠키에 저장했습니다.

index.tsx 파일에서는 유저의 로그인 정보에 따라 login 라우팅으로 갈지 유저 정보를 보여줄지 정해야 하는데요.

그래서 loader 함수를 아래와 같이 재작성합니다.

```ts
import { getUser } from "~/server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);
  return { user: user || null };
}
```

뭔가 간단한 코드로 작성했는데요.

핵심은 getUser라는 직접 만든 함수를 실제로 구현해야 한다는 겁니다.

예전에 만들었던 server.ts 파일에서 아래와 같이 getUser 함수를 구현합시다.

```ts
export async function getUser(request: Request) {
  const tokens = await getTokens(request);
  if (!tokens) return null;

  const sbServerClient = getServerClient(request);
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime >= tokens.expires_at) {
    const { data } = await sbServerClient.auth.refreshSession({
      refresh_token: tokens.refresh_token,
    });
    return data?.user;
  } else {
    const { data } = await sbServerClient.auth.getUser(tokens.access_token);
    return data?.user;
  }
}
```

여기 getUser 함수는 해당 리퀘스트(Request) 정보만 있으면 유저 정보를 얻을 수 있는데요.

해당 request로 getTokens 함수로 토큰 정보를 얻어오고, 만약 토큰 정보가 없다면 유저가 로그인하지 않았다는 걸 의미하기 때문에 null을 리턴하고 끝냅니다.

만약 토큰 정보가 있다면 다음 코드를 수행하는데요.

토큰이 만료가 되었다면 Supabase의 refreshSession 함수를 이용해서 세션을 리프레시해주고 있습니다.

refreshSession을 하면 다시 data 값에 토큰값과 user 값을 얻어 올 수 있습니다.

그리고 만약 토큰이 만료되지 않았다면 마지막에 있는 else 문에 의해 단순하게 getUser 함수를 access_token 정보를 이용해서 접근하고 있습니다.

이렇게 얻어온 user 정보를 return 하면 됩니다.

이 방식은 모든 라우팅에서 유저 로그인 여부를 아주 쉽게 확인할 수 있게 하는 아주 짧은 코드입니다.

signup.tsx 파일에서도 아래와 같이 loader 함수를 수정해야 합니다.

```ts
export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);

  if (user) {
    throw redirect("/home");
  }
}
```

가입하기 라우팅에서 유저가 로그인 상태로는 더 이상 가입할 필요가 없으니 home 라우팅으로 이동하는 게 당연하기 때문입니다.

또한 login.tsx 파일에서도 loader 함수를 아래와 같이 바꿔 주면됩니다.

```ts
export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUser(request);

  if (user) {
    throw redirect("/home");
  }
}
```

로그인을 중복으로 할 필요가 없기 때문입니다.

---

## 로그아웃 로직 수정하기

이제 logout.tsx 파일을 조금 수정해 보겠습니다.

```ts
import { redirect } from "react-router";
import type { Route } from "./+types/login";
import { logout } from "~/session.server";
import { getServerClient } from "~/server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Login" }, { name: "description", content: "Login Page!" }];
}

export async function loader({ request }: Route.LoaderArgs) {
  return redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const sbServerClient = getServerClient(request);
    await sbServerClient.auth.signOut();

    return logout(request);
  } catch (error) {
    console.error(error);
    return { error: "Failed to logout!" };
  }
}
```

우리가 session.server.ts 파일에서 만든 logout 함수는 destroySession 함수를 이용해서 쿠키를 지우는 함수입니다.

이 함수전에 Supabase의 로그아웃 함수는 signOut() 함수를 한번 실행해 주면 끝입니다.

---

지금까지 Supabase와 React Router V7의 유저 로그인 부분을 완벽하게 SSR 방식으로 구현해 봤는데요.

유저정보를 맨 처음에 쿠키상에 저장하는 로직이 트래픽 관리에는 훨씬 더 좋을 거 같네요.

여러분께서 그렇게 한번 만들어 보시기 바랍니다.
