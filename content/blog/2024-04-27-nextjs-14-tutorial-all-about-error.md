---
slug: 2024-04-27-nextjs-14-tutorial-all-about-error
title: Next.js 14 강좌 4편. 에러(Error) 처리의 모든 것
date: 2024-04-27 11:31:35.125000+00:00
summary: Next.js 14 강좌 4편. 에러(Error) 처리의 모든 것
tags: ["next.js", "error"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 네 번째입니다.

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

- [Next.js 14 강좌 4편. 에러(Error) 처리의 모든 것](#nextjs-14-강좌-4편-에러error-처리의-모든-것)
  - [에러 핸들링(Error Handling)](#에러-핸들링error-handling)
  - [에러 리커버리(Error Recovering)](#에러-리커버리error-recovering)
  - [중첩된 라우팅에서의 error.tsx](#중첩된-라우팅에서의-errortsx)
  - [layout.tsx 파일에서 생긴 에러](#layouttsx-파일에서-생긴-에러)

---

## 에러 핸들링(Error Handling)

지금까지 Next.js 14의 Special Files에 대해 다음과 같은 것을 배웠는데요.

- page.tsx
- layout.tsx
- not-found.tsx    
- template.tsx
- loading.tsx

이제 에러 핸들링 관련 'error.tsx'라는 스페셜 파일에 대해 알아보겠습니다.

보통 웹페이지에서 에러는 서버 에러나 리퀘스트 에러 등 다양한 경우의 수가 나올 수 있는데요.

서버가 에러가 나면 화면에는 Next.js의 고유 에러 화면이 나타납니다.

테스트를 위해 기존에 만들었던 이중 중첩 다이내믹 라우팅에 강제로 에러를 발생시키는 코드를 만들고 Next.js 14의 에러 핸들링에 대해 알아보겠습니다.

다음 파일을 열어보시면 됩니다.

```sh
src/app/products/[productId]/reviews/[reviewId]/page.tsx
```

이 파일에 랜덤 넘버에 따라 강제로 에러를 방출하는 코드를 아래와 같이 만들겠습니다.

```js
// import { notFound } from "next/navigation";

function getRandomInt(count: number) {
  return Math.floor(Math.random() * count);
}

export default function ReviewDetails({
  params,
}: {
  params: {
    productId: string;
    reviewId: string;
  };
}) {
  //  console.log(params);

  const random = getRandomInt(2);

  if (random === 1) {
    throw new Error("Error occured when loading review ID");
  }

//   if (parseInt(params.reviewId) > 100) {
//      notFound();
//   }

  return (
    <>
      <h1>Product Id : {params.productId}</h1>
      <h1>Review Id : {params.reviewId}</h1>
    </>
  );
}
```

기존에 notFound() 테스트했었던 코드가 있는데 주석처리해도 됩니다.

getRandomInt 함수로 0,1이 리턴되는 랜덤함수를 만들고 그 값이 1일 경우 강제로 에러를 방출하게 코드가 짜여 있습니다.

브라우저에서 결과를 확인해 보면 정상으로 나올 수도 있는데요.

새로고침을 몇 번 하면 랜덤 속성상 한 번은 에러가 발생합니다.

브라우저에서 아래 주소로 이동해서 테스트해 보겠습니다.

브라우저 주소는 `http://localhost:3000/products/1/reviews/10` 입니다.

아래와 같이 두 가지로 나올 수 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEikDaSCPa8vKPAJ-15ZLPrWh-VCVUINPXBxWeU8dZAFE1ZglBbu3n6i530QyzF27BgM8yMw9_Nh3eNb48fcLsVaZi2PVW5IuQWbMJj5zUBjjqd3yBxL66opxZGtXfcLs2VeOwtv0ssmrbMv9iebXgetV3skqROQugZNB9IlhHVGZzxBFh-9Sgq3qpTLiIs)

![](https://blogger.googleusercontent.com/img/a/AVvXsEj-GN75PtWiCkpoZLUFMUqRHltKj0c-TKkqmUwhe-4GE3AA-7gBcfZJeDNyoiXjpEKMT6GKsYUVrSD8dMC8jLwZ8W5o59r8Pire_BAFYIvd3fe4uCfZh6S7IfJDDE1VNsV9NCLgd3u7EeeVimaRzM0LZ7R4lTpif5aU7gzGlD9isJAt2Q_4mueLqqGbBDw)

정상인 것과 에러 화면 두 가지입니다.

여기서 주목할 것은 에러 화면인데요.

코드까지 친절하게 보여주는데요.

바로 개발 모드라서 그렇습니다.

그러면 배포 모드에서는 어떻게 보일지 빌드 후 서버를 구동해 볼까요?

```sh
npm run build

npm run start
```

프로덕션 빌드 상태에서 서버를 실행해 보면 아래와 같이 나옵니다.

Next.js 14가 기본적으로 제공하는 에러 화면입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhQWuoTfj21KEsDD8xhnX9Yu3sh987plF5gY0w6q9CQBvyKgueOAq3zPwPZJsr7wVFCJaHFWMefuH53hFaWyDuIWZUh47s3JV69oa2m2WmMmYdJ65x7XVnjsOpocfFJhcx0_IusGCsed63KiKSkNnP8HWmjJEAvnW2c9nmjaV6jooOWWf_pdMelQGhR53M)

위와 같이 나오는데요.

서버 구동을 했던 터미널 창에는 아래와 같이 우리가 지정한 에러 코드 메시지가 잘 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqYTF040g2GboVyir4aKfoj9v_7N3bHCbxCu6q7YNGrB4vX075zqO8dUSFvdn1vu-2h3GolIJBysPC1o6XYgtzwbMxuzJ9c7k1KIMRfFDFuLcqPVTHwKH3j-pQwcV6BZnZcMMVcpki0v0Lq3YKgngvOf_2HYC6NW8Vr7NVxx5tKaEObvJjkP9EF7_DYnw)

먼저, 브라우저에 표시된 에러 화면을 보면 개발자라면 뭔 뜻인지 알겠지만 일반 사용자들은 위와 같은 화면을 끔찍이 싫어합니다.

그래서 일반 사용자들이 친숙하게 볼 수 있는 에러 페이지를 만들어야 하는데요.

이때 사용하는 스페셜 파일이 바로 'error.tsx' 파일입니다.

`[reviewId]` 폴더의 page.tsx 파일과 같은 위치에 'error.tsx' 파일을 아래와 같이 작성합시다.

```js
export default function ErrorBoundary() {
  return <div>Error Occured! Please go to root page!</div>;
}
```

Next.js 14에서 에러 관련 함수 이름은 ErrorBoundary 이름입니다.

위와 같이 단순하게 div 태그 안에 원하는 문구를 넣어 쉽게 작성할 수 있습니다.

이제 테스트를 위해 개발 모드로 들어가 볼까요?

몇 번 새로고침 하다 보면 아래와 같이 에러가 뜨는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhrRd7mHYaIjgje4ENsKPJB4chd_9uXtCIsUJ-uaK9VvsWCzjEkdErIClCJsjmF6WO_pb0Tw5RBBwz2Nsn3wmn65aCn5poPtoBH5TUT34hw98X71O9OySlBOzrNbcnTmVm4ECnFfYS7BQQpzmFEo97WevRSBIgGUs9WNPl-D6JB6m9y1mLgdm06IsqdP8U)

위와 같이 'use client' 관련 에러 메시지가 떴습니다.

error.tsx 파일은 무조건 클라이언트 파일로 작성해야 한다고 합니다.

다시 error.tsx 파일 맨 처음에 'use client' 디렉티브를 추가하겠습니다.

```js
"use client";

export default function ErrorBoundary() {
  return <div>Error Occured! Please go to root page!</div>;
}
```

이제 다시 브라우저에서 몇 번 새로고침 하면 기존에 얘기했던 에러 화면이 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhGAUUjNztfFFGfxo3h4ZwRzQ4VqYVxyflk37FihkeSB5LUmsZPguTCfZVNe8FPkTPKney_RF2i00sZzQ_qSivWuLvqk6qgPAgxPmcNOvtUdC3yKHUVhGaI5X2NUPK2qNVVH7D472jUHEjRNUnE_ucQkc4Gbn_0ue6rr0M11fiRJ5nPfS4Ct6_M7hgtQPI)

우리가 지정했던 에러 메시지도 화면에 잘 나오고 있고 무엇보다도 중요한 것은 우리가 중첩 다이내믹으로 작성한 라우팅의 UI를 깨지 않고 내가 만든 레이아웃 안에 에러 메시지가 존재한다는 겁니다.

이제 에러도 UI의 일종으로 취급할 수 있는 거죠.

홈으로 가는 간단한 링크만 ErrorBoundary 함수 안에 넣으면 아주 유용한 UI가 될 수 있습니다.

참고로 error.tsx 파일에 있는 ErrorBoundary 함수는 error 객체를 props로 받을 수 있는데요.

아래와 같이 코드를 수정해 봅시다.

```js
"use client";

export default function ErrorBoundary({ error }: { error: Error }) {
  return <div>{error.message}</div>;
}
```

그러면 아래와 같이 에러 메시지도 우리가 지정한, 즉, 에러가 발생한 시점 및 해당 에러에 대한 상세한 메시지 표현이 가능해집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEggshKiatvMxKEHs6BFd3xDrva7bYRQdpCmEKml4b6ImUEXdwlpBsmOIvFlUy76j1rPW-DwUrPUj1OCuQIlrm4hSGndYiqeFDFmkgElEe3d-nECdFk2Ekdf0ondnp6qxbyAm132aPYjXTXjPrmmg5iRii0E7ms8chNaBUKS_HiGO5TfTq1EEPP43eDt-ck)

위 그림에서 볼 수 있듯이 에러 메시지는 우리가 강제로 발생시켰던 page.tsx 파일에 있던 그 에러 메시지입니다.

아래 코드가 우리가 작성한 page.tsx 파일에 있던 에러 강제 배출 코드입니다.

```js
  const random = getRandomInt(2);

  if (random === 1) {
    throw new Error("Error occured when loading review ID");
  }
```

이렇듯 Next.js 14이 제공해 주는 error.tsx 파일은 화면의 풀 리로드 없이 UI를 깨지 않고 에러를 탈출할 수 있게 도와줄 수 있으며,

또 React Error Boundary 내에서 해당 라우팅 및 중첩 라우팅을 감싸서(wrap) 작동하기 때문에 개발자가 에러 관리하기가 아주 쉬운데요.

지금까지 배웠던 스페셜 파일을 모두 모아 놓은 컴포넌트 계층을 아래와 같이 이해할 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj9HmplR36kK36EzFThQasw_IEo9yPafIOwOKEUjAAcHMJxJsY11eD0gh5fGZgZuRBVRcwm9ZF19YuB6MkHVi1ptxEJGpFheLZOUe4YQCAu9wEFNRcLB3oKysMbGHr7-26Bas-vL_7M4mwBh_98HSw0mH8pPu00zxCH6S8Z3hKMtLtm9XCyqWFQW3i8Ovk)

위 그림을 보면 지금까지 배웠던 스페셜 파일이 Next.js에서 어떻게 React 컴포넌트로써 작동하는지 큰 틀에서 이해할 수 있을 겁니다.

---

## 에러 리커버리(Error Recovering)

두 번째로 알아볼 내용은 에러가 발생했을 때 다시 Recovery 하는 방법인데요.

Next.js의 ErrorBoundary에는 'reset'이라는 콜백 함수를 제공해 줍니다.

먼저, 코드를 보고 설명해 보겠습니다.

```js
"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      {error.message}
      <button
        className="border px-2 py-2 mx-2 bg-cyan-500 rounded-md"
        onClick={reset}
      >
        Recover From Error
      </button>
    </div>
  );
}
```

위 코드처럼 ErrorBoundary에서 객체 디스트럭쳐링에서 error 객체와 함께 reset이라는 콜백함수를 받았습니다.

그리고 이 콜백함수를 이용하기 위해 간단한 버튼을 만들었는데요.

이론상 이 버튼을 누르면 해당 페이지가 리로딩됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjCbfXmmT8Wyia1IBq9WqDEbNOSr96N6g4WoyGozhba8KqRx-y873_sbyOPpM-8wXWsSmljegt8UYs7VAe6XJ0V3L97ur9CB3TUKe4h1sK4FnmPs37AngN91tSmtm1oi1rH33awwODVoenkxRuckH8Vu9yUJ6YzhTo7oAMmkWNafL7KxVoIxYQ_gGquNTw)

위 그림과 같이 우리가 만든 버튼이 나옵니다.

이 버튼을 누르면 해당 페이지가 리로드 되면서 에러 페이지를 벗어나게 되는 원리죠.

테스트를 위해 버튼을 누르면 해당 라우팅인

`http://localhost:3000/products/1/reviews/10`

위 주소가 다시 리로드 됩니다.

그런데 계속 버튼을 눌러도 아무런 변화가 없는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjpYuooD1EjAtbCBovpExobxSJ2of5yNJzuhz2YbdKGxlt2aSu7oJ8Qp32nJGc6GDsC8uZGqhp3ESIK7nsAVoPPAZGeOnP_E5Y06rS_7Tpt8ssYPROpaD0YMfIiALJ8yFrvTb1i7_LpsGDL37e_JWFovBTvZLnnhQ5M4bKR_o4WdPlAwDOVGd7UXfcYK30)

위 그림과 같이 맨 밑에 에러표시가 1개라는 표시가 계속 나오고 아무런 변화가 없습니다.

아마도 우리가 강제로 만들었던 아래 코드 때문 인걸로 생각되는데요.

```js
if (random === 1) {
  throw new Error("Error occured when loading review ID");
}
```

random은 0과 1이니까 확률이 50%입니다.

그런데 아무리 reset 버튼을 눌러도 작동되지 않는데요.

확률이 50%라 몇 번 누르면 정상적으로 페이지가 작동해야 됩니다.

그런데도 계속 맨 밑에 에러 표시는 1로 나오는데요.

이 뜻은 페이지가 리로드 되지 않았다는 뜻입니다.

여기서 뭔가 눈치챌 수 있는 게 바로 reset 함수는 클라이언트 사이드에서 페이지를 리로드한다는 겁니다.

error.tsx 파일의 맨 위에 분명히 'use client' 디렉티브를 넣었습니다.

그런데도 작동이 안 되는 거는 바로 reset 함수가 다시 리로드 하는거는 page.tsx 파일이기 때문입니다.

그래서 error.tsx 파일과 같은 위치에 있는 해당 라우팅의 page.tsx 파일도 'use client' 디렉티브를 사용해야 합니다.

이제 다시 에러 리커버리 버튼을 눌러 보면 50% 확률 때문에 몇 번만 더 누르면 에러에서 리커버리해서 원래 라우팅의 정상적인 페이지가 나오게 될 겁니다.

이번에 배웠던 reset 함수는 클라이언트 사이드에서만 작동한다는 걸 꼭 명심하시기를 바랍니다.

---

## 중첩된 라우팅에서의 error.tsx

우리가 테스트한 라우팅은 몇 번의 중첩된 라우팅인데요.

products 라우팅 밑에 'productId'가 있고 그 밑에 review 라우팅도 있고 그렇습니다.

Next.js 에서는 중첩된 라우팅에서 error.tsx 파일의 위치만으로도 중첩된 라우팅의 자식 라우팅까지 한꺼번에 적용되는 특성이 있습니다.

그래서 우리가 만든 error.tsx 파일을 products 폴더에 옮겨 두어도 전혀 이상 없이 작동합니다.

그런데 여기서 error.tsx 파일을 products 폴더에 두었다고 다 같이 똑같이 작동하는 건 아닙니다.

테스트를 위해 기존에 `[productId]` 폴더 밑에 있던 layout.tsx 파일과 똑같은 걸 `[reviewId]` 폴더에도 만들겠습니다.

```js
export default function ProductDetailLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col">
        <h1>Layout of reviewId</h1>
        {children}
      </div>
    );
  }
```

이제 테스트를 위해 작동되는 layout 구조를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgbGLLUvdjHmeEOEHpjbeXa6xL0_GF2V0zGEFCV1FTq7Z49XJv4R8nXOSgvAiPtgjUc3WpetBtky5aaq5ToOJrjvbbucQokchyQxt4s77NFy6uKuAi5srYkk8K4yw1noZ7nXkI2ILeI-44Xyj13aSCYBGWWSSKB-qMq6kDX8r9l9S_zTSO6LYxWjgsjl9Y)

위 그림과 같이 두 개의 layout 파일이 제대로 작동하고 있습니다.

이제 error.tsx 파일이 `[reviewId]` 폴더 안에 있을 때의 에러 스크린샷을 보여드리겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiP-h0NEXUgjT20BcuDF89dDRItxdrQh5fBYjhoPGtglsutS7YkpyFxzqRt8seQ-OX-3qoBOce-sP8mQ9JC8ZOumrRySbU78Uezt2rcH2NvclkME26888GXC1z_vVN6fHj-TS_zxwFNc_SMetaUPXVMx3vCJTSj3-rr0I7izjFjmbK7pE_nPikntR9cz0U)

위 그림과 같이 에러가 발생하더라도 두 개의 layout이 제대로 작동되고 있습니다.

왜냐하면 error.tsx 파일은 두 개의 layout.tsx 파일보다 한 참 밑에 존재하기 때문입니다.

그러면 이번에는 error.tsx 파일을 products 폴더로 옮기겠습니다.

Visual Studio Code에서 파일을 드래고 하면 쉽게 옮겨집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg6qhgLV8KLjniKONMc-5NqKrangwlfWEE3yE5CR4Tdq9l9FBGTOOqYd06vVbMH3Do5FG7KM1DTpN_z-IXjHl-_1Xu6MGDcqJk_qII-YY40OtNQlByeHyprglrjHJ_MkQtsaNy_Jy-ly6S_R4Aj23HePKIwkJzzREwfVghvA3d42syMf9ChAqOV-NVbVbs)

위 그림과 같이 error.tsx 파일이 products 폴더 밑으로 이동됐습니다.

이제 다시 페이지를 여러번 새로고침해서 에러가 나올 때 까지 기다려 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhCvhCeAKH6qZggb5QTGWTJMu3dAYoUnuPpaibY8fwa-w9ELRfGgR88Rf-o4C7c7ISdUiHJsysex5pddVYQ-SdrrO1kVhlTQzoA3mN66ZkDiC_mda5mk_5DZyZPFpjq8OfJldF-KNSruIbN6c08WQm_zi-QvJkNY58eiPsppKrxizKzRl73iodZL99AxhI)

위 그림과 같이 두 개의 layout.tsx에 있던 문구가 아예 안 나오고 있습니다.

왜냐하면 error.tsx 파일은 products 폴더에 있고 두 개의 layout.tsx 파일은 products 폴더 밑에 있는 폴더에 있기 때문입니다.

이렇듯 error.tsx 파일에 의해 에러가 발생했을 때 대체되는 화면이 어디까지인지 쉽게 유추할 수 있습니다.

그렇다면 이번에 error.tsx 파일을 `[productId]` 폴더에 옮겨놓아 볼까요?

현재 `[productId]` 이 폴더에는 layout.tsx 파일이 같이 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiN7NCFv2BrsCLkECdwC9wX2jfhW0hpHGaXxmVbtaxVCv1y2rSjj87KwBgElgBawY57HaeBMUfu4NLOL6EmdPcRo8Zs2j3xLaV3AdnbjiekcpToNi-LXKe2k9i96dXHBBXOzjdYjGm3MvI6tdCbmqBGSW2ip-pOXYM4EOv-rfdIvY1-_oGHz5JExmKNKrw)

위와 같이 `[productId]` 폴더에 있는 layout.tsx 파일은 반영되고 있습니다.

이제 error.tsx 파일의 위치에 따른 그 효과를 이해하실 수 있을 겁니다.

---

## layout.tsx 파일에서 생긴 에러

지금까지 배운대로 error.tsx 파일은 중첩 레이아웃의 모든 자식 세그먼트에 반영된다고 했었는데요.

그러면 layout.tsx 파일에서 발생된 에러는 어떻게 되는지 테스트를 통해 알아보겠습니다.

지금까지 테스트를 위해 `[reviewId]`폴더에 있는 page.tsx 파일에서 강제로 랜덤하게 애러를 발생했었는데요.

이제 이 에러 발생 로직을 `[productId]` 폴더에 있는 layout.tsx 파일로 옮기겠습니다.

```js
function getRandomInt(count: number) {
  return Math.floor(Math.random() * count);
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const random = getRandomInt(2);

  if (random === 1) {
    throw new Error("Error occured when loading review ID");
  }

  return (
    <div className="flex flex-col">
      <h1>Layout of productId</h1>
      {children}
    </div>
  );
}
```

위와 같이 에러를 발생하는 곳을 layout.tsx로 만들었습니다.

현재 error.tsx 파일의 위치는 바로 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEierIJ_lAKMsH4wR8wQFITOdOLgcaCrG3XE1i91EVgmfsr9LURG-3T8WC5mxWC11wmQUn-Qvozvvu-eyfra6N2I_7_sR5msw6h7YqXhwWrkeuLOFBGlhk3TEQkH5GXFml9Azdmt5iaPZDAa6a0NN52jfAxu4ALgGsWjs6P-D_ZpRT_tpFgouJ-FmuaDt0c)

바로 에러가 발생하는 layout.tsx 와 같은 곳입니다.

즉 `[productId]` 밑에 error.tsx 파일이 있습니다.

이제 에러 발생을 위해 브라우저 새로고침을 몇 번 하다 보면 에러 페이지가 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhk-6YkOJ_tGZwUzn5sejFpGKwmiyptBTjRuk3YgJ_lfw8cT1X7dG8xPLx3mJI_l-zrvyX-cVlT5jvkItYtlivWimibbwd84w7GZNtTZNiU0XhAiI-tJizt4sBtgj33W1_ubSrn_8wufbDAG2v05BNrGxkvyPBQEjQHFqnEjN5_Pw0EgOCYbh-RstHZpzs)

위 그림은 Next.js 고유의 에러페이지이고, 우리가 만든 error.tsx 파일이 작동하지 않았을 때의 모습입니다.

왜 그런 걸까요?

현재 상황은 에러가 발생하는 layout.tsx 파일의 위치와 error.tsx 파일의 위치가 같은 상황입니다.

이 상황에서 다음 그림을 보시면 error.tsx 파일이 작동하지 않는 이유를 가늠할 수 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj9HmplR36kK36EzFThQasw_IEo9yPafIOwOKEUjAAcHMJxJsY11eD0gh5fGZgZuRBVRcwm9ZF19YuB6MkHVi1ptxEJGpFheLZOUe4YQCAu9wEFNRcLB3oKysMbGHr7-26Bas-vL_7M4mwBh_98HSw0mH8pPu00zxCH6S8Z3hKMtLtm9XCyqWFQW3i8Ovk)

위 그림처럼 ErrorBoundary 는 분명히 Tempalte과 Layout 컴포넌트 안에 있습니다.

그래서 error.tsx 파일이 작동하지 않게 되는 거죠.

이걸 해결할 방법은 error.tsx 파일의 위치를 한 단계 위로 올리면 됩니다.

현재 `[productId]` 폴더에 있던 걸 상위 페이지인 `products` 폴더로 옮기겠습니다.

error.tsx 파일만 옮기는 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEieahFXJp19wkESJaAZ_tS_rE8T11s1KEtGq9-WAkdgBlpIMIeLrA0onzCvTQdA40n2_isFnROMYM2Fq7R5PfFtZlj1VMJeULAezkVBAaQ-43Z9pApkxAfsTu2MKyjaTNpVDBn1mbcF3zLLkvS59KWub_zYzwkz4NDx0eTlGetSoR52NciOMvM7Q4zctIY)

위 그림과 같이 error.tsx 파일이 products 폴더 바로 안에 있습니다.

그래서 에러가 발생하는 layout.tsx 파일 보다 한 단계 위에 있죠.

그러면 에러가 발생한 경우의 브라우저를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEiQDMmrIwf6n5F449Z_DnX8-pZ_ByIqDpFt3CAbg7CttV5EJDIpPaSYHGDHwwOSmbHgV0I8MrAzjhnoPR9SI4ZjqHYfDjvoWlyOPxabfBzsbomlUZfYr1EaQMSocM3kYewZ6lvePscu_gfMDGaI_GrLnPLcynPQEgrbNP5Z2GiAf7b24KSFiI3DXggFSsI)

위와 같이 `[productId]` 폴더의 layout.tsx 에서 지정한 아래 태그가 보이지 않습니다.

`<h1>Layout of productId</h1>`

당연히 해당 layout.tsx에서 에러가 발생했고 상기 태그를 렌더링하기 전에 에러가 발생했기 때문입니다.

그러나 우리가 만든 error.tsx 파일은 정상 작동하는 걸 볼 수 있을 겁니다.

이렇듯 중첩된 라우팅일 경우 error.tsx 파일의 위치를 조정하면 좀 더 쉽게 에러 핸들링 및 처리를 할 수 있을 겁니다.

그럼 이만.