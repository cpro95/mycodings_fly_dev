---
slug: 2024-05-04-nextjs-14-tutorial-6-intercepting-routes-and-parallel-intercepting-routes
title: Next.js 14 강좌 6편. 인터셉팅 라우팅(Intercepting Routes)과 병렬 인터셉팅 라우팅(Parallel Intercepting Routes) 살펴보기
date: 2024-05-04 07:22:56.721000+00:00
summary: Next.js에서 라우팅 가로채기인 인터셉팅 라우팅과 병렬 인터셉팅 라우팅에 대해 살펴보기
tags: ["intercepting routes", "parallel intercepting routes", "next.js"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 여섯 번째입니다.

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

** 목차 **

- [Next.js 14 강좌 6편. 인터셉팅 라우팅(Intercepting Routes)과 병렬 인터셉팅 라우팅(Parallel Intercepting Routes) 살펴보기](#nextjs-14-강좌-6편-인터셉팅-라우팅intercepting-routes과-병렬-인터셉팅-라우팅parallel-intercepting-routes-살펴보기)
  - [인터셉팅 라우팅(Intercepting Routes)의 필요성](#인터셉팅-라우팅intercepting-routes의-필요성)
  - [인터셉팅 라우팅 구현](#인터셉팅-라우팅-구현)
  - [병렬 인터셉팅 라우팅(Parallel Intercepting Routes)](#병렬-인터셉팅-라우팅parallel-intercepting-routes)

---

## 인터셉팅 라우팅(Intercepting Routes)의 필요성

지금까지 Next.js 14의 고급 라우팅 패턴에 대해 배우고 있는데요.

지난 시간에는 병렬 라우팅에 대해 배웠습니다.

오늘은 인터셉팅 라우팅(Intercepting routes)인데요.

Intercepting이란 말은 가로챈다는 말입니다.

라우팅 중간에 가로챈다는 의미 같은데요.

아마도 기본적인 UI에서 유저가 뭔가를 클릭해서 다른 라우팅으로 이동해야 하는데, 아마도 해당 라우팅을 가로채서 다른 화면이나 컴포넌트를 보여주는 거 같습니다.

Next.js 14의 인터셉팅 라우팅은 방금 예상했던 대로 작동됩니다.

그러면 이 인터셉팅 라우팅이 왜 필요하냐면 좀 더 사용자 편의적인 UI를 제공할 수 있는데요.

가장 간단하게 예를 들어보면 login 페이지를 들 수 있습니다.

보통 홈페이지에서 login 버튼을 클릭하면 전체 라우팅이 `/login`로 전환되면서 풀 페이지 리로딩이 일어나면서 로그인 페이지가 브라우저에 표시되는데요.

사실 이럴 필요는 없습니다.

현재 사용자가 보고 있는 화면에서 모달 방식으로 화면 한가운데 작게 로그인 창만 띄우고 로그인 작업을 완료하면 현재 보고 있는 창으로 돌아가면 그만입니다.

이 방식은 인터셉팅 라우팅이 필요 없는데요.

그러면 인터셉팅 라우팅이 왜 필요하냐면 바로 로그인 모달이 화면에 떳을 때 새로고침했을 때가 문제입니다.

아까 설명한 방식에서 모달 창이 떳을 때 새로 고침하면 방금 보던 컨텐츠 그대로 보이는데요.

그러면 로그인 링크를 페이스북이나 인스타그램, 트위터 등으로 보낼 때 문제가 발생합니다.

그래서 사용하는 방식이 인터셉팅 라우팅인데요.

인터셉팅 라우팅은 실제 로그인 버튼을 누르면 브라우저 주소가 `/login`으로 갑니다.

그런데 화면에는 모달 창이 뜹니다.

이때 모달 창은 인터셉팅 라우팅이고, 만약 모달창이 떴을 때 새로 고침하면 원래 있던 `/login` 라우팅이 화면에 보이게 되는 겁니다.

그러면 `/login` 링크를 SNS로 보내도 되는 거죠.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgqkGWUm9JqGq6CLRAxFqp8oSY2xTBwSgsvGDgvRIczwi5-NPrCVnwqZl7ymUC9lB60KC6nJ3sPSxpxSNzpv0E762fjlUgLec2FvmIAnro_hhnzuCinMKR8y_Vyyv1oNvgri2AN8Kx-lvKAOmhmBzwCqzChtsc9M4qHd8DtFpxoSmtGve2F24WGzAZi244)

그림으로 표현하면 위와 같습니다.

그러면 실제로 코드로 구현해 보겠습니다.

---

## 인터셉팅 라우팅 구현

먼저, src/app 폴더 밑에 정상적인 라우팅인 test1 이란 이름으로 폴더를 만들고 그 밑에 page.tsx 파일을 간단하게 만들겠습니다.

```js
// /src/app/test1/page.tsx

import Link from "next/link";

export default function Test1() {
  return (
    <>
      <h1>Test 1</h1>
      <Link href="/test1/test2">Go to Test 2</Link>
    </>
  );
}
```

그다음 test1 폴더 밑에 test2라는 폴더를 만들고 그 밑에 page.tsx 파일을 아래와 같이 만들겠습니다.

```js
// /src/app/test1/test2/page.tsx

import Link from "next/link";

export default function Test2() {
  return <h1>Test 2</h1>;
}
```

이렇게 두 개의 중첩된 라우팅을 만들었고 test1 라우팅에서 test2 라우팅으로 이동하면 정상적으로 작동하게 됩니다.

그러면 test1 라우팅에서 test2 라우팅으로 가는 라우팅을 인터셉팅 해 보겠습니다.

가로채려고 라우팅이 test2이므로 간단하게 생각해서 test2 폴더와 같은 위치에 아래와 같이 폴더를 만듭니다.

```sh
/test1/test2
/test1/(.)test2
```

그리고 `/test1/(.)test2` 폴더에 page.tsx 파일을 만들고 아래와 같이 작성합니다.

```js
export default function InterceptedTest2() {
    return <h1>Intercepted Test 2</h1>;
}
```

인터셉티드 됐다는 내용을 화면에 보여주는 겁니다.

이제 다시 test1 라우팅으로 가서 Go to Test 2 링크를 클릭해 보겠습니다.

아까랑 변한 게 없으면 개발 서버를 중지하고 다시 실행해 보시면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEilIDMNw_6UFqioPHjiywpam6vzt3bb9Q8ClFD-Hn8K7bVUlbCXiwgRMx8qnffxJLwhNW_r2KydcVnA2tIqyv-HDZw8nKoOgtgqq0yUzxm-ci-8HaDT6kewV_ZRqn_cEabWLsGPvnjSPUZe_KIgDSMxsZRLjRqEJqk9etd3GcDmZ250aZv3YuUxjBH1qIM)

아까랑 다르게 위와 같이 인터셉티드된 화면이 보입니다.

인터셉팅 라우팅이 정상 작동하고 있다는 뜻입니다.

그러면 현재 상태에서 브라우저를 새로고침해볼까요?

그러면 아래 그림과 같이 아까 만들었던 `/test1/test2` 라우팅이 나타날 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEg9xJBwZoozrk8YLdceYmE9RNs5nkYudka-vZIvVkmGuDNEgktQY86FN471IS1wffofEo_RF6BKsuvTAs2zx_hatuMmArVc1VaGfu4wjfJ_xU-rpAOsGvaemNILphfay-q_Pd3anfeGz8HA8GuSkCoXei0ShtqD9AWQ50U_9fd2zWFqIU9w3Tsb4Bg17yg)

지금까지 인터셉팅한게 바로 `/test1/test2` 라우팅입니다.

인터셉팅하려고 하는 라우팅을 정하면 동일 레벨에서 `(.)test2`이라고 같은 이름 앞에 괄호를 붙이는데 그 괄호 안에는 점 하나를 적으면 됩니다.

보통 유닉스에서 점 하나는 폴더를 옮길 때 현재 폴더를 나타냅니다.

그러면 `..` 점 두개는 뭘까요?

바로 한 단계 상위 폴더를 가리킵니다.

그러면 인터셉팅 라우팅에서도 `(..)test3` 이라고 한 단계 위의 라우팅을 가로챌 수 있다는 의미인데요.

맞습니다.

아까 만들었던 test1과 test2와 헷갈리니까 테스트를 위해 test3과 test4 라우팅을 만들겠습니다.

test3 폴더 밑에 test4 폴더를 만드는 겁니다.

test3는 당연히 app 폴더 바로 밑에 만들고요.

이번에는 test4 라우팅에서 test3로 가는 링크를 만들겠습니다.

```js
// src/app/test3/page.tsx

export default function Test3() {
    return <h1>Test 3</h1>;
  }
```

```js
// src/app/test3/test4/page.tsx

import Link from "next/link";

export default function Test4() {
  return (
    <>
      <h1>Test 4</h1>
      <Link href="/test3">Go to Test 3</Link>
    </>
  );
}
```

이제 테스트를 해보면 정상 작동할 건데요.

이제 인터셉팅 라우팅을 만들어야 하는데, 뭘 인터셉팅하는지 정해야 합니다.

아까 test4 에서 test3로 가는 링크를 인터셉팅 하기로 했습니다.

그런데 test4에서 볼 때 test3는 한 단계 위에 있죠.

그래서 `(..)`처럼 점이 두개 필요한 겁니다.

그러면 test4 폴더와 같은 레벨에 아래와 같은 폴더를 만듭니다.

```sh
/src/app/test3/test4
/src/app/test3/(..)test3
```

그리고 `(..)test3` 폴더의 page.tsx 파일에는 아래와 같이 코드를 채워 넣으면 됩니다.

```js
// src/app/test3/(..)test3/page.tsx

export default function InterceptedTest3() {
    return <h1>Intercepted Test 3</h1>;
  }
```

이제 개발 서버를 중지했다가 다시 시작합시다.

이제 브라우저에서 주소가 `/test3/test4`인 상태에서 Go To Test 3 링크를 클릭하면 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjNMBXN63IfcV2S0DQhMVR5MA-yfVMb09r6oxPvnOVgPNBRQuhTW1rGESGNvib3FFZcUHAB5VWlYOdRo9QMNchNv6P7TinXCabMR4H276WezzLMbCebC0uihGPYxeL-75Bi0XSzcwtwd-nCpNdp7FQC-yEHAlF73CgdevlFzX70FRKGuN_-ANgX4XNPOtc)

상위 레벨의 인터셉팅 라우팅이 정상 작동하네요.

이 상태에서 브라우저 주소창을 보면 `http://localhost:3000/test3`입니다.

`/test3` 라우팅을 인터셉팅 한 거니까요.

이제 새로 고침하면 원래 `/test3` 링크가 보일 겁니다.

이론상으로는 test3와 test1이 같은 레벨이니까 test1 라우팅도 인터셉팅할 수 있습니다.

한번 해보십시오.

자! 그러면 `(.)`와 `(..)`가 있으니까 `(...)`처럼 두 단계 위로 올라가는 인터셉팅 라우팅이 있을 거라고 생각되는데요.

맞습니다.

그런데 두 단계 위 인터셉팅 라우팅은 `(..)(..)`처럼 점 두 개를 연속으로 붙인 거고 점 세 개는 최상단 라우팅을 가로채기 위해 존재하는 겁니다.

`(..)(..)` 처럼 두 단계 위 라우팅은 직접 구현해 보시고, `(...)` 처럼 최상단 app 라우팅을 가로채는 걸 보여드리겠습니다.

우리가 예전에 만들었던 `/about` 라우팅이 아래 그림과 같이 있는데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhJdUgpLUcLD-ijSpe56gCo6zBMiY0OyJfWO8074Cp2r3fZCmw0R2oQJxP5gQJH7ugThmbEx08qFb8k2Q21rQqDJ5PWqjLnB1fYeIu_vDkP6m5Da5t3lXsZsRUDRB2ceg2Rf_MBj20my3evTkC__WMeFgboDXVlY00sclWduy1j7whqdK6D56TbksId60k)

test4 라우팅에서 `/about` 가는 라우팅을 가로채 보겠습니다.

test4 폴더의 page.tsx 파일을 아래와 같이 about으로 가는 링크를 추가하게끔 고치겠습니다.

```js
// src/app/test3/test4/page.tsx

import Link from "next/link";

export default function Test4() {
  return (
    <>
      <h1>Test 4</h1>
      <Link href="/test3">Go to Test 3</Link>
      <Link href="/about">Go to About</Link>
    </>
  );
}
```

아래 그림과 같이 Go to About 링크가 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgvpqMA3KfsVoxw8T7lUm8yBrUZ1iXFXifc3ttuBXwUx6vS5Juk54NSnVvimO2Zje-YdneKDQJEvKN4Dc9SAmOo9iFIyYbdwQYfYVLIZErTJTGbIDiowCX5VzHfx7234WwacfxbV8cgX0J2mOuV42PurhnjeBOfxQg_PYOrepyaT3q5yCUY6azRn_OToSc)

지금 상태에 그냥 클릭하면 단순하게 `/about` 라우팅으로 이동할 겁니다.

이제 인터셉팅을 위한 폴더를 만들겠습니다.

test4 폴더 밑에 `(...)about`이라고 폴더를 만들고 그 밑에 page.tsx 파일을 아래와 같이 만들겠습니다.

```js
// src/app/test3/test4/(...)about/page.tsx

export default function InterceptedAbout() {
  return <h1>Intercepted About</h1>;
}
```

이제 개발 서버를 중지하고 다시 돌리고 링크를 클릭해 보면 아랭 그림과 같이 인터셉팅 라우팅이 작동할 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiFGQC-E4k9E_zmDMPOo8DLaPG1RETxli2ysXvyjRa15ZbnBVv1AOM47haZVAR5OeG429XHxVIyDN68lSm1Rt3wb2J-Lj1B47f5S6CWQ5edHGKxKJxMepxaQVh4SEmmoqQ5aw05FMs3dLJGxRuypfK5lO9w-wlzm0ST-Bs5fzfVSTJAyORMgdPaE19qMjc)

위 그림을 보시면 브라우저 주소가 `localhost:3000/about`입니다.

그리고 이 상태에서 새로 고침하면 원래 about이 나오고요.

`(...)` 인터셉팅 라우팅 방식은 `(...)about` 폴더의 위치를 인터셉팅 라우팅이 클릭되는 주소의 아무 폴더 밑에 나둬도 됩니다.

아까전에는 `(...)about` 폴더를 test4 폴더 밑에 뒀었는데요.

test3 폴더로 이동해 보겠습니다.

이동한 후 개발 서버를 재시동하고 테스트해 봐도 작동합니다.

왜냐하면 about 링크를 클릭하는 주소가 `/test3/test4`이기 때문입니다.

즉, test3나 test4 폴더 어디에 둬도 된다는 뜻입니다.

그런데 이번에는 `(...)about` 폴더를 test1 폴더로 이동해서 테스트해 보면 작동하지 않습니다.

왜냐하면 about을 누르는 주소가 바로 `/test3/test4` 라는 주소이기 때문입니다.

`/test3/test4`라는 주소로 볼 때 test3 폴더 밑으로 `(...)about` 폴더가 없기 때문입니다.

그러면 `/test1/test2` 주소에서 `/about`으로 가는 링크를 클릭하면 인터셉팅 라우팅이 정상 작동할 겁니다.

지금까지 인터셉팅 라우팅을 알아봤는데요.

그러면 병렬 라우팅일 경우 인터셉팅 라우팅도 알아봅시다.

---

## 병렬 인터셉팅 라우팅(Parallel Intercepting Routes)

제일 처음에 인터셉팅 라우팅을 소개할 때 실제 사용하는 경우는 모달 창을 이용한다고 했었는데요.

모달창을 이용하기 위해서는 병렬 라우팅을 이용하면 됩니다.

그래서 병렬 인터셉팅 라우팅을 구현해 볼 건데요.

app 폴더 밑에 photo 라는 폴더와 photo 폴더 밑에 다이내믹 라우팅인 `photo/[id]` 폴더를 만들겠습니다.

먼저, photo 폴더 밑에 layout.tsx 파일과 page.tsx 파일을 아래와 같이 만듭니다.

```js
// src/app/photo/layout.tsx

export default function PhotoLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <h1>This is a Photo Layout</h1>
      <div className="px-2 py-10">{children}</div>
    </div>
  );
}
```

```js
// src/app/photo/page.tsx

import Link from "next/link";

export default function Photo() {
  return (
    <>
      <h1>Photo List</h1>
      <Link href="/photo/1" className="underline">
        Photo 1
      </Link>
    </>
  );
}
```

그리고 `photo/[id]` 폴더를 만들고 그 밑에 page.tsx 파일을 아래와 같이 만듭니다.

```js
// src/app/photo/[id]/page.tsx
export default function PhotoId({ params }: { params: { id: string } }) {
  return <h1>This is photo/id {params.id}</h1>;
}
```

이제 다이내믹 라우팅을 위한 준비는 끝났네요.

실행 결과는 아래와 같이 잘 되고 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEj-AtL7hWwtipbXL3ysQgYUHPn7RtD-vGTWSu2fAiezuct1yhJanZ8LFsjQU2y4dfRlNrsxU2Y9AoVi0yuz2I4yhICKh1e9q8iZeZtFT57jq3D8tN2kWqygoPmh82ZLMnyrqEgE3zLn7Ca3MoN4mxMQe3kplgV5LPtG4KYeYlIi8nRymXL8xUIR2Dj1W_4)

![](https://blogger.googleusercontent.com/img/a/AVvXsEiW83sDwRNwO0f5rs8-OdB7E260BBwyrX2QEofGnIbPTjWUn7BaVRMYzaom5YMSD1RmG6ow15TkqIHiNvD3ZAm10LbgMsSPde1JPryc8_jcrcbsZSMEUMPqJ2XXYwTlQxLXnyIXTJjb5hVenoqxjQehSKwWt3RgxSutS4UcCFQtYsBrWmLnUHoy1xx7W1Q)

이제 병렬 인터셉팅 라우팅을 준비해 보겠습니다.

photo 주소에서 photo 1을 눌러 이동할 때 이 주소는 `localhost:3000/photo/1` 주소가 되는데요.

이 주소를 인터셉팅 하겠습니다.

아까 photo 폴더 밑에 있는 layout.tsx 파일에서 보면 modal 이라는 병렬 라우팅 리액트 노드를 삽입했었는데요.

```js
// src/app/photo/layout.tsx

export default function PhotoLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <h1>This is a Photo Layout</h1>
      <div className="px-2 py-10">{children}</div>
    </div>
  );
}
```

이제 modal 리액트 노드를 JSX 안에 넣겠습니다.

```js
// src/app/photo/layout.tsx

export default function PhotoLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <h1>This is a Photo Layout</h1>
      {modal} {/* 여기가 추가한 부분 */}
      <div className="px-2 py-10">{children}</div>
    </div>
  );
}
```

이제 photo 폴더 밑에 `@`를 이용한 병렬 라우팅을 추가하면 됩니다.

`@modal` 이름이 되죠.

근데 이 우리가 최종적으로는 `photo/1` 처럼 만들려고 하는 거는 다이내믹 라우팅인데요.

그래서 `@modal` 폴더 밑에 만들어야 하는데요.

폴더 구조상 점 두 개를 이용한 인터셉팅 라우팅을 만들어야 합니다.

그래서 `@modal/(..)photo/[id]`와 같은 폴더 구조를 가져야 합니다.

왜냐하면 우리가 가로채려고 하는 주소는 `photo/1` 형태이기 때문입니다.

그리고 병렬 라우팅 에러 방지를 위해 `@modal` 폴더 밑에는 default.tsx 파일과 page.tsx 파일을 일단 만들겠습니다.

```js
// src/app/photo/@modal/default.tsx

export default function ModalDefault() {
  return <h1>Modal Default</h1>;
}
```

```js
// src/app/photo/@modal/page.tsx

export default function ModalPage() {
  return <h1>Modal Page!!!!</h1>;
}
```

이제 `photo/@modal/(..)photo/[id]` 폴더 밑에 page.tsx 파일을 만들겠습니다.

```js
// src/app/photo/@modal/[id]/page.tsx

export default function InterceptedModalPhotoId({
  params,
}: {
  params: { id: string };
}) {
  return <h1>Intercepted Photo Id {params.id}</h1>;
}
```

이제 테스트를 위한 준비가 다 끝났습니다.

개발 서버를 재시동하고 테스트 해보겠습니다.

먼저 주소창에 `localhost:3000/photo` 주소입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiuNQZQEIc33CdVrWs89rELNn7BoR7gK-RbgCioNboekgH7eYSZX0VbpJeayQSpi77uQFLBZJbr71dYdDazbK0z03zkJduAvndM_YmVFUZRrjNcjniCfqFjOy0PrdiQi4EbaYgGS6DLi4IXF5DvfPOqGtfR68hnmcCs9K_oUBOtnnmHV15zUMEDfd8jOvE)

위와 같이 'Modal Page!!!' 같이 modal 이라는 병렬 라우팅 자리가 보이네요.

그리고 이제 Photo 1 링크를 클릭하면 아래와 같이 병렬 인터셉팅 라우팅이 작동됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiZPBFuseNHItmN2jQSzrxBQn7r7qc87SeJhaJkxMzKZzXgvW3Em9609CamRr-kr9rArQr2q2seBCRxiPRhRASNNW3OZ62PNZcoBA5eviwzSPZgneyj1U1N6jBrj0V5gxbIFHQnBARqXYTMTfTswS8S_AbGJLmmFNaJbNPuqPw6ge-pHeUpZqiID3YVGAk)

위와 같이 아까 전에 'Modal Page!!!' 부분이 'Interceptd Photo Id 1'이라고 바뀌었습니다.

브라우저 주소는 `photo/1`입니다.

브라우저를 새로 고침하면 아래와 같이 나올 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiNGKN9IrBsN6X72rGWt_Uj2Yjv69bxJQfqqgJ_PCdnoUyl1U9pFh3YsF3tUmcce4SWlS_-9Xm7PTRipoyFnLhWVuBaHQ8OycmopHY650cIzvcLIgpvXeGtRxZDklDDFFusUVjP8EvbHEhT5bD43BIjVgyrhg46Xep6QIYfXjpB42wPrKTmObMjBs_yP8k)

역시 원래 `photo/[id]`라는 다이내믹 라우팅이 정상 작동하네요.

병렬 인터셉팅 라우팅은 조금 어려운데요.

인터셉팅 라우팅을 익혀두면 좀 더 인터랙티브한 UI를 구현할 수 있을 겁니다.

그럼.
