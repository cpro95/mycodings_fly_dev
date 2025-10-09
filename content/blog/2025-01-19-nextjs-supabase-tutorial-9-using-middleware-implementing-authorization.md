---
slug: 2025-01-19-nextjs-supabase-tutorial-9-using-middleware-implementing-authorization
title: Next.js 15, Supabase 강좌 9편. 미들웨어로 Authorization 페이지 구현하기
date: 2025-01-19 09:05:04.715000+00:00
summary: Next.js의 middleware를 이용해서 Authorization 구현해 봅시다.
tags: ["next.js", "authorization", "supabase", "middleware"]
contributors: []
draft: false
---

** 목 차 **

- [Next.js 15, Supabase 강좌 9편. 미들웨어로 Authorization 페이지 구현하기](#nextjs-15-supabase-강좌-9편-미들웨어로-authorization-페이지-구현하기)
  - [middleware 파일 만들기](#middleware-파일-만들기)
  - [미들웨어에 Protected 라우팅 추가하기](#미들웨어에-protected-라우팅-추가하기)

---

안녕하세요?

Next.js 15, Supabase 강좌 8편입니다.

아래는 지금까지의 강좌 리스트 전체입니다.

[Next.js 15, Supabase 강좌 1편. 유저 인증(Auth)을 위한 Next.js 15와 Supabase 템플릿 만들기](https://mycodings.fly.dev/blog/2024-12-29-nextjs-supabase-tutorial-1-making-template-and-omit-middleware)

[Next.js 15, Supabase 강좌 2편. Google OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-2-login-with-google-id-oauth)

[Next.js 15, Supabase 강좌 3편. Github OAuth를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-01-nextjs-supabase-tutorial-3-login-with-github-id-oauth)

[Next.js 15, Supabase 강좌 4편. email, password를 이용한 로그인 구현](https://mycodings.fly.dev/blog/2025-01-04-nextjs-supabase-tutorial-4-login-with-email-and-password-and-useactionstate)

[Next.js 15, Supabase 강좌 5편. 도메인 없이 Supabase에서 컨펌 이메일 보내기
](https://mycodings.fly.dev/blog/2025-01-11-nextjs-supabase-tutorial-5-sending-confirm-email-without-domain)

[Next.js 15, Supabase 강좌 6편. 이메일로 Reset Password 링크 보내기와 Update Password 로직 구현하기](https://mycodings.fly.dev/blog/2025-01-12-nextjs-supabase-tutorial-6-send-email-of-reset-password-and-implementing-reset-password)

[Next.js 15, Supabase 강좌 7편. 이메일로 Magic Link를 보내서 로그인 구현하기](https://mycodings.fly.dev/blog/2025-01-13-nextjs-supabase-tutorial-7-send-magic-link-and-login-with-supabase-brevo)

[Next.js 15, Supabase 강좌 8편. 이메일로 OTP를 보내서 로그인 구현하기](https://mycodings.fly.dev/blog/2025-01-19-nextjs-supabase-tutorial-8-send-otp-number-and-login-with-otp)

---

안녕하세요?

Next.js 15와 Supabase 강좌의 끝이 왔네요.

오늘은 지금까지 구현했던 로그인을 이용해서 Authorization을 구현해 보겠습니다.

지금까지 했던 거는 Authentication이라고 로그인과 관련한 로직인데요.

Authorization은 로그인한 유저에 따라 특정 페이지 접근을 제한하는 로직과 관련된 겁니다.

Next.js의 서버사이드 관련 자료를 보시면 이 Authorization 구현은 미들웨어를 사용하라고 하는데요.

Supabase와 Next.js 미들웨어를 통해 유저가 로그인되었을 경우만 접근 가능한 페이지를 구현해 보겠습니다.

먼저, app 폴더 밑에 'protected/page.tsx' 파일을 아래와 같이 만들어 protected 라우팅을 구현해 봅시다.

```ts
import React from "react";

const ProtectedPage = () => {
  return <div>This is a protected Page!</div>;
};

export default ProtectedPage;
```

이제 주소창에 'http://localhost:3000/protected'라고 치면 우리가 방금 만든 protected 라우팅에 접근할 수 있는데요.

로그인하던 안 하던 아무나 접근할 수 있는 게 문제입니다.

이제 미들웨어를 설정해서 로그인 유저만 protected 라우팅에 접근할 수 있도록 바꿔 보겠습니다.

---

## middleware 파일 만들기

Next.js 15 에서는 미들웨어는 src 폴더 밑에 middleware.ts 파일이름으로 작성하면 되는데요.

정확히는 app 폴더와 같은 위치에 두면 됩니다.

만약 src 폴더를 사용하지 않는다면 최상단 폴더가 그 위치가 되겠죠.

기억해 둘 것은 app 폴더와 같은 위치라는 점입니다.

```ts
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  return supabaseResponse;
};

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

일단 위와 같이 작성하면 Next.js와 Supabase에서의 미들웨어는 성공적으로 작성한 겁니다.

그러면 위 미들웨어에서 유저의 로그인 상태에 따라 특정 라우팅을 제한을 걸 수 있게끔 해야 하는데요.

참고로 미들웨어에서 config 객체를 export 했을 경우 특정 라우팅에 대해서는 미들웨어 작동을 제외시킬 수 있는데요.

위와 같이 config 객체에 matcher 값을 위와 같이 주면 불필요한 라우팅에 대해서는 미들웨어 작동을 제외시킬 수 있습니다.

---

## 미들웨어에 Protected 라우팅 추가하기

이제 미들웨어로 Protected 라우팅에 대한 해당 로직을 구현해 봅시다.

```ts
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/admin/settings", "/protected"];

export const middleware = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.includes(pathname);

  const session = await supabase.auth.getUser();

  if (isProtectedRoute && session.error) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return supabaseResponse;
};

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

일단 위 코드가 Full 소스코드입니다.

```ts
const protectedRoutes = ["/dashboard", "/admin/settings", "/protected"];
```

위와 같이 protectedRoutes 배열을 지정하면 됩니다.

그리고 request 객체에 있는 nextUrl.pathname을 이용해서 protectedRoutes 배열에 있는 값인지 체크하면 되는 거죠.

그리고 유저 로그인 여부는 getUser() 함수를 사용하라고 권장하고 있습니다.

supabase.auth.getSession() 함수를 통해 유저 로그인을 체크하라고 권장하지는 않는데요.

getSession 함수는 단순히 쿠키에 있는 세션 값을 읽어오는 거고, getUser() 함수는 실제로 Supabase 네트워크에 Request 해서 정보를 얻어오는 거라 꼭 getUser() 함수를 통해 유저 정보를 얻어오라고 권장하고 있습니다.

이제 protected 라우팅으로 접근했을 경우 로그인했을 경우에만 접근할 수 있을 겁니다.

---

지금까지 Next.js와 Supabase를 통해 Authentication 방법 즉, 로그인 방법과 오늘 다룬 Authorization 방법 즉, 특정 라우팅에 로그인 유저만 접근할 수 있게 하는 미들웨어 설정을 배워봤는데요.

이렇게 배운 Supabase Auth 관련 로직이면 여러분도 Full Stack 앱을 충분히 만들 수 있을 겁니다.

그럼.
