---
slug: 2024-05-12-nextjs-14-tutorial-middleware-and-rewrite-cookies-headers-in-middleware
title: Next.js 14 강좌 9편. 미들웨어(middleware) 설정 방법과 미들웨어에서의 rewrite, cookies, headers 처리 방법
date: 2024-05-12 12:30:57.437000+00:00
summary: 미들웨어 설정 방법, redirect, rewrite, cookies, headers 사용 방법
tags: ["next.js", "middleware"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 아홉 번째입니다.

전체 강좌 리스트입니다.

1. [Next.js 14 강좌 1편. 라우팅의 모든 것](https://mycodings.fly.dev/blog/2024-01-13-nextjs-14-tutorial-1-all-about-routing)

2. [Next.js 14 강좌 2편. 레이아웃의 모든 것 and Link 컴포넌트](https://mycodings.fly.dev/blog/2024-01-14-nextjs-14-tutorial-2-all-about-layout-and-link-component)

3. [Next.js 14 강좌 3편. Template과 Loading 스페셜 파일](https://mycodings.fly.dev/blog/2024-04-20-nextjs-14-tutorial-template-and-loading-ui-special-files)

4. [Next.js 14 강좌 4편. 에러(Error) 처리의 모든 것](https://mycodings.fly.dev/blog/2024-04-27-nextjs-14-tutorial-all-about-error)

5. [Next.js 14 강좌 5편. 병렬 라우팅(Parallel Routes), 일치하지 않는 라우팅(Unmatched Routes), 조건부 라우팅(Conditional Routes) 알아보기](https://mycodings.fly.dev/blog/2024-04-28)

6. [Next.js 14 강좌 6편. 인터셉팅 라우팅(Intercepting Routes)과 병렬 인터셉팅 라우팅(Parallel Intercepting Routes) 살펴보기](https://mycodings.fly.dev/blog/2024-05-04-nextjs-14-tutorial-6-intercepting-routes-and-parallel-intercepting-routes)

7. [Next.js 14 강좌 7편. 라우트 핸들러의 기본(GET, POST, PATCH, DELETE)과 동적 라우트 핸들러 알아보기](https://mycodings.fly.dev/blog/2024-05-12-nextjs-14-tutorial-route-handler-get-post-patch-delete-method-and-dynamic-route-handler)

8. [Next.js 14 강좌 8편, 라우트 핸들러에서 URL 쿼리 파라미터와 redirect, Headers, Cookies 그리고 캐싱 방식 알아보기](https://mycodings.fly.dev/blog/2024-05-12-nextjs-14-tutorial-route-handler-and-url-query-parameter-redirect-headers-cookies-caching)

9. [Next.js 14 강좌 9편. 미들웨어(middleware) 설정 방법과 미들웨어에서의 rewrite, cookies, headers 처리 방법](https://mycodings.fly.dev/blog/2024-05-12-nextjs-14-tutorial-middleware-and-rewrite-cookies-headers-in-middleware)

10. [Next.js 14 강좌 10편. CSR부터 SSR, RSC까지 React의 렌더링의 역사 살펴보기](https://mycodings.fly.dev/blog/2024-05-14-nextjs-14-tutorial-all-about-rendering-csr-ssr-rsc)

11. [Next.js 14 강좌 11편. 렌더링 라이프사이클(Rendering Lifecycle)과 서버 렌더링 전략 세가지(정적 렌더링, 다이내믹 렌더링, 스트리밍)](https://mycodings.fly.dev/blog/2024-05-15-nextjs-14-tutorial-rendering-lifecycle-static-dynamic-rendering-and-streaming)

12. [Next.js 14 강좌 12편. 서버 컴포넌트 패턴 - 서버 전용 코드(server-only), 써드 파티 패키지, 컨텍스트 프로바이더(Context Provider) 활용하기](https://mycodings.fly.dev/blog/2024-05-15-nextjs-14-server-component-patterns-server-only-third-party-package-context-provider)

13. [Next.js 14 강좌 13편. 클라이언트 컴포넌트 패턴 - 클라이언트 전용 코드(client-only), 컴포넌트 배치, 서버-클라이언트 컴포넌트 섞어 활용하기](https://mycodings.fly.dev/blog/2024-05-15-nextjs-14-tutorial-client-component-patterns-client-only-client-component-placement-interleaving-server-and-client-components)

---

** 목 차 **

- [matcher 설정 방법](#matcher-설정-방법)
- [조건 설정 방법](#조건-설정-방법)
- [rewrite](#rewrite)
- [cookies in 미들웨어](#cookies-in-미들웨어)
- [headers in 미들웨어](#headers-in-미들웨어)

---

Next.js의 미들웨어는 매우 강력한 기능인데요.

애플리케이션 내에서 Request와 Response를 가로채고 제어할 수 있는 아주 확실하고 견고한 방식을 제공합니다.

미들웨어는 전역 수준에서 이루어지며, redirect, URL rewrites, 인증, 헤더 및 쿠키 관리 등의 기능을 크게 향상할 수 있습니다.

그럼, 본격적인 middleware 강좌를 이어 나가겠습니다.

---

## matcher 설정 방법

Next.js 파일에서 미들웨어는 src 폴더 밑에 middleware.ts 파일을 작성하면 됩니다.

작성할 함수는 middleware 함수이고, 또 특별하게 matcher config 객체를 export 해야 합니다.

matcher는 영어 뜻 그대로 매칭되는 건데요.

아래 예를 봅시다.

```ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: "/profile",
};
```

코드를 보면 config 객체에 matcher 부분이 "/profile" URL입니다.

즉, Next.js 앱에서 URL이 "/profile"이면 즉, 매칭되면 미들웨어 함수가 작동된다는 겁니다.

미들웨어 함수를 잘 보시면 Response를 이용해서 redirect 해주고 있는데요.

이때 NextResponse라는 객체를 사용합니다.

Next.js에서 HTTP의 기본 Response를 약간 변형시킨 겁니다.

실제로 코드를 테스트해 볼까요?

브라우저에서 "/profile" 주소로 가보면 다시 "/" 페이지로 가는데요.

네트워크 탭을 보시면 분명히 profile 주소로 갔던 게 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjhPRazGqvIRiv25UT-iqjCGDip0PZxl6SX-2Xj1umMptnBjIb_fnKVkyHJqo_1mRD3ip-4hXGrWgcFDiMn_eOa0Js0O3WVYtEapN28GLxVwShavFqF8yRMjzYvWGfHAfJsBpa-UxYYDtLl7adB0KRvN2IH9t97Bdn6eULanL34FMZW1Eqr78C3aq9fHbw)

위 그림과 같이 미들웨어가 정상적으로 작동하네요.

---

## 조건 설정 방법

미들웨어를 config 객체의 matcher 방식으로 제어했다면 아예 if 문을 이용해서 제어해도 됩니다.

아까 미들웨어 파일을 다시 고쳐 보겠습니다.

```ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/profile") {
    return NextResponse.redirect(new URL("/hello", request.url));
  }
}
```

위 코드와 같이 이제는 아예 "/hello" 라우팅으로 보냈습니다.

실행 결과를 보시면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiu3KMY2v-nwVrEzqhjX9Q6VHkp0YHhox2HFFS4eapNqeg79viGkITosxj3-5ES_HvP9kmBjvVcQ0yHkdLh-IoDMbp4SHRUzMStumVRXfEF9bpmS7v0mMEav3BpAR_rzefnHgFYBElicwYrm5gNQiU1s2vz4Flrm0T3G3wjAhm4ChMNg9ZlhiT47gfrbvk)

위 그림에서 네트워크 탭을 잘 보시면 profile 라우팅이 존재하는 걸 볼 수 있을 겁니다.

---

## rewrite

NextResponse에는 redirect 함수만 있는 게 아니라 rewrite 함수도 있는데요.

이 두 함수의 차이점은 아래와 같습니다.

NextResponse.redirect와 NextResponse.rewrite는 모두 클라이언트 요청에 대한 응답을 수정하는 데 사용되지만, 그 동작 방식에 차이가 있습니다.

1. NextResponse.redirect(url, options)
- 클라이언트를 주어진 URL로 완전히 리디렉션 합니다.
- 브라우저는 새 URL을 가져오기 위해 전체 페이지를 새로 고칩니다.
- 301(영구 이동) 또는 307(임시 리디렉션) HTTP 상태 코드를 반환할 수 있습니다.

2. NextResponse.rewrite(destination, options) 
- 요청 URL을 다른 URL로 재작성(rewrite)합니다.
- 클라이언트에게 리디렉션되지 않고 서버에서 URL이 재작성됩니다.
- 브라우저는 원래 요청한 URL을 표시하지만, 서버는 재작성된 URL로부터 응답을 가져옵니다.
- 프록시 역할을 하여 다른 API 엔드포인트로 요청을 전달하는 데 유용합니다.

요약하면, redirect는 클라이언트를 완전히 다른 URL로 리디렉션하는 반면, rewrite는 서버 측에서 URL을 변경하고 원래 요청 URL을 유지하면서 변경된 URL에서 응답을 가져옵니다. 따라서 rewrite는 클라이언트 측 리디렉션 없이 백엔드 라우팅을 처리하는 데 유용합니다.

테스트를 위해 코드를 rewrite로 바꿔 보겠습니다.

```ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/profile") {
    return NextResponse.rewrite(new URL("/hello", request.url));
  }
}
```

실행 결과는 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEie9NAudJtaauyk6xtq-cTvZr_QqmNoT6Hntbf0Sk4qprZl9Y5Rwd2k1DZx_Cyb2pAUhkSI0IcdxfcJdhkOA-yvWXLDfLlYj1D635PzD8TKjzbSFH8BkXc5oGpDwTZ7o1aIriCbv8ssQfGRMWbvJ4uYqF_JxmDI4FcbiVpgM1BAegJT9OcVqBGP8WDn_ks)

위 그림을 잘 보시면 브라우저의 URL 부분은 profile이라고 나오고, 네트워크 탭도 profile만 나옵니다.

그런데 실제 내용은 hello 라우팅이죠.

아까 설명했듯이 rewrite는 서버에서 작업이 이루어지고 클라이언트에서는 해당 작업이 이루어지지 않는 데서 기인합니다.

---

## cookies in 미들웨어

미들웨어에서 cookies를 다루는 것도 간단한데요.

theme-test라는 테마 관련 쿠키를 themePreference라는 변수에 저장해서 관리해 보도록 하겠습니다.

```ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const themePreference = request.cookies.get("theme-test");
  if (!themePreference) {
    response.cookies.set("theme-test", "dark");
  }

  return response;
}
```

위 코드를 보시면 "theme-test"라는 쿠키를 가져오는데 만약 없다면 "dark"로 세팅합니다.

실제 테스트를 해보면 먼저 현재 상태에서 새로고침 없이 네트워크 탭이 아닌 애플리케이션 탭으로 가보면 쿠키란이 비어있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiGcjL3K0f6kQN48-sflAP1ehfYSH0h1hsYfUewxY2PHd0gLrEBPp0FiTU7RwWba_nEZIQeYvnvdFqyRHQe8cuWCGM6-V5xRzt0aeV4vyDyJ9wRNBN3I7BOmFpY0xYwyzmx-6Zy65C6RbzSqZWIzarPaz_pUC9rlnIy1lkSogz6kKsdW2oGhRR9mJUEfFk)

위와 같이 비어 있는 상태에서 아까 코드를 작성했다면 새로고침시 아래와 같이 쿠키가 보일 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi5dJFq_6hpWL7HLIet4cyD3kt_45hg3Ov2Ih7F6OT-1BBPmbJocnIimxV5Qp6gXucrsv-XAYNSZUOCpXnVATUpFIA5AY1rKsWcSNIQgQdydYNgQdE5XUXBujGjitMPt0C1jhdxkb_BR77NgQBUViazcK41RDFa2_4jXvXhyb5LZJjRE011KXR2flYBRKA)

위와 같이 미들웨어에서 쿠키 관련 제어를 성공적으로 작동시켰네요.

이제 브라우저에서 애플리케이션 탭에서 'theme-test'라는 쿠키 값을 직접 수정할 수 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj5H7n2Jtz-dbOsd4nuaj917IYJzgA5ctMeVlWObadPEpK1MLKs3SMr27VqlMsA2hNBzqcIU-E5WDg-KndTgqUIOt4cjZJrH9cN5d3eAN0DFAkjUfdXAdhTqVy1x8j0LppJJxyQs1bXYeiGhiScphUgqy5Obp8BbYZdiLwXOtxRyayYJ0SmUR55g5Ogt0w)

위와 같이 dark 값을 light 값으로 변경했습니다.

이제 다시 브라우저를 새로고침하면 "theme-test" 쿠키값이 dark로 변할까요? light 인 상태로 그대로 있을 까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjkGQH0vOinUtP02JZSUJb9nb-Rx9_fBKx_fjXLUiUzPQF6xXHAF6pyAoOJEA7wDD9o5mngqX9uzSpk6CDPuQKdm7Fv-MvyPKMfTJATLNCRFiyv1vBuMwgfU5GzrjDR_xoLuNlHCEkfpg7Z7Lm7KWQ7ka6mL1CXbGbu1nzV2kXNWvV7_6buppPZl8Zdce4)

위와 같이 쿠키값이 light로 변했습니다.

미들웨어에서 쿠키 관련 제어하는 명령이 정상적으로 작동했다는 거죠.

왜냐하면 현재 'theme-test' 쿠키값을 themePreference 값에 저장하는 게 제대로 작동했다는 뜻이기 때문이죠.

---

## headers in 미들웨어

headers 부분도 미들웨어에서 잘 작동하는데요.

코드를 변경시켜 보겠습니다.

```ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const themePreference = request.cookies.get("theme-test");
  if (!themePreference) {
    response.cookies.set("theme-test", "dark");
  }

  response.headers.set("my-header", "my-value");
  
  return response;
}
```

"my-header"이라는 Key 값을 지정했고 Value 값으로는 'my-value'라고 지정했습니다.

이제 어느 주소에서도 새로고침해보면 아래와 같이 Headers 부분에 잘 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg1FqYpKBaYAGm5nuRYBT9aRYFQLS7nq_CXYBPmLrcqwTSW57qpITS2z2sCMpRcIuBFKfLzN4OrJuJ5mgQNeLFYfz9lxavSxFUagD5dv-iOQuYoMANj0vlMGsZNakttvKT6BLbS__455QT0j1twcCZDIBpAE5asz5Ii-6r6Nsxr60IcGFDl7NOlyNnx-6U)

위 그림을 잘 보시면 제가 지정했던 Key 값은 'my-header'인데요.

브라우저에서는 'My-Header'라고 첫 글자가 대문자로 나옵니다.

그래서 지난 시간에 배웠던게 "Content-Type" 같이 첫 글자가 대문자로 나오는 거 같네요.

이렇게 Response에 특정 headers를 전송해 주면 클라이언트에서 자바스크립트를 이용해서 디버그할 때 아주 유용할 겁니다.

---

지금까지 Next.js의 라우팅 부분에 대해 총 9편에 걸쳐서 알아보았는데요.

다음 편에서는 렌더링 관련 공부를 해보겠습니다.