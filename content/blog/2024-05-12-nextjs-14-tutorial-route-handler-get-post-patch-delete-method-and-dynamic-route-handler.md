---
slug: 2024-05-12-nextjs-14-tutorial-route-handler-get-post-patch-delete-method-and-dynamic-route-handler
title: Next.js 14 강좌 7편. 라우트 핸들러의 기본(GET, POST, PATCH, DELETE)과 동적 라우트 핸들러 알아보기
date: 2024-05-12 08:04:09.652000+00:00
summary: 라우트 핸들러의 기본 부터 동적 라우트 핸들러 작성까지 배워보기
tags: ["next.js", "route handler", "dynamic route handler"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 일곱 번째입니다.

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

- [라우트 핸들러](#라우트-핸들러)
  - [라우트 핸들러의 기본](#라우트-핸들러의-기본)
  - [라우트 핸들러의 속성](#라우트-핸들러의-속성)
  - [GET 리퀘스트](#get-리퀘스트)
  - [POST 리퀘스트](#post-리퀘스트)
  - [동적 라우트 핸들러(Dynamic Route Handlers)](#동적-라우트-핸들러dynamic-route-handlers)
  - [PATCH 라우트 핸들러](#patch-라우트-핸들러)
  - [DELETE 라우트 핸들러](#delete-라우트-핸들러)

---

## 라우트 핸들러의 기본

Next.js에서는 라우트 핸들러(Route Handler)라는 기능을 사용하여 라우트에 대한 커스텀 리퀘스트 핸들러를 만들 수 있습니다.

쉽게 말해 라우트 핸들러는 페이지 라우터의 API 라우트와 유사한 개념입니다.

HTML 콘텐츠로 응답하는 예전 Page Router와는 달리, Next.js 14 App Router의 라우트 핸들러를 통해 RESTful한  엔드포인트를 생성하여 Response에 대한 완전한 제어가 가능합니다.

Next.js의 라우트 핸들러의 장점으로는 별도의 서버를 만들고 설정해야 하는 오버헤드가 없이 프레임워크가 자체적으로 해결해 줍니다.

그래서 라우트 핸들러는 외부 API 요청을 할 때 아주 유용한데요.

그리고 라우트 핸들러는 서버 측에서 실행되므로 개인 키와 같은 민감한 정보가 브라우저로 전송되지 않아 보안성이 높습니다.

그럼 실제 테스트를 통해 Next.js 14 라우트 핸들러를 배워보겠습니다.

지난 시간까지 만든 템플릿이 너무 복잡해서 아래처럼 새로운 프로젝트를 생성합시다.

```sh
npx create-next-app route-handlers-demo
```

그리고 src/app 폴더 밑에 hello 폴더를 만들고 그 밑에 route handler 파일인 route.ts 파일을 만듭니다.

route.ts 이름은 Next.js에서 라우트 핸들러를 만들기 위한 관습이라 꼭 지켜야 합니다.

```ts
export async function GET() {
  return new Response("hello world");
}
```

위와 같이 'GET'이란 이름의 함수를 export 하면 되는데요.

당연히 async 방식으로 작성해야 합니다.

'GET'이란 이름을 HTTP의 Get 메서드에서 가져온 겁니다.

그래서 'POST'라는 이름으로 export 하면 그 라우트 핸들러는 HTTP의 Post 메서드에 대응한다고 보면 됩니다.

'PATCH', 'DELETE' 등도 HTTP 메서드이기 때문에 이 이름을 사용해서 함수를 export 해도 라우트 핸들러가 됩니다.

이제 개발 서버를 돌리고 브라우저에서 아래 주소로 이동해 봅니다.

```sh
http://localhost:3000/hello
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLwnObv8wjCBpw0JZMHROWs2robTRPCCjwmWNM2GsmZ_9qcli-0k0QQzWVh3P4hmVl9vDcEPZJ8kCrsgIEbCGNLRl-pq6UzPXrGm_gAmo5LeaDNDWAoR-ZpYtAlp3U7zoW24O__3TuWG9opJhdDSEpL2q48TBlyTZNVc-xlsvmBa7vrXpWC6sp65Qlkd8)

그러면 위와 같이 나옵니다.

---

## 라우트 핸들러의 속성

Next.js 14에서의 라우트 핸들러는 app 폴더 밑에 폴더를 만들고 그 밑에 route.ts 파일을 갖다 놓으면 되는데요.

폴더 밑에 폴더도 가능합니다.

예를 들어 `app/dashboard/user`라는 폴더가 있으면 먼저, `dashboar/route.ts` 파일도 있고 `dashboard/user/route.ts` 파일도 있다고 하면, 아래 주소 두 개 모두 유효합니다.

```sh
http://localhost:3000/dashboard

http://localhost:3000/dashboard/user
```

즉, Nested 폴더로 라우트 핸들러를 작성할 수 있다는 뜻이죠.

두 번째 중요한 속성은 예를 들면서 설명해 보겠습니다.

만약, profile이란 폴더에 page.tsx 파일과 route.ts 파일 두 개 모두 있다면 어떻게 될까요?

```ts
// src/app/profile/page.tsx

export default function Profile() {
  return <h1>Profile Page</h1>;
}
```

```ts
// src/app/profile/route.ts

export async function GET() {
  return new Response("Profile API page");
}
```

즉, 위와 같이 있다고 해도 Next.js에서는 전혀 에러가 아닙니다.

그러면 `http://localhost:3000/profile` 주소로 가면 뭐가 먼저 나올까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi6H3RBsDyOjRO5x5UmBlLFLC0oybfOfQVPUC2ZhDg1ILqlvQ2wdXnOoP6sE1YgsP0x3CtkzNL6c6sr3wJw4OxpxYVGiLxBZy2XhdrKj-g7P1qL7-wprmcDMTj1ocXJRzkBhQt02Wm21V1cHp_8H1uYGfpw8QkwEQElgdI1HmEHc6xJNMgN_uXxHT_e8fo)

실행결과는 위와 같습니다.

만약 Next.js가 라우트 핸들러 중 GET 함수와 일반 페이지가 같은 주소를 가질 때 1순위로 접근하는 것이 바로 라우트 핸들러의 GET 함수입니다.

라우트 핸들러 중에서는 GET 함수 말고 다른 함수면 다르게 접근합니다.

왜냐하면 일반 리액트 페이지도 HTTP의 GET 메서드로 작동하는 거라서 그런 겁니다.

이럴 때 보통 라우트 핸들러를 profile 폴더 밑에 api 폴더를 만들고 그 밑에 이동시키는 방식으로 리액트 컴포넌트와 구별시킵니다.

---

## GET 리퀘스트

이제부터 본격적인 REST API 테스트를 위해 Thunder Client를 VS Code 안에 설치하겠습니다.

예전에는 Postman이라는 별도의 앱을 사용했었는데요.

VS Code 안에 익스텐션으로 여러 가지 좋은 게 존재합니다.

그중에서 Thunder Client를 추천드립니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhrOswflll6cJOUkUKUxUT9k2D1NIR2EIA7-Z4GZRYYi7QzoYVV5AvsMFaJJeycz9b6iAmshMGd-gKf_lm6d6qslWd1MZy3j7RI1K0dVh3-LYHOoUhV26ramgRVLy0xaGzRLmJfmYkcd-C-kyxIlILDpr9-vicUH8FZ7ZRr1cs4d93llmoht6C7QYv8WwQ)

보통 API를 만들 때는 DB에서 자료를 가져와서 JSON 형태로 돌려주는 형식이 많은데요.

테스트를 위해 인메모리 데이터를 이용하겠습니다.

먼저 comments 폴더를 만들고 그 밑에 아래와 같이 data.ts 파일을 만들겠습니다.

이 파일이 더미 데이터베이스가 되겠습니다.

```ts
export const comments = [
  {
    id: 1,
    text: "This is the first comment",
  },
  {
    id: 2,
    text: "This is the second comment",
  },
  {
    id: 3,
    text: "This is the third comment",
  },
];
```

이제 comments 폴더 밑에 라우트 핸들러 파일인 route.ts 파일을 만듭시다.

```ts
import { comments } from "./data";

export async function GET() {
  return Response.json(comments);
}
```

간단하게 data.ts 파일에 만들었던 comments 배열을 JSON 형태로 돌려주는 겁니다.

이제 VS Code에서 Thunder Client로 들어가서 New Request를 선택하고 주소를 써주면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgHqBWkVYM142beXo2fPhg7-LP9uuYb1h6ynbiZun4bSh4VUBqQoIS9n6Tp4hH_Brj8viUSu17a-XO6pvQ-ksBvIAg_8N1dMQNEodv2Gq2uXVCGwHJRlmO-qr3SJOP4VNBJeekoXSZahpbZW8GQvsy0G2Wd6TxJOOels8C8K3-mAPf3AiHKxOt_IvMBDLI)

위 그림을 잘 보시면 GET 메서드를 이용했고 주소는 `localhost:3000/comments`입니다.

우리가 Response.json 함수를 이용해서 json을 리턴했기 때문에 위 그림과 같이 json 형식의 데이터가 나온 겁니다.

---

## POST 리퀘스트

아까 GET 리퀘스트에 대해 자세히 살펴보았는데요.

두 번째로 POST 메서드에 대한 리퀘스트에 대해 대응해 보겠습니다.

먼저, Thunder Client에서 POST 리퀘스트 준비를 해보겠습니다.

New Request를 누른 다음 POST 메서드를 고르고 그다음 전달해 줄 데이터를 Body를 이용해서 보내줍니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiVryXnzUNxNgub43MSD5F1HcQrKUUY950MzQwpfwB5x25odHECO9LAolkUWWyDFFfG_WbAnWCok1v6bZilo3xjalx3lioLMWpjnpD8_iBQ6GxN7O79IkxMcUGMh5ugxLrM9RjvG8r6fe9n1uLnQGoDtSEUvHbGErjMXIoXELs1GX7RPpvuc-QvOnNwdsg)

위 그림과 같이 Body 쪽에서 JSON을 선택한 다음 아래 데이터를 넣어준 겁니다.

```json
{
  "text": "New comment"
}
```

우리가 POST 메서드로 넘겨줄 수 있는 게 JSON도 있지만 XML, Text, Form 등 다양한 방식이 있습니다.

보통은 Form에서 POST 메서드가 많이 일어나는데요.

오늘 우리는 JSON 형식을 사용해 보겠습니다.

위와 같이 하고 Thunder Client에서 send 버튼을 누르면 에러가 나올 겁니다.

에러는 `Status: 405 Method Not Allowed`입니다.

아직 POST 메서드에 대응할 코드가 없어서겠죠.

이제 만들어 봅시다.

예전에 만들었던 comments 폴더의 route.ts 파일에 POST 핸들러를 만들 겁니다.

그런데 여기에는 GET 핸들러가 있는데 괜찮을까요?

전혀 문제없습니다.

함수 이름이 틀리기 때문이죠.

```ts
export async function POST(request: Request) {
  const comment = await request.json();
  console.log(comment);

  const newcomment = {
    id: comments.length + 1,
    text: comment.text,
  };

  comments.push(newcomment);

  return new Response(JSON.stringify(newcomment), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 201,
  });
}
```

위와 같이 POST 핸들러를 작성했습니다.

POST 핸들러는 request라는 걸 받는데요.

이 request에 아까 Thunder Client에서 유저가 보내준 데이터가 있는 겁니다.

그러고 새로운 newcomment를 만들고 기존 comments 배열에 추가해 주고 그러고 나서 새로 추가된 newcomment를 리턴해 줍니다.

이제 Thunder Client에서 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEhq9fqp2WuEaNQak1hHgT1ZHchuWoYax4mPOqpQQufXO5fHmMv1M0fUw8Sy8dMf6PM-Sjcuofh1r1HvUOV6h2yN0H70YzWNi8H0pUjIVoGv65jK_6VpWW5lHvqmRYcybgoX4OeLukLOaJpo7seopelOV5e_zOdeksXasTUifUBpxZt0SAG32VeqZ1QvtDk)

위와 같이 성공적으로 작동하네요.

그리고 아까 만들어 놓았던 Thunder Client의 GET 핸들러 창에서 다시 send 버튼을 눌러보면 아래와 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjP_nBBhRaMU-FzTXTP45oS8IM3jdixrsVTYlAQYCV6okpHr02bkpNl7uap4LwoszVEFyyompKDWytEJqm6dTgODHY6kmgC6E6lv3UFC-Ahel2yBqpOrNzwaN2WPRgMvSpxZNPv0TGGCpIVrMnd6WONriLpwHrrZ8t6YXoKLgfcTYFCO8E_BtQNwt1ns24)

전체 comments 데이터에서 한 개가 추가되었네요.

참고로 console.log 한 부분이 있는데, 개발 서버의 콘솔창을 보면 아래와 같이 나올 겁니다.

```sh
{ text: 'New comment' }
 POST /comments 201 in 222ms
```

지금까지 잘 작동하고 있네요.

---

## 동적 라우트 핸들러(Dynamic Route Handlers)

지금까지 배운게 GET, POST 핸들러인데요.

다음에 남은게 바로 PATCH, DELETE 핸들러입니다.

PATCH는 수정할 때 사용하고, DELETE는 삭제할 때 사용합니다.

그런데, 수정할 때나 삭제할 때나 중요한 게 뭘 삭제해야 하는지 알려줘야 하는데요.

그래서 여기서 나오는 중요한 개념이 동적 라우트 핸들러입니다.

```sh
http://localhost:3000/comments/1
```

위와 같이 comments 다음에 숫자 1, 2, 3 등이 나오는 거죠.

그래서 이걸 만들려면 comments 폴더 밑에 `[id]` 폴더를 만들면 됩니다.

그러고 그 밑에 route.ts 파일을 만들면 되고요.

```ts
import { comments } from "../data";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const comment = comments.find(
    (comment) => comment.id === parseInt(params.id)
  );

  return Response.json(comment);
}
```

위와 같이 만들었는데요.

GET 함수의 인자로는 Request가 오고 그다음에 Context가 오는데요.

보통 위와 같이 Context에서 params만 디스트럭쳐링해서 씁니다.

Request는 사용하지 않았기 때문에 변수명 앞에 언더바를 붙여 놓았습니다.

이제 이 라우트 핸들러가 작동하는지 테스트해 볼가요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi6XRIn5xcyIcq8Jk8DbUmXQ3R9nk8gglHvdfOGJHV5Hw7nredjsgUE6B41uHe2MZt6skQnLYYJHYCXomEY5mUrS7frSxtqp9ERktgVemWvXWw0R5x3gDm2zu6Y_CjMLV1X1LfxCTEhlIZm-kBCUSRqO7L7mPViylDS7wESjFjItcweSS5eXsPchsiQiEs)

위와 같이 동적 라우트 핸들러도 잘 작동하네요.

---

## PATCH 라우트 핸들러

위에서 동적 라우트 핸들러에 대해 배웠기 때문에 이제부터 PATCH 라우트 핸들러를 배워보겠습니다.

PATCH는 수정한다는 의미인데요.

Thunder Client에서 PATCH 메서드를 고르고 아래 그림과 같이 Body 쪽에 수정할 데이터까지 넣어줍시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhYGHNCo3b6CZRvEQODhkLX-ySrGyeSP5dhhUKHvXoNuerwVbspcFF1jhRiNoPpBpjnFvcwIx4PtjRU0w5Rk8pn90wfOazt1YvalZoa_BPN0NCht8NJvlXxPHgdXtcPdrhD5_DpBP6t4Gq-UKBhbvsRThuRaBAi98zcUMCXv5iCZRM2kSRK2MY7evtViv4)

이제 테스트 준비는 끝냈고 코드를 작성해야겠죠.

아까 사용했던 `comments/[id]/route.ts` 파일에서 작성하시면 됩니다.

```ts
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { text } = body;

  const index = comments.findIndex(
    (comment) => comment.id === parseInt(params.id)
  );

  comments[index].text = text;

  return Response.json(comments[index]);
}
```

위 코드를 잘 보시면 request.json() 에서 body 부분만 가져오고 그 body에서 아까 Thunder Client에서 보냈던 JSON 내용의 text 부분만 가져옵니다.

그러고 전체 comments 중에서 해당 params.id 와 같은 comment를 찾아서 text를 바꿔치기해주는 거죠.

그러고 해당 comment를 리턴해주면 됩니다.

실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEix97bg-7Vq17uRba4HqRGRFS2L_p2IJ-VPbjnnqwlZIHchO1pd5Nffajk4mxmegCJn5b5LtOmjTMJ168FCV7O3DiWmSfurWrPMCPZYcclJGZFFC-pjo4nLbD-nD-qOFSaQCuk_V3bSLrguhg7GbKkvHCTw2kyFmMJj92IJuHGR16GMmUm_aQ1aJeQUR_I)

위와 같이 잘 PATCH가 되었네요.

---

## DELETE 라우트 핸들러

DELETE를 위해 Thunder Client에서 DELETE 메서드를 고른 다음 아래 그림과 같이 세팅해 놓읍시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjDOTLLVYg-b5oZW7-OIDafEvLi1xOKXw2pB1aQVunB9WvhIkYeUiD5HhmF_EO65l9b02_ngc10ETUAe7S2RF6CLz4rRdnRXWsnOqget0GPRcVFsdhtxZyPHpCrAepUq2y5oVOzlQe_jVrxigFEPnCQiFamxpoeQ3PHywVhXK42xzpQgggTpaoUbKZUpQc)

이제 코드를 추가해 보겠습니다.

아까와 같은 파일입니다.

`comments/[id]/route.ts` 파일에 추가하면 됩니다.

```ts
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const index = comments.findIndex(
    (comment) => comment.id === parseInt(params.id)
  );

  const deletedComment = comments[index];

  comments.splice(index, 1);

  return Response.json(deletedComment);
}
```

아까 PATCH 라우트 핸들러와 비슷합니다.

위와 같이 하면 되는데요.

배열의 splice 메서드를 이용해서 index 부분을 날려버리는 겁니다.

이제 테스트해 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEi4Qqw6Poyh6g2cbZPnhB8sSOXqh1Qig8a9cFLln1JL9n6HkM6IL5oxm3zxcMZNBd2Emz5JbVrGj_vGoC1w5gMIrWsRV3sHMVhHFQbXEN55bUrPJneFAZjU1eEejKGiaJphTYvVQMWKnl4JlshinJnIBZA6UdhcQJHWh469sW11D0xc4TLSywBmvu1KmLE)

위와 같이 삭제한 후의 결과창을 보시면 id 1번입니다.

그러고 comments 라우팅으로 GET 해보시면 아래와 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgAiHym9W97Jc3ae0YItL1xDrkCKkib0XqYu7XmdZ6ixzNwAUufckW1rVDnG8EQkJt_2oq2R5lQKZwhGAeAQjbl3_IBRERFmriTNq1f7eoNOrW1D7hc089W9q_M-KWSSwvBP2TadyqDHa_8vjsD_bIrGAz0s9o434sUUXDpaoxRjhhaTZeYGZwp23BlKKA)

1번 아이디가 사라졌네요.

DELETE 라우트 핸들러가 제대로 작동하고 있다는 방증입니다.

---

지금까지 Next.js에서 라우트 핸들러의 기본에 대해 알아봤는데요.

다음 시간에는 라우트 핸들러에서 조금 더 어려운 부분으로 들어가 보겠습니다.

그럼.
