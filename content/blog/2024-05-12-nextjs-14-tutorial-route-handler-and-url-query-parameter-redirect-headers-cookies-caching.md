---
slug: 2024-05-12-nextjs-14-tutorial-route-handler-and-url-query-parameter-redirect-headers-cookies-caching
title: Next.js 14 강좌 8편, 라우트 핸들러에서 URL 쿼리 파라미터와 redirect, Headers, Cookies 그리고 캐싱 방식 알아보기
date: 2024-05-12 10:53:04.153000+00:00
summary: 라우트 핸들러의 고급 동작 알아보기, redirect, 쿼리 파라미터, Headers, Cookies, Caching
tags: ["next.js", "route handler", "redirect", "url query parameter", "headers", "cookies", "caching"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 여덟 번째입니다.

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

- [redirect](#redirect)
- [Headers](#headers)
- [Cookies](#cookies)
- [라우터 핸들러에서의 캐싱](#라우터-핸들러에서의-캐싱)

---


지난 시간에는 Next.js 14의 라우트 핸들러 기본에 대해 배웠는데요.

오늘은 조금 더 고급 기법에 대해 알아보겠습니다.

먼저, URL 쿼리 파라미터인데요.

지난 시간에 동적 라우트 핸들러를 이용해서 id 별로 데이터를 선별했는데요.

이런 방식 말고 URL에 특정 변수 값을 적용해서 원하는 데이터를 선별하는 방법도 있습니다.

웹에서는 이걸 쿼리라고 하는데요.

URL에 ? 를 쓰고 그다음에 A=B 라는 식으로 쓰면 변수 이름과 데이터 값으로 파싱이 가능합니다.

예를 들어, comments에서 'first'라는 글자를 찾고 싶다면 아래와 같이 하면 됩니다.

```sh
http://localhost:3000/comments?query=first
```

위에서 보면 물음표(?) 뒤에 A=B 형식으로 썼습니다.

A는 query가 되고 B는 first가 되는 거죠.

모두 다 string 타입입니다.

웹에서는 form에 number 값을 지정할 수 있지만 그 외에는 모두 string 방식으로 데이터를 넘겨줍니다.

A 값으로 query라고 정했지만 'q'라고 정해도 됩니다.

프로그래머 마음입니다.

이걸 기존에 만들었던 GET 라우트 핸들러에서 처리해 보겠습니다.

기존에 comments 폴더 바로 밑에 있었던 route.ts 파일의 GET 함수는 아래와 같은데요.

```ts
export async function GET() {
  return Response.json(comments);
}
```

위 코드를 조금 더 수정해 보겠습니다.

```ts
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  const filteredComments = query
    ? comments.filter((comment) => comment.text.includes(query))
    : comments;

  return Response.json(filteredComments);
}
```

위와 같이 GET 함수의 인수에 request를 넣어줬습니다.

이 request는 예전에 POST에서 쓰던 HTTP의 기본 Request가 아닙니다.

Remix는 HTTP 기본 Request를 쓰지만 Next.js에서는 조금 변형된 걸 씁니다.

그래서 request의 타입이 NextRequest이죠.

query를 얻는 방법은 웹 표준 방법과 같은데 대신 nextUrl을 쓰죠.

```ts
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
```

위와 같이 하면 Next.js에서 query 값을 얻게 됩니다.

그리고 마지막으로 filter 메서드를 이용해서 쿼리 값이 들어간 comment를 찾아주면 되는 거죠.

실행 결과를 볼까요?

브라우저에서 살펴보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiljXwPE46HLiS6gPicJfN1wUz3jH8uGfQ7MdBfW1N5jUBE0CugABcWcCE4C_ZUFLxSBntimY_lpUTi0FL5BoBvi_kl8KC2FRKRebEEsb8bN6Ear9K-IpuNHK4Lsq7jdQZ80T3taqH_6vvn3TpkcanXYJh0XaJJwSb5XwN8ejN1OrobGSs7YRHM2K7ziTQ)

위와 같이 정상적으로 작동합니다.

당연히 아래 그림과 같이 query 부분을 없애도 예전 처럼 GET 함수가 작동하고요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjX634vz7J2Zbz7AKuqELDXmGvgzPBmJF4_AQNXDHyk68DsILRxvKFzeksAwgj36uhSPwOOdp76eMZRungNcf-dBQm5-8Ly5r_AqNir5ws8OzdeEo8NWhiy--QhJhjpfQs_QMa2dQZxamu00HQnIziUNDG5wZir9Hi2tBlNLCQU1gtojzDQ0Ip6WjhgGBc)

지금까지 URL 쿼리 파라미터에 대해 알아보았습니다.

---

## redirect

redirect는 라우팅을 다른 쪽으로 보내주는 Next.js의 함수인데요.

예를 들면 'comments/40' 처럼 에러가 발생하는 경우를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEg-pQGbX7sDSwusF35-aiL6-8-kR_ae2Tve__VPteARoeSVdkn9FG4YjrA-wEppATDEu0W5G_jdETSFzmN_KAa9SyMIdvErxyMI-DaLvrdYZKL0nbrlH6xxOcGv11tQqjzaaWs4A9i-oA5uug-Gl7Skq8787m-s9lan-RQTT8swNN34gItt_VKhySpOi0g)

위 그림과 같이 웹 페이지가 작동하지 않게 됩니다.

당연히 comments에서 40번은 없거든요.

이럴 경우 에러 체크를 해서 redirect 해주면 됩니다.

`comments/[id]` 폴더에 있는 route.ts 파일에서 GET 함수 부분을 아래와 같이 수정하겠습니다.

```ts
import { comments } from "../data";
import { redirect } from "next/navigation";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (parseInt(params.id) > comments.length) {
    redirect("/comments");
  }

  const comment = comments.find(
    (comment) => comment.id === parseInt(params.id)
  );

  return Response.json(comment);
}
```

추가된 부분은 'next/navigation'에서 redirect 함수를 import 했고, 그다음에 GET 함수에서 params.id를 comments의 전체 크기와 비교했습니다.

여기서는 단순하게 인메모리 배열을 DB로 쓰지만 만약 여러분께서 Prisma를 이용한 DB를 사용한다면 DB에서 데이터를 불러올 때 없는 경우를 상정하고 redirect를 쓰면 됩니다.

위 코드에서 id가 comments 배열보다 큰 숫자이면 "/comments" 라우팅으로 redirect하게 됩니다.

한번 테스트해 보십시요.

실제로는 이동 하는게 너무 빨라 안 보이는데요.

네트워크 탭을 보시면 이해가 될 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhUj6q73Vc5gpSHm5Q9310W8gjl1Ubk965i14lgcrFzqw755TZKAl7lqiI3ZGkiMcAF4Xpm1MMts0kXVcLDw5kD5buvCmdFgRnnAqSUvjMW75WsTe8GF8WEtYjKfK584u2evSlQ_Kf2gEvJbV6kXb7257HQpZAD3MaJ0orO5hIBZhTrhpom333Yg2D7hiQ)

위 그림과 같이 "4"라는 name으로 라우팅이 됐다가 바로 "comments"라는 라우팅이 됐다는 걸 파악할 수 있을 겁니다.

바로 "4"라는 라우팅에서 redirect가 발생해서 "comments" 라우팅으로 갔다는 의미죠.

---

## Headers

HTTP header는 API Request, Response의 메타데이터 같은건데요.

해당 리퀘스트(리스폰스)가 발생하면 해당 리퀘스트(리스폰스)에 관한 여러 가지 정보를 가지고 있고 우리가 headers에 특정 정보를 저장할 수 도 있습니다.

Request Headers에는 클라이언트 쪽에서 보내는 여러 가지 정보가 있고 그중에는 "User-Agent", "Accept", "Authorization" 이 있는데요.

"User-Agent"는 서버로 보내는 클라이언트의 브라우저 정보와 OS 정보가 있습니다.

그리고 "Accept"에는 텍스트, 비디오, 이미지 포맷 등 클라이언트가 처리할 콘텐츠 타입이 있습니다.

"Authorization"에는 서버 쪽에 보내는 인증 정보가 포함되어 있습니다.

반대로 Reponse Headers에는 서버에서 클라이언트로 보내는 메타데이터가 들어 있습니다.

"Content-Type"는 리스폰스의 미디어 타입 정보를 가지고 있습니다.

우리가 많이 쓰는 메타데이터인데요.

"application/json", "text/html" 등이 있습니다.

Thunder Client에서 Headers 부분을 살펴보겠습니다.

`profile/api` 라우팅으로 테스트해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEggVFehcdovURGF4KymjIVUYmQC_rLPNCuiDicEnwisYeOq6ob9rNpg6VZ-xOhhZlG09o2_9Kmw85tOvBkCow6j5XHGD1b59urpYkh9_k0S7z7GxDpamkeF_vqLqcvvZMaJzNfJZumuDbSZmvnW_1jo7x2JH62loxNKUME8QYe0i2S_lGDXXjsMkKt6Xe4)

위와 같이 Headers 부분에 "Accept"와 "User-Agent" 값이 있네요.

이제 테스트를 위해 `profile/api` 라우팅을 리퀘스트할 때 "Authorization" 부분을 추가해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEijgQtNm0Prhp-zL4vYATmfGfDMSR0UrcuTIzF4Umb7de5OS66fQXK__E4nE3KcnwtCeUEXw2yGn-Ft0XR2m_GPlRGI089mJQoEMTOSeNHUMATq79DaBpO_7p6h6RFekPZqSLTwa9mZ8koZQ4JgdQPX_El0OCKsRtq3CE4qy0dt70CEl3KJilX8LfNlkis)

위와 같이 "Authorization" 부분에 텍스트로 "Bearer 12345"라고 적었습니다.

아직 Send 버튼을 누르지는 마십시오.

그럼 이걸 처리하는 코드를 작성해야 하는데요.

클라이언트에서 Header 부분에 "Authorization" 부분을 추가해서 리퀘스트(Request) 해주고 있는데요.

그래서 GET 함수에서 Request를 불러서 "Authorization" 부분을 추출하면 됩니다.

다만 Next.js는 HTTP의 기본 Request를 쓰는 게 아니라 여기서도 NextRequest라고 Next.js가 직접 만든 걸 써야 합니다.

코드를 추가해 봅시다.

`profile/api/route.ts` 파일의 GET 함수 부분입니다.

```ts
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  console.log(requestHeaders.get("Authorization"));

  return new Response("Profile API page");
}
```

위와 같이 코드를 작성하면 됩니다.

이제 테스트해볼까요?

Thunder Client에서 send 버튼을 누르고 콘솔창을 보겠습니다.

```sh
Bearer 12345
 GET /profile/api 200 in 123ms
```

위와 같이 `/profile/api`  라우팅의 GET 메서드가 작동되었고 우리가 원했던 해당 자료도 함께 출력되었습니다.

이 방식 말고 Next.js에서 직접 제공하는 'headers' 함수가 있는데요.

이 함수를 사용하는 방법을 알아보겠습니다.

```ts
// import { type NextRequest } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  // const requestHeaders = new Headers(request.headers);
  // console.log(requestHeaders.get("Authorization"));

  const headerList = headers();
  console.log(headerList.get("Authorization"));

  return new Response("Profile API page");
}
```

위와 같이 하면 GET 함수 인자에 NextRequest를 쓸 필요가 없습니다.

headers 함수 호출하는 것만으로도 쉽게 데이터를 추출할 수 있는 거죠.

실행 결과는 똑같습니다.

```sh
Bearer 12345
 GET /profile/api 200 in 165ms
```

지금까지는 Request에서의 headers인데요.

Response에서의 headers를 알아보겠습니다.

브라우저에서 '/profile/api' 라우팅일 경우 네트워크 탭을 보면 Headers 부분에 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiu2T6D_6uc6Nk7rc19m-7autXWg5S6VZFVljjWLgbnR01kUdc2-lZA0JfeAa2F_fq9TSaVU6FTUCSFQzcdUCMRVpX1VMglvdLLEXwOSeS_FdIuOSwOYVb1aFacM0XxA4C8-WxE9yUDBkKKfQOWPT9uazoPKTNy08nQ6ab6Xb6gOgopRpwQLWLSmlirJng)

위 그림에서 알 수 있듯이 해당 Response의 'Content-Type'는 'text/plain'입니다.

왜냐하면 아래 코드처럼 그냥 텍스트를 Response로 리턴 했기 때문이죠.

```ts
return new Response("Profile API page");
```

그러면 아래 코드처럼 h1 태그로 Response를 리턴해 볼까요?

```ts
return new Response("<h1>Profile API page</h1>");
```

아마도 아래 그림과 같이 똑같이 텍스트 형태로 브라우저에 보일 겁니다.

Headers를 보면 'text/plain' 타입이기 때문이죠.

그러면 Response를 보낼 때 Headers를 지정해 보겠습니다.

```ts
  return new Response("<h1>Profile API page</h1>", {
    headers: {
      "Content-Type": "text/html",
    },
  });
```

위와 같이 Response 함수의 두 번째 인자로 객체를 넣어주는데, 거기에 headers 항목을 위와 같이 지정해 주면 됩니다.

이렇게 되면 서버가 리스폰스를 브라우저에 보내 줄 때 'Content-Type'이 'text/html'이라고 알려주기 때문에 브라우저는 아래와 같이 h1 태그로 렌더링 하게 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgcVicIdsF_P94jQygAwbQ9t3kDiVL9jaNPgJ-RRvvDMEHIJMyO2aKb0wUA7FAQO0eGvpP1PMZLweiGvciOTiXeRz-pw9SRB2_OJayDsVJHuEgvEIoHIWpdjrRSWicRHe1qqNAr95sBa5xVs0sUILFt5OgedY8_OgNoa2_lqJyZvSqYFwNKyKWbiLZJ8rM)

어떤가요?

이제 Reponse의 Headers를 이용해서 브라우저에 특정 Headers 정보를 넘길 수 있는 방법을 알게 되었습니다.

---

## Cookies

쿠키는 서버가 브라우저에 보낼 수 있는 아주 자그마한 데이터인데요.

쿠키는 브라우저가 로컬 시스템에 저장할 수 있고, 다시 이 쿠키를 다음 Request 때 서버에 돌려보낼 수도 있습니다.

쿠키의 목적은 보통 다음과 같은 목적에 사용됩니다.

- 세션 매니지먼트(로그인 또는 쇼핑 카트)
- 유저가 지정한 정보(테마)를 저장
- 구글 애널리틱스와 같이 유저 행동 분석에 사용

이제 쿠키를 설정하고 가져오는 방법에 대해 알아보겠습니다.

Reponse에 "Set-Cookie" 부분을 headers에 추가하면 됩니다.

테스트를 위해 아까 Headers 부분에서 사용했던 코드에 "Set-Cookie" 부분을 추가해 보겠습니다.

```ts
return new Response("<h1>Profile API page</h1>", {
    headers: {
      "Content-Type": "text/html",
      "Set-Cookie": "theme=dark",
    },
  });
```

쿠키를 지정할 때도 A=B 방식을 사용합니다.

이제 Thunder Client에서 살펴봅시다.

`http://localhost:3000/profile/api` 주소에서 send 버튼을 누르면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiTeVR68u649Y_hrDCp16JQIqud7jK-kj8vM4AGZQ9lvjvu9h-P40qP7vEBfrA-djBjCGKefEuVGfC_5u-6cLx5VMVHzQVyAvXACi2Tk5rfgPtGryMKGlAq8js2NHVoljTMXyiZG_5yeVJfBRDYLF3HpZm5GruKxXi8b4KreZWCP8KBQNKvcif6k153mdY)

위 그림은 Headers 부분인데요.

여기서도 set-cookie 부분이 나오고 아래 그림과 같이 Cookies 부분에도 따로 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjJBaOm4K48icx7shvJlMXVdK6KYEh_h-PV7-09gZHXZPG3OHQJGUxobjtG9PLQovEz6NF0Uen_lJZWQ2itRjvgcrX2AB0s57qzCgcmfoSHx9TnwNY8JFrkeLIXXuUYZn2bK3n2VPXmiuLg3-Bz6zw4-9zLhCFRpR2YTuFkLIJd1U0oe4mEcYaKG54Y-2Y)

이제 Response를 통해 서버에서 클라이언트로 쿠키를 보내는 방법을 배웠으니까, 반대로 클라이언트에서 서버로 보내는 Request(리퀘스트) 부분에서 사용하는 방법을 알아보겠습니다.

제가 쓰는 브라우저에 theme 쿠키가 있어 이번에는 theme-test 라는 이름으로 테스트했습니다.

```ts
import { type NextRequest } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  // const requestHeaders = new Headers(request.headers);
  // console.log(requestHeaders.get("Authorization"));

  const headerList = headers();
  console.log(headerList.get("Authorization"));

  const theme = request.cookies.get("theme-test");
  console.log(theme);

  return new Response("<h1>Profile API page</h1>", {
    headers: {
      "Content-Type": "text/html",
      "Set-Cookie": "theme-test=dark",
    },
  });
}
```

브라우저에서 실행해 보면 개발 서버 터미널 창에 아래와 같이 나옵니다.

```sh
{ name: 'theme-test', value: 'dark' }
 GET /profile/api 200 in 13ms
```

위와 같이 잘 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhOAGqIWWook9xJzRIAclRjQ4XpaWMpu7TssNUqp-u6bPsDbISll4FUgG2CVIV1jM2ojA7Zm0FpnV5DBfO5m-cIMML2Sa-8Ru6ROd2CjabDOuzeE8s7o28apvDXebSui2EogAoZUOgFlAtzlJlH2YdX_FKKkB8VNYGBVzkEW5MF7yGJNKwTEz8CvmM2d00)

위 그림과 같이 쿠키 이름을 'theme-test'라고 바뀐 것도 잘 나옵니다.

쿠키는 Reponse 부분에서 먼저 받아서 브라우저가 설정한 겁니다.

그리고 쿠키가 있는 상태에서 다시 Request를 했기 때문에 쿠키가 보이는 거죠.

만약 새로운 브라우저에서 하면 아래와 같이 나올 겁니다.

```sh
null
undefined
 GET /profile/api 200 in 39ms
```

맨 처음 null이 나왔던 거는 Authorization 부분이고, 두 번째 undefined 부분이 바로 cookie입니다.

다시 브라우저를 새로고침 해보면 인제야 쿠키가 나오는데요.

```sh
null
{ name: 'theme-test', value: 'dark' }
 GET /profile/api 200 in 24ms
```

위와 같이 나오는데 역시 "Authorization" 부분은 null 입니다.

왜냐하면 Thunder Client에서 리퀘스트할 때 "Authorization" 부분을 추가했기 때문이죠.

브라우저상에서는 리퀘스트할 때 Headers 부분에 "Authorization" 부분을 추가할 수 없기 때문입니다.

지금 사용한 쿠키 얻는 방식은 Reqeust에서 쿼리를 얻는 건데요.

아까 headers 함수처럼 Next.js는 직접 cookies 함수를 제공해 줍니다.

다시 코드를 짜보면,

```ts
import { type NextRequest } from "next/server";
import { headers, cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const headerList = headers();
  console.log(headerList.get("Authorization"));

  const theme = request.cookies.get("theme-test");
  console.log(theme);
  
  cookies().set("currentPage", "10");
  console.log(cookies().get("currentPage"));

  return new Response("<h1>Profile API page</h1>", {
    headers: {
      "Content-Type": "text/html",
      "Set-Cookie": "theme-test=dark"
    },
  });
}
```

위 코드를 보시면 Next.js가 제공해 주는 cookies 함수를 이용해서 직접 쿠키도 지정할 수 있고, 가져올 수도 있습니다.

브라우저에서 새로고침 해보면 아래와 같이 나옵니다.

```sh
null
{ name: 'theme-test', value: 'dark' }
{ name: 'currentPage', value: '10', path: '/' }
 GET /profile/api 200 in 126ms
```

위와 같이 request를 이용한 쿠키 set, get 방식과 cookies라고 Next.js가 제공해 주는 함수를 이용할 경우 모두 정상적으로 작동하고 있습니다.

참고로 Next.js가 제공해 주는 cookies 함수는 아래와 같이 여러 가지 메서드를 제공해 줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjclHQrFV7WZJOaDEGrw6JH4ifNZn4VxLo4V8BQiXWVGCsMdoMiQZFsHomBUoT5WX5NYKCliD48OIelsZvWMLZzbPghg9vkaTr7rcCNNBchv_SFf0XccXUtlQztpKjGWS30_c7_o1cOQEX3l1qBb97hs9U6lYFVj26muJc98-7O4AedGOkr8GYO6rRWSYI)

위 그림에서 보면 has 메서드가 있는데 이걸 아마 많이 쓸 겁니다.

---

## 라우터 핸들러에서의 캐싱

라우터 핸들러에서의 캐싱 부분을 살펴보겠습니다.

먼저, app 폴더 밑에 time 폴더를 만들고 아래와 같이 route.ts 파일을 만듭시다.

```ts
export async function GET() {
  return Response.json({
    time: new Date().toLocaleTimeString(),
  });
}
```

현재 시간을 리턴하는 함수입니다.

브라우저에서 테스트해보면 아래와 같은데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi3zy5e7z1uFuPGmgV665CVqNuLlN5L2MqeYKJ9c7No1rj-T-t5KdYeyW4Ov7K3Xr9akRsF-r_JscJHSFbmO3w1cLZNSKEmiTD571VWSbFdt6sfMTCm6iXWc2-zH05N-tNUEemfqkFJ9EwH61I1uPwIo2PEiWf4EfIFDwm-wG_BaX0u839ewJuVUJpeTxk)

![](https://blogger.googleusercontent.com/img/a/AVvXsEg-hLbUxJ2zHUfJTX9SMFokXE3IMKRQojzyVQgg5d_e-_nXYLzLLJXWX_gmPfhQRkTAlVKe0O1IpRTnL7M04w1R6XsBaZfeUVLZ4ecaZtCNk595Ql_wTGuM0QEiSX8EjcQidrXN_txBL53u-irlf2jvnUa0XmnS8vV_gEWLyRIJG9z3Es_fASd7kpkoTcQ)

위 두 그림을 보면 알 수 있듯이 브라우저를 새로 고침하면 시간이 변하는 걸 볼 수 있습니다.

이제 개발 서버를 끄고 빌드해 봅시다.

```sh
npm run build

> route-handlers-demo@0.1.0 build
> next build

  ▲ Next.js 14.2.3

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
 ✓ Generating static pages (10/10)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                              Size     First Load JS
┌ ○ /                                    5.29 kB        92.2 kB
├ ○ /_not-found                          871 B          87.8 kB
├ ƒ /comments                            0 B                0 B
├ ƒ /comments/[id]                       0 B                0 B
├ ○ /hello                               0 B                0 B
├ ○ /profile                             137 B          87.1 kB
├ ƒ /profile/api                         0 B                0 B
└ ○ /time                                0 B                0 B
+ First Load JS shared by all            87 kB
  ├ chunks/23-0627c91053ca9399.js        31.5 kB
  ├ chunks/fd9d1056-2821b0f0cabcd8bd.js  53.6 kB
  └ other shared chunks (total)          1.86 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

이제 빌드한 걸 아래 명령어로 실행해 볼까요?

실제 프로덕션일 경우를 상정하는 겁니다.

```sh
npm run start

> route-handlers-demo@0.1.0 start
> next start

  ▲ Next.js 14.2.3
  - Local:        http://localhost:3000

 ✓ Starting...
 ✓ Ready in 259ms

```

이제 브라우저에서 time 라우팅으로 가서 시간을 살펴보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgKykFCjm6t599dAM6EBxKG2dipo8nVmh3jJTWQvj7qvudFvKcFeqDLfXppPyq__zDf5XP63H7WnSxTep4XS9BvfRSgkPteVD3z4QY2t8iwEWnmf1Vo6tdBcQgZePfQ0f8X6edF9skYu2_-kte90UPeTzygPUGGKHXKyHnKISvSbPBGcG_leKNWWj0s-x0)

위 그림처럼 아무리 새로 고침해도 시간은 변하지 않는데요.

왜 그런 걸까요?

바로 Next.js가 GET 메서드를 대하는 방식이기 때문입니다.

Next.js는 Response 객체를 GET 메서드로 사용하면 라우트 핸들러가 디폴트 값으로 캐싱됩니다.

그러면 캐싱을 피할 수 있는 방법은 없을까요?

1. Segment Config Option을 사용하면 됩니다.

time 폴더의 route.ts 파일에 아래와 같이 dynamic 값을 export 하면 됩니다.

```ts
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    time: new Date().toLocaleTimeString(),
  });
}
```

dynamic 값은 디폴트 값이 'auto'인데요.

위와 같이 'force-dynamic'이라고 하면 캐싱을 피할 수 있습니다.

이제 새로 빌드해서 서버를 product 모드로 돌려보면 시간이 변하는 걸 알 수 있을 겁니다.

2. Request 객체로 GET 메서드를 사용하는 겁니다.

즉, URL 파라미터를 사용하는 겁니다.

3. headers(), cookies() 함수를 사용하는 겁니다.
4. GET 이외의 메서드로 HTTP를 사용하는 겁니다.

---

지금까지 Next.js 라우트 핸들러의 고급 부분에 대해 살펴보았습니다.

그럼.
