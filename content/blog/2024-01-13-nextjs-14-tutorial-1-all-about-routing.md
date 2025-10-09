---
slug: 2024-01-13-nextjs-14-tutorial-1-all-about-routing
title: Next.js 14 강좌 1편. 라우팅의 모든 것
date: 2024-01-13 13:10:59.808000+00:00
summary: Next.js 14 강좌 1편. 라우팅의 모든 것
tags: ["next.js", "routing", "app router"]
contributors: []
draft: false
---

안녕하세요?

그동안 Remix 때문에 소홀했던 Next.js 강좌를 해볼까 합니다.

Next.js 최신 버전인 14 버전 내용으로 다룰 건데요.

1편은 라우팅의 모든 것에 대해 알아보는 시간을 갖겠습니다.

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

* 1. [React Server Component](#ReactServerComponent)
	* 1.1. [Server Components](#ServerComponents)
	* 1.2. [Client Components](#ClientComponents)
* 2. [Routing](#Routing)
	* 2.1. [주소의 최상단 페이지](#one)
	* 2.2. [폴더별 라우팅 주소](#two)
* 3. [Nested Routes (중첩 라우팅)](#NestedRoutes)
* 4. [Dynamic Routes (다이내믹 라우팅)](#DynamicRoutes)
* 5. [Nested Dynamic Routes (중첩된 다이내믹 라우팅)](#NestedDynamicRoutes)
* 6. [Catch all segments (모든 경우의 수를 캐치하기)](#Catchallsegments)
* 7. [옵셔널 캐취 올 세그먼트](#three)
* 8. [Not Found 페이지 만들기 (404 에러 페이지)](#NotFound404)
* 9. [File colocation](#Filecolocation)
* 10. [Private folders](#Privatefolders)
* 11. [라우팅 그룹화](#four)
 
---

##  1. <a name='ReactServerComponent'></a>React Server Component

Next.js 13 버전부터 App Router가 도입되면서 그 이전의 pages 폴더 방식의 라우팅에서 획기적인 변화가 일어났는데요.

라우팅의 변화에 앞서 먼저 살펴볼게 바로 React 서버 컴포넌트입니다.

리액트 서버 컴포넌트는 React 버전 18부터 도입된 새로운 아키텍처인데, 나오자마자 Next.js 에서 도입했습니다.

새로운 아키텍처는 리액트 컴포넌트를 두 가지로 구분하는데요.

바로, "Server components"와 "Client components"입니다.

###  1.1. <a name='ServerComponents'></a>Server Components

Next.js의 모든 컴포넌트는 기본적으로 서버 컴포넌트입니다.

서버 컴포넌트는 서버 사이드 상에서 작동하기 때문에 서버의 파일을 읽을 수 있고, 데이터베이스에서 자료를 직접 당겨올 수 있습니다.

대신, 리액트 훅이나 기존 자바스크립트를 이용한 유저 상호작용(user interactions)은 구현할 수 없습니다.

###  1.2. <a name='ClientComponents'></a>Client Components

그래서 따로 Client 컴포넌트라는 게 존재하는데요.

클라이언트 컴포넌트는 컴포넌트의 최상단에 'use client' 디렉티브를 추가하면 됩니다.

'use client' 디렉티브가 있는 컴포넌트는 클라이언트 사이드에서 렌더링 되기 때문에, 우리가 알고 있는 리액트의 모든 훅과 유저 상호작용이 가능합니다.

기본적인 React Server Components의 개념을 이해했으니까 본격적인 Next.js 강좌로 들어가 보겠습니다.

---

##  2. <a name='Routing'></a>Routing

먼저, 라우팅입니다.

Next.js가 새롭게 도입한 App router 방식은 파일시스템 베이스 방식으로 라우팅이 작동됩니다.

즉, 폴더와 파일로 라우팅을 구성하는 건데요.

기본적인 Next.js의 Routing Conventions(관례)이 있습니다.

- 모든 라우팅은 app 폴더 안에 있어야 한다.

- 라우팅이 매치되는 파일이름은 page.js(pages.tsx) 등 "page"라는 이름이어야 한다.

- 폴더 이름이 브라우저에서 보이는 URL의 path가 됩니다.

여러 가지 라우팅을 살펴보면서 App router가 어떤 방식으로 작동하는지 보는 게 좀 더 쉬울 거 같습니다.

---

###  2.1. <a name='one'></a>주소의 최상단 페이지

가장 처음 접하는 주소는 바로 '/'인데요.

NGinx나 아파치 같은 웹 서버의 경우 index.html 파일이 라우팅 주소의 첫 시발점이 됩니다.

Next.js에서는 app 폴더 바로 밑에 있는 page.tsx 파일이 '/' 주소에 해당합니다.

'src/app/page.tsx'

여기서 app 폴더 바로 밑에 있는 page.tsx는 바로 브라우저의 최상위 주소인 '/'가 됩니다.

테스트를 위해 Nex.js 템플릿을 설치해 보도록 하겠습니다.

```bash
npx create-next-app@latest routing-test

// App router를 고르고,
// src 폴더를 사용하는 걸로 고르면 됩니다.
```

이제 src 폴더 밑의 app 폴더를 모두 지우고 새로 app 폴더를 만들고 그다음에 page.tsx 파일을 아래와 같이 만들겠습니다.

```js
export default function Home() {
    return <h1>Home</h1>
}
```

이제 'npm run dev'를 실행해서 개발 서버를 돌리면 브라우저 화면에 Home이라는 글자만 보일 건데요.

src/app 폴더를 보시면 layout.tsx 파일이 Next.js에 의해 자동으로 생성되었습니다.

```js
export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

이 파일을 레이아웃 파일이라고 하며, 레이아웃 라우팅이라고도 합니다.

app 폴더 바로 밑에 있는 layout.tsx 파일 안에 있는 걸 RootLayout이라고 하며, html의 기본 구조를 제공해 줍니다.

이 RootLayout이 있기 때문에 앞으로 라우팅 주소의 page.tsx 파일을 만들 때 따로 html 코드를 작성하지 않아도 되는 거죠.

이 부분은 다음 시간에 좀 더 자세히 살펴볼 예정이니까 여기서 넘어가도록 하겠습니다.

---

###  2.2. <a name='two'></a>폴더별 라우팅 주소

about과 profile 페이지를 만든다고 합시다.

그러면 아래와 같이 만들면 되는데요.

```bash
app/about/page.tsx ==> '/about' 라우팅에 대응

app/profile/page.tsx ==> '/profile' 라우팅에 대응
```

```bash
➜  app git:(main) ✗ tree -L 2
.
├── about
│   └── page.tsx
├── layout.tsx
├── page.tsx
└── profile
    └── page.tsx

3 directories, 4 files
```

위와 같은 폴더 구성이 됩니다.

지금까지 about, profile 라우팅을 만들었는데 만약 주소창에 dashboard라고 치면 어떻게 될까요?

아래 그림처럼 404 에러가 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgVbrAfs6pL_kCtU5QdCyc4BG2iIMjaCAUFlKr3Q4H4zXwjDck36Ufxn-UoU5-94WmBTFKNY2AHfSlGa1fCNQDy-nYtfsN5bYD07jGE0RNYLE-OI0Xz0kMrwxK0He2j8H9o-gc0az4iXC4CCNGdHhpxUYpfZ2VxZTsS5WbH42vyXKHkCJDnV5S8trKisa0)

즉, 페이지가 없다는 뜻이죠.

위 화면은 Next.js에서 기본적으로 제공해 주는 404 페이지 화면입니다.

이 화면도 사용자가 직접 만들 수 있습니다.

---

##  3. <a name='NestedRoutes'></a>Nested Routes (중첩 라우팅)

중첩 라우팅이란 표현은 라우팅 주소 밑에 또 다른 주소가 연이어 나오는 걸 얘기합니다.

아래의 경우를 가정하면 'blog' 주소 밑에 'first', 'second'라는 주소가 연이어 나옵니다.

```bash
localhost:3000/blog
localhost:3000/blog/first
localhost:3000/blog/second
```

이와 같은 방식을 중첩 라우팅이라고 하는데요.

만드는 건 아주 쉽습니다.

app 폴더에 blog 폴더를 만들고, blog 폴더에는 page.tsx 파일을 만듭니다.

```js
export default function Blog() {
  return <h1>Blog</h1>
}
```

그리고 first, second 폴더를 blog 폴더 밑에 만들고 그 밑에 각각 page.tsx 파일을 만들어 주면 됩니다.

이제 'blog' 주소로도 접근할 수 있고, 'blog/first', 'blog/second' 주소로도 접근할 수 있게 되었습니다.

```bash
➜  blog git:(main) ✗ tree -L 2
.
├── first
│   └── page.tsx
├── page.tsx
└── second
    └── page.tsx

3 directories, 3 files
```

위와 같이 blog 폴더 밑에 바로 있는 page.tsx 파일과 first, second 폴더 밑에도 page.tsx 파일이 각각 있습니다.

---

##  4. <a name='DynamicRoutes'></a>Dynamic Routes (다이내믹 라우팅)

중첩 라우팅이 조금 더 복잡하게 되면 다이내믹 라우팅을 이용하면 됩니다.

아래와 같은 구성의 주소가 있다고 칩시다.

```bash
localhost:3000/products
localhost:3000/products/1
(localhost:3000/products/id)
```

products라는 주소 밑에 id 부분이 있는데 이 id가 어떤 값이든 다 처리할 수 있는 주소를 만들어야 하는데요.

DB에서 product를 불러온다고 할 때 해당 product의 id 값은 특정값으로 고정되질 않죠.

그래서 다이내믹 라우팅이 필요한 겁니다.

만드는 방법은 먼저, app 폴더 밑에 products 폴더를 만들고 그 밑에 page.tsx 파일을 만듭니다.

```js
export default function Products() {
  return (
    <>
      <h1>Product Lists</h1>
      <h2>product 1</h2>
      <h2>product 2</h2>
      <h2>product 3</h2>
    </>
  );
}
```

products 라우팅은 전체 products를 보여주는 화면인데요.

예를 들어 3가지만 나열했습니다.

이제 Product 1에 대한 라우팅을 만들어야 하는데요.

아까 만든 products 폴더 밑에 다시 1 폴더를 만들고 그 밑에 page.tsx 파일을 만듭니다

```js
export default function Product1() {
  return (
    <h1>
      Product 1 Details
    </h1>
  );
}
```

그러면 product 2에 대한 라우팅도 똑같이 폴더를 만들고 그 밑에 page.tsx 파일을 만들어야 하는데요.

이건 너무 비효율적입니다.

product ID는 어떤 값이 올지 모르기 때문이고 또 무수히 많을 수 있는데요.

그래서 동적 라우팅 즉, 다이내믹 라우팅을 제공해 줍니다.

아까 products 폴더 밑에 만들었던 '1' 이라는 폴더를 '[productId]'라는 이름으로 바꿉니다.

스퀘어 브래킷으로 시작하는 폴더명은 Next.js에서 다이내믹 라우팅으로 간주됩니다.

그리고 스퀘어 브래킷 안에 있는 단어가 바로 동적인 라우팅 주소 즉, 파라미터가 됩니다.

이제 '[productId]'라는 폴더 안에 있는 page.tsx 파일을 아래와 같이 수정합시다.

```js
export default function ProductDetails(props: any) {
  console.log(props);
  return (
    <h1>
      Product {props.params.productId} / {props.searchParams.country} Details
    </h1>
  );
}
```

다이내믹 라우팅 컴포넌트는 props를 가지고 있는데요.

아래와 같이 두 개의 값을 갖는 props가 됩니다.

```bash
{ params: { productId: '1' }, searchParams: {} }
```

params는 다이내믹 라우팅의 파라미터가 되는데요.

스퀘어 브래킷 안에 있던 productId 이름이 바로 params 객체의 항목 이름이 되고 그 값으로는 실제 주소창에 넣은 값이 나옵니다.

```bash
localhost:3000/products/1
```
위와 같은 주소일 경우가 그 경우입니다.

그리고 가장 중요한 것은 URL 관련된 것의 데이터 타입은 무조건 string이라는 겁니다.

우리가 숫자 1을 넘겼다고 해서 number 타입이 되는 건 아니니 헷갈리지 마시기를 바랍니다.

인터넷 URL과 관련된 건 무조건 string이라고 생각하시면 됩니다.

그러면 여기서 searchParams는 뭘까요?

URL 쿼리 문자열이라고 합니다.

예를 들어 보면 아주 쉬운데요.

```bash
localhost:3000/products/1?country=ko

{ params: { productId: '1' }, searchParams: { country: 'ko' } }
```

URL 쿼리 문자열은 느낌표(?) 표시 뒤로 Key-Value 값 형태로 나타낼 수 있습니다.

이 방식을 사용하면 컴포넌트의 상태 값을 Redux 같은 글로벌 상태 관리자 없이 URL로 쉽게 전달할 수 있는 거죠.

그리고 보통 props 객체를 디스트럭처링해서 쓰거든요.

아래와 같이 사용하시면 됩니다.

```js
export default function ProductDetails({
  params,
  searchParams,
}: {
  params: { productId: string };
  searchParams: { country: string };
}) {
  return (
    <h1>
      Product {params.productId} / {searchParams.country} Details
    </h1>
  );
}
```

searchParams 까지 타입 지정을 해줬습니다.

---

##  5. <a name='NestedDynamicRoutes'></a>Nested Dynamic Routes (중첩된 다이내믹 라우팅)

아래의 경우를 가정합시다.

```bash
localhost:3000/products/1
localhost:3000/products/1/reviews/1
(localhost:3000/products/[productId]/reviews/[reviewId])
```

위와 같이 products 라우팅 밑에 productId라는 다이내믹 라우팅이 있고 그 밑에 또다시 reviews 라우팅이 있고 또다시 그 밑에 reviewId라는 다이내믹 라우팅을 구현해 봅시다.

`src/app/products/[productId]/reviews/page.tsx` 파일을 만듭시다.

참고로 구현하는 UI에 따라 이 파일은 만들어도 되고 안 만들어도 됩니다.

```js
export default function Reviews(props: {
  params: { productId: string };
  searchParams: { country: string };
}) {
  console.log(props);
  return (
    <h1>
      Reviews Page and productId : {props.params.productId}, Country:{" "}
      {props.searchParams.country}
    </h1>
  );
}
```

그리고 주소창에 아래와 같이 넣으면, 콘솔 창에는 아래와 같이 나옵니다.

```bash
http://localhost:3000/products/2/reviews?country=ko

{ params: { productId: '2' }, searchParams: { country: 'ko' } }
```

즉, reviews 라우팅 상위 라우팅에 다이내믹 라우팅이 있으면 그 다이내믹 라우팅까지 접근할 수 있습니다.

이제 reviews 폴더 밑에 다시 다이내믹 라우팅을 추가해 볼까요?

`src/app/products/[productId]/reviews/[reviewId]/page.tsx` 파일을 만들도록 합시다.

```js
export default function ReviewDetails({
  params,
}: {
  params: {
    productId: string;
    reviewId: string;
  };
}) {
  console.log(params);
  return (
    <>
      <h1>Product Id : {params.productId}</h1>
      <h1>Review Id : {params.reviewId}</h1>
    </>
  );
}
```

위와 같이 하면 콘솔 창에는 다음과 같이 나옵니다.

```bash
{ productId: '2', reviewId: '1' }
```

2단계에 걸친 다이내믹 중첩 라우팅이 끝났습니다.

그런데 조금 복잡한데요.

그래서 Next.js에서는 조금 더 편한 방법을 제공해 줍니다.

---

##  6. <a name='Catchallsegments'></a>Catch all segments (모든 경우의 수를 캐치하기)

우리가 아까 productId와 reviewId를 다이내믹 라우팅으로 해서 params로 접근했는데요.

Next.js는 다이내믹 라우팅의 모든 경우의 수를 모두 캐치할 수 있는 방법은 제공해 줍니다.

예를 들어 docs 라우팅 주소에 API Help 페이지를 만든다고 합시다.

그러면, docs 폴더 밑에는 각 API 항목이 첫 번째로 오고 그 밑에 기능에 따른 설명 페이지가 오고 또 그 밑에 다른 페이지가 올 수 있는데요.

이 모든 걸 다이내믹 라우팅으로 하기보다는 좀 더 간단하게 하는 방법이 있습니다.

`src/app/docs/[...slug]/page.tsx` 파일을 만듭시다.

스퀘어 브래킷 안에 점 세 개를 쓰고 그다음에 변수 이름을 적습니다.

변수 이름은 원하는 이름을 선정하면 됩니다.

자바스크립트 rest 파라미터나 spread operator와 비슷한 겁니다.

```js
export default function Docs() {
  return <h1>Docs Page</h1>;
}
```

일단 params는 생각하지 말고 위와 같이 하고 주소창에

`localhost:3000/docs/api/get/` 주소로 가면 단순하게 'Docs Page'만 보입니다.

docs 주소 밑에 'api' 세그먼트도 있고 'get' 세그먼트도 있지만 이 두 개의 세그먼트를 다 무시하고 우리가 지정한 'Docs Page'만 보이는 거죠.

그럼, params 값을 지정해 볼까요?

```js
export default function Docs({ params }: { params: { slug: string[] } }) {
  console.log(params.slug);
  return (
    <>
      <h1>Docs Page</h1>
      <h2>{JSON.stringify(params.slug, null, 2)}</h2>
    </>
  );
}
```

위와 같이 catch all-segments 일 경우 params의 slug는 문자열의 배열이 됩니다.

콘솔 창에 보시면 아래와 같이 나올 겁니다.

```bash
[ 'api', 'get' ]
```

보통 params.slug의 개수를 if 문으로 구분해서 직접 그 값을 나타내 주면 됩니다.

```js
export default function Docs({ params }: { params: { slug: string[] } }) {
  console.log(params.slug);
  if (params.slug.length === 2) {
    return (
      <h2>
        {params.slug[0]} / {params.slug[1]}
      </h2>
    );
  } else if (params.slug.length === 1) {
    return <h2>{params.slug[0]}</h2>;
  }
  return <h1>Docs Page</h1>;
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEivqugVoOJVIuu1d3eS5U_37ZMTG5B8imwLGNrp3G_LCDhic_WB5e4WzZBsalXjxT9vZyLWySaFIdn8w8y5-Qg_HSr9F2Ks9KrE1Y1APyWm0JZIx1tw-mhlpeCoBdBH3Eag6oY6aOtrhQwEOsEpe4CyiVS12DHBKnxR0hHrVxTjiiKf_sd0UI_7gghOzcs)

위와 같이 나올 겁니다.

---

##  7. <a name='three'></a>옵셔널 캐취 올 세그먼트

만약 주소창에 'localhost:3000/docs' 주소로 가면 어떻게 되는지 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEgcynxc0lBkFdxGRCg8B3JfqhAv8z57vC20BiuO2IoWM7vsCJVWPCCvAjJmlLU2XO8i5vJK-7wsGapNiqGQAgJuIbOVybZyTVccrVF0xjZmUbyiFEJjLBu8qViwR0ku9hkKSEVs_6Cz2aJFrMAiJnzoY46WdYFbgtCmDtzIOZZ19onz57gDrxagxKJVaO0)

위와 같이 404 에러 즉, 페이지가 없다고 나옵니다.

이 같은 현상이 왜 나오냐면 바로 slug 값이 우리가 원하는 다이내막 라우팅의 변수인데, 이게 문자열의 배열값입니다.

Next.js는 문자열의 배열값이 있다고 가정하고 진행했는데, 단순하게 'localhost:3000/docs' 주소로 가면 slug 값이 undefined 값이 됩니다.

이 같은 경우를 옵셔널(Optional)하게 체크해야 하는데요.

Next.js에서는 더블 스퀘어 브래킷 방식을 씁니다.

`localhost:3000/docs/[[...slug]]/page.tsx`

위와 같이 더블 스퀘어 브래킷을 쓰면 slug 값의 상태에 옵셔널 연산자인 '?'를 붙여서 배열이 비었는지 검사할 수 있습니다.

'[...slug]' 를 '[[...slug]]'로 바꿉시다.

그리고 params.slug 변수 뒤에 '?' 옵셔널 연산자를 추가할 수 있습니다.

이렇게 되면 slug가 undeinfed 일때도 작동하는 완벽한 docs 페이지를 만들 수 있게 됩니다.

```js
export default function Docs({ params }: { params: { slug: string[] } }) {
  console.log(params.slug);
  if (params.slug?.length === 2) {
    return (
      <h2>
        {params.slug[0]} / {params.slug[1]}
      </h2>
    );
  } else if (params.slug?.length === 1) {
    return <h2>{params.slug[0]}</h2>;
  }
  return <h1>Docs Page</h1>;
}
```
위와 같이 하면 브라우저에는 아래와 같이 나오고 콘솔창에는 slug 값이 undefined라고 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiLvA04kTwy62YkSX1zt7J5dc_QeA2H5apaQKG84bB4qfbs23PabiXTGeDq5RrdGf9IhbITQB0pxiXSPTcjdN59Hy7DJU3QL5MXOm5rsbmbfkdo5FRYSDBOPzMe_cL9veQPJuUHRn2pX3orSzQOVZ9fK73Ru9y8OtCZv8EhF-W29ci49Cmsi_L8k_s-7Bg)

```bash
 ✓ Compiled /docs/[[...slug]] in 1033ms (395 modules)
undefined
```

그래서 처음부터 Optional Catch All-Segments 방식을 사용하는 게 좋습니다.

---

##  8. <a name='NotFound404'></a>Not Found 페이지 만들기 (404 에러 페이지)

우리가 라우팅을 제공해 주지 않는 주소로 가면 404 에러 페이지가 아래와 같이 나오는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgVbrAfs6pL_kCtU5QdCyc4BG2iIMjaCAUFlKr3Q4H4zXwjDck36Ufxn-UoU5-94WmBTFKNY2AHfSlGa1fCNQDy-nYtfsN5bYD07jGE0RNYLE-OI0Xz0kMrwxK0He2j8H9o-gc0az4iXC4CCNGdHhpxUYpfZ2VxZTsS5WbH42vyXKHkCJDnV5S8trKisa0)

위와 같은 화면을 Next.js가 제공하는 기본 페이지가 아니라 우리가 원하는 화면으로 바꿀 수 있습니다.

파일 이름은 꼭 'not-found.tsx' 이어야 하고, 위치는 app 폴더 밑에 두면 됩니다.

그러면 모든 404 에러 페이지가 적용받게 됩니다.

```js
export default function NotFound() {
  return <>My Error Page : 404</>;
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiC3Wdbj5sIPZVhHgU0axR-2rdfOckL-Br22HOwKWobatOlz57io3sEjEN6RXOsA7vTnsGK2Dcshua04CHdoLbXqhTqFnTmp9M-qQyufDUqOrlO9ulqhzLz9HRo8fdyzxLAB_aSdewSh5DlySZm4jJcPRoY_zakwYS4xVEN-d5Zx5cprAPdTHgDCqCw3GU)

위 그림과 같이 제가 작성한 에러 페이지가 나왔네요.

그러면 이런 경우가 있는데요.

특정 다이내믹 라우팅에서 변수 값이 범위를 초과하는 에러가 났다면 단순한 404 페이지보다는 그 원인이 뭔지 알려주는 404 페이지가 훨씬 좋은데요.

그래서 Next.js에서는 notFound 함수를 제공해 줍니다.

if 문으로 조건을 체크해서 강제로 notFound 함수를 실행시키면 해당 컴포넌트가 있는 위치에 같이 있는 not-found.tsx 컴포넌트가 작동하게 됩니다.

예를 들어봅시다.

아까 reviewId 같은 다이내믹 라우팅에서 강제로 notFound 함수를 적용해 볼까요?

```js
import { notFound } from "next/navigation";

export default function ReviewDetails({
  params,
}: {
  params: {
    productId: string;
    reviewId: string;
  };
}) {
  console.log(params);

  // 아래 코드 부분이 강제로 notFound 함수를 실행시킨겁니다.
  if (parseInt(params.reviewId) > 100) {
    notFound();
  }
  return (
    <>
      <h1>Product Id : {params.productId}</h1>
      <h1>Review Id : {params.reviewId}</h1>
    </>
  );
}
```

notFound 함수는 'next/navigation' 모듈에서 가져오면 됩니다.

그리고 '[reviewId]' 폴더 밑에 not-found.tsx 파일을 만듭시다.

```js
// [reviewId]/not-found.tsx

export default function NotFound() {
  return <h1>Review Not Found!</h1>;
}
```

이제 테스트를 위해 reviewId를 100과 101로 지정해 봅시다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEieIlg2z-1Wzaq_PkmCd6KGnfqbjsHS8EBVbJv7vvU-LQZvBSsyciUgCgP2xTG1Bqk034sY6iAPwHPG6FVO86RBGfVFN6L6ZhtaJuBWwOsNKMKYM1KeZiowiPVP12H9dOkEsFdirh2uhDlvlZCs452Go-lbH6W01jm6rDl4LDAS0ygFvOA8DIBinKP0muo)

![](https://blogger.googleusercontent.com/img/a/AVvXsEh-XortetrsVGhOD7VSAORKMM6KUdsWoL2rz_pJg8kGNvgeOrBkLhaZ3wOlg7m2GyYWEkZmMmcIECx31ZlXiOdy6AZOkzmM5WOOL2JZqBcxxXFllOszZg_fVsVbBsOH2Rks2wucELMf8O1X6EQvtVl0Cf6yETtF3ghKpoknsMU_FNmTIsNIUUMC1Tsl-ys)

위 두 개의 그림처럼 완벽하게 notFound 함수가 작동하고 있네요.

---

##  9. <a name='Filecolocation'></a>File colocation

보통 React 앱에서는 공통적으로 쓰이는 UI 컴포넌트 같은 거는 src 폴더 밑에 components 폴더를 만들고 그 밑에 UI 컴포넌트를 모두 모아두는 방식을 썼는데요.

이 방식도 괜찮습니다.

그런데, 여기서 더 나아가 Next.js에서는 좀 더 프로젝트 자체를 구조화할 수 있는 file colocation 방식을 지원하는데요.

file colocation 이 무엇이냐 하면 파일을 같은 곳에 모아 둔다는 뜻입니다.

예를 들어 dashboard 라우팅 주소인 'dashboard/page.tsx' 파일을 아래와 같이 만든다고 할 때,

```js
function BarChart() {
  return <h3>BarChart</h3>;
}

export default function Dashboard() {
  return (
    <>
      <BarChart />
      DashBoard
    </>
  );
}
```

UI 컴포넌트인 BarChart 컴포넌트 함수가 같은 page.tsx 파일 안에 함께 위치해 있습니다.

위와 같은 짧은 코드일 경우에는 상관없는데, 만약 Dashboard 함수가 아주 긴 경우 컴포넌트를 쪼개고 싶은데요.

여기서 File colocation이 적용되면 아주 쉽게 구현할 수 있습니다.

dashboard 폴더 밑에 BarChart 컴포넌트를 위한 'bar-chart.tsx' 파일을 만들고 해당 컴포넌트를 옮깁시다.

```js
export defult function BarChart() {
    return <h3>BarChart</h3>;
  }
```

그러면 page.tsx 파일에서 BarChart 컴포넌트를 import 하면 되겠네요.

```js
import BarChart from "./bar-chart";

export default function Dashboard() {
  return (
    <>
      <BarChart />
      DashBoard
    </>
  );
}
```

이렇게 해도 결과는 똑같습니다.

이게 왜 성립하냐면 바로 Next.js의 App Router의 특징 때문입니다.

App Router의 라우팅은 무조건 page.js 파일이나 page.tsx 파일 즉, page라는 이름의 파일이어야 한다는 거죠.

그래서 Next.js가 제공하는 파일 컨벤션 이름에 해당되지 않는 파일은 라우팅 주소가 될 수 없습니다.

그래서 dashboard 폴더 안에 같이 넣어도 전혀 문제가 되지 않는 거죠.

이게 바로 Nex.js가 얘기하는 File colocation입니다.

---

##  10. <a name='Privatefolders'></a>Private folders

Next.js에서 app 폴더 밑에 폴더를 두고 page.tsx 파일을 작성하면 그게 라우팅 주소가 된다고 했는데요.

만약 app 폴더 밑에 있는 폴더가 '_'로 시작하면 그 폴더는 라우팅에서 제외됩니다.

그래서 app 폴더 밑에 '_lib' 폴더를 만들고 유틸리티 라이브러리 같은 헬퍼 유틸을 모아두면 아주 쉽습니다.

'_lib' 폴더 밑에 page.tsx 파일을 작성해도 이 파일은 주소창에서 절대 볼 수 없습니다.

```bash
app/_lib/helper.ts
```

---

##  11. <a name='four'></a>라우팅 그룹화

라우팅 그룹화는 예를 들어 인증 관련 라우팅을 만든다고 합시다.

그러면 일반적으로 register, login, forgot-password 주소가 필요한데요.

```bash
/src/app/register/page.tsx

/src/app/login/page.tsx

/src/app/forgot-password/page.tsx
```

위와 같이 세 개의 폴더가 필요합니다.

그런데, 앱이 커지면 app 폴더 밑에 정말 많은 수의 라우팅 폴더가 있을 건데요.

이 라우팅 폴더를 구조화하고 싶을 겁니다.

그래서 보통 위 3개의 라우팅을 묶어서 구현하는데요.

'/src/app/auth' 폴더를 만들고 이 밑에 다 옮기는 겁니다.

이렇게 되면 auth 폴더 밑에 auth 관련 라우팅을 모아 놓아 보기 좋은데요.

한가지 문제는 주소에 꼭 auth라는 라우팅 주소가 첨가되어야 합니다.

```bash
localhost:3000/register

localhost:3000/auth/register
```

뭐 상관은 없겠지만 긴 주소를 싫어할 수도 있는데요.

이때 Next.js가 라우팅 그룹이라는 걸 제공해 줍니다.

이제 app 폴더 밑에 있는 auth 폴더의 이름을 '(auth)'라고 바꾸면 됩니다.

괄호를 추가하면 Next.js는 해당 폴더를 주소로 인식하지 않고 단순히 그룹화하는 방식으로만 작동합니다.

이렇게 하면 'localhost:3000/auth/register' 주소가 아니라 'localhost:3000/register' 주소로 쉽게 접근할 수 있게 되죠.

앱이 정말 커질 경우 관련 라우팅을 모아두면 좀 더 효율적인 라우팅 주소를 관리할 수 있습니다.

---

