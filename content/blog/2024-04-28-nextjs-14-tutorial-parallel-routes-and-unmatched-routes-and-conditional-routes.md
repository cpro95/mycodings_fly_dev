---
slug: 2024-04-28-nextjs-14-tutorial-parallel-routes-and-unmatched-routes-and-conditional-routes
title: Next.js 14 강좌 5편. 병렬 라우팅(Parallel Routes), 일치하지 않는 라우팅(Unmatched Routes), 조건부 라우팅(Conditional Routes) 알아보기
date: 2024-04-28 09:09:39.114000+00:00
summary: Next.js 14의 병렬 라우팅, 일치하지 않는 라우팅, 조건부 라우팅 알아보기
tags: ["next.js", "paallel routes", "unmatched routes", "conditional routes"]
contributors: []
draft: false
---

안녕하세요?

Next.js 14 강좌 다섯 번째입니다.

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

- [Next.js 14 강좌 5편. 병렬 라우팅(Parallel Routes), 일치하지 않는 라우팅(Unmatched Routes), 조건부 라우팅(Conditional Routes) 알아보기](#nextjs-14-강좌-5편-병렬-라우팅parallel-routes-일치하지-않는-라우팅unmatched-routes-조건부-라우팅conditional-routes-알아보기)
  - [병렬 라우팅(Parallel Routes)](#병렬-라우팅parallel-routes)
    - [병렬 라우팅 상세 설명](#병렬-라우팅-상세-설명)
    - [병렬 라우팅으로 코드 전환하기](#병렬-라우팅으로-코드-전환하기)
    - [병렬 라우팅의 장점](#병렬-라우팅의-장점)
    - [서브 내비게이션](#서브-내비게이션)
  - [일치하지 않는 라우팅(Unmatched Routes)](#일치하지-않는-라우팅unmatched-routes)
  - [조건부 라우팅(Conditional Routes)](#조건부-라우팅conditional-routes)

---

## 병렬 라우팅(Parallel Routes)

Next.js 14에서 병렬 라우팅은 고급 라우팅 기법으로, 동일한 레이아웃 내에서 여러 페이지를 동시에 렌더링 할 수 있습니다.

예를 들어 대시보드라는 라우팅을 아래와 같이 만든다고 가정하면,

![](https://blogger.googleusercontent.com/img/a/AVvXsEjqqAW__bcSDwz5hmc0VK_bFO7TyKQ_wrzYPij_QnOokp_cTJfYzuOxfOboNDpp0iA8DPxnvkGtk6nKCAHkUlBfBkWJOk_QNCQ9yKPcAK7RcBMKYjvBT-lJgWWX2obLD2tEziyTK1SASEYhadf6W3aZF4pv6Gqn_uzdD-BKpwm-UGIIV5jJRJh-4rEAbZY)

예전 방식으로 Next.js 코드를 짜면 아래와 같을 겁니다.

예전에 만들었던 dashboard 라우팅을 아래와 같이 뜯어고쳐 보겠습니다.

```js
//src/app/dashboard/layout.tsx

import User from "./user";
import Revenue from "./revenue";
import Notifications from "./notifications";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>{children}</div>
      <User />
      <Revenue />
      <Notifications />
    </>
  );
}
```

일단 위와 같이 layout.tsx 파일을 만들어서 전체적인 UI를 만들어 줍니다.

그리고 layout.tsx에서 children은 바로 page.tsx 파일의 내용이 되는 거죠.

이런 방식이 예전 방식인데요.

Next.js에서는 좀 더 유연하고 동시에 렌더링 가능한 병렬 라우팅(Parallel Routes)를 제공해 줍니다.

이제 위 코드를 병렬 코드로 바꿔 보겠습니다.

---

### 병렬 라우팅 상세 설명

먼저, 병렬 라우팅에 대해 잠시 설명해 보면.

- Next.js에서 병렬 라우팅은 '슬롯(slot)' 이라는 기능을 사용해 정의합니다.
- 슬롯은 컨텐츠를 모듈화된 방식으로 구조화하는 데 도움을 줍니다.
- 슬롯을 정의하려면 '@folder' 명명(naming) 규칙을 사용합니다.
- 각 슬롯은 해당 layout.tsx 파일에 props(프로퍼티)로 전달됩니다.

오랜만에 들어보는 slot 인데요.

Svelte를 사용하면 쓰는게 slot입니다.

slot은 원래 HTML에서 사용되는 기능입니다.

HTML의 웹 컴포넌트(Web Components)를 사용하다 보면 slot이 많이 나옵니다.

웹 컴포넌트의 Shadow DOM 내부에서 slot을 사용하면 외부 마크업을 전달받아 렌더링 할 수 있습니다.

---

### 병렬 라우팅으로 코드 전환하기

병렬 라우팅으로 전환하기 위해 아래와 같은 형식으로 폴더와 page.tsx 파일을 만들면 됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhszYyG2kN9ooxUY1iWMwZ_DrwwDKzpprbDEfs5caMVn-G1ygzkhRzQky-svqNYvSv2RnD_LSO99WQemaRaxKzptuc5xcGIMrwQN9JlfGAuCEgc3GSoRZ_CpuCPq6gJ62gBond3_wgSog4cHPvLvdtU-5UA6PUh4zlUlKniCblhl12ZTdGfRN0yPPcCEA8)

폴더에 '@'를 넣는 게 조금은 이상하에게 느껴지는데요.

이렇게 '@'를 넣으면 라우팅에서 인식이 안 됩니다.

즉, 'localhost:3000/dashboard/notifications' 주소로 작동이 되지 않는다는 얘기죠.

'@'를 넣으면 notifications 라우팅은 무조건 '/dashboard' 라우팅에서 메모리상에만 라우팅이 존재하면서 '/dashboard' 라우팅 하위에만 존재하게 됩니다.

실제 코드는 테스트를 위해 간단하게 만들어 보겠습니다.

전체적인 폴더 구조는 아래와 같습니다.

```sh
src/app/dashboard  tree . -L 2
.
├── @notifications
│   └── page.tsx
├── @revenue
│   └── page.tsx
├── @users
│   └── page.tsx
├── bar-chart.tsx
├── layout.tsx
└── page.tsx
```

각각의 병렬 라우팅에는 다음처럼 간단한 div 태그만 똑같은 걸 만들면 됩니다.

```js
// src/app/dashboard/@notifications/page.tsx
export default function Notifications() {
  return <div>Notifications</div>;
}

// src/app/dashboard/@revenue/page.tsx
export default function Revenue() {
  return <div>Revenue</div>;
}


// src/app/dashboard/@users/page.tsx
export default function Users() {
  return <div>Users</div>;
}
```

이제 병렬 라우팅을 위한 준비가 끝났기 때문에 이제 이 병렬 라우팅을 layout.tsx 파일에서 다뤄줘야 합니다.

단순한 컴포넌트 파일이 아니기 때문에 다른 방식으로 다뤄야 하는데요.

아까 설명했듯이 slot 방식이라 props로 다루면 됩니다.

```js
export default function DashBoardLayout({
  children,
  notifications,
  revenue,
  users,
}: {
  children: React.ReactNode;
  notifications: React.ReactNode;
  revenue: React.ReactNode;
  users: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <div className="px-2 py-10">{children}</div>
      <div className="flex px-2 py-10">
        <div className="flex flex-col">
          <div className="px-2 py-10 border">{users}</div>
          <div className="px-2 py-10 border">{revenue}</div>
        </div>
        <div className="flex flex-1 px-2 py-10 border">{notifications}</div>
      </div>
    </div>
  );
}
```
TailwindCSS로 조금 더 보기 좋게 border를 넣었습니다.

위 코드를 보시면 병렬 라우팅으로 만든 '@'로 시작하는 이름이 children과 비슷하게 props로 전달되었습니다.

children을 사용하듯 똑같이 사용하면 되는 거죠.

Next.js에서는 children이 layout.tsx와 같이 있는 page.tsx 파일에 해당하듯이 병렬 라우팅에서는 '@' 이름으로 시작하는 slot을 위와 같이 사용하면 됩니다.

'npm run dev'를 다시 끄고 실행해야 할 겁니다.

이제 실행 결과를 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEj3r6Au70gHO1Rh9tTtPJ22QfKHMWdRLBtmq3DWDgEGg3tIcckMiEpgPn_l6B-SRUJyFugD1q7R2r3YxtDV5yXjYhioH2N8DEZVbPnR-WiWd4tvOvCIdDAftRChSny_QIvi2PAGd3U6bvjQ8WIUcy18jbIfPorfu9wfwXU0unC_q4zkrzcn_C4700-rkB4)

위와 같이 우리가 원한 레이아웃이 나왔습니다.

children 슬롯도 엄밀히 따지면 'dashboard/@children/page.tsx'라고 만들면 됩니다.

이제 아까 얘기했던 병렬 라우팅의 특징을 테스트해 보겠습니다.

dashboard 주소 밑에 users 주소를 넣어서 브라우저에서 확인해 보겠습니다.

`localhost:3000/dashboard/users`

![](https://blogger.googleusercontent.com/img/a/AVvXsEgkzasRfDnGUhCs_jXs7h6WPjZmD9gZzsq1BqTOXUTQKvVvQU4-wWaKRGAIZxUOBk46Z_H0JBjHbR_DGdQtllJMJXLZL4SaWc26TPLGgHoExYJvJM9KJLzrnbITRfkrTd6co8VRATR8rSKTGT0GSyyFbjdeUGJfTHpA1hSMXJ_iD_-TAfgjkFdVbcvk-gM)

위와 같이 404 에러 페이지가 나옵니다.

그러면 '/dashboard/@users'라고 '@'를 넣어서 테스트해 보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgfWNbahYkYQ0aVVGgrtYSlFV_o9GbcbXc1rXkAYDSEdCXjhwOoPegaAKYVLYM87zVzRpU9qiYySKCEhWqSQp1EjYL8pjVTO42E-6qNdMmBJTV_TqSNVw7X_g-Y2PlEcsWkD4fyqAFnm4RGsez7cVBzdfHjX7b5wxxMyI7byjbxeMFr0cptXlV5FkqIz-k)

즉, dashboard 라우팅 밑에는 표먼적으로 users 라우팅이 없고, 우리가 병렬 라우팅으로 만든 건 모두 dashboard 라우팅 안에서만 존재하는 라우팅이 되는 거죠.

---

### 병렬 라우팅의 장점

병렬 라우팅의 장점은 단일 레이아웃을 다양한 슬롯으로 분할할 수 있어 코드 관리가 수월해집니다.

그리고 독립적인 라우팅 처리와 서브 내비게이션이 가능해는 효과가 있는데요.

독립적인 라우팅 처리는 간단합니다.

loading.tsx 파일과 error.tsx 파일을 슬롯별로 다르게 관리할 수 있는데요.

예를 들어 dashboard를 로드하면 Users 부분에서 에러가 발생했다면 User 슬롯 부분만 에러 표시가 되고 나머지 Notifications, Revenue 슬롯은 정상적으로 화면에 보여 질 겁니다.

그리고 Users, Notifications, Revenue 슬롯이 병렬적으로 로딩되기 때문에 3개가 동시에 똑같이 로드되지 않습니다.

이럴 때 loading.tsx 파일을 적용하면 페이지 로드가 느린 부분은 loading UI를 화면에 띄울 수 있는 거죠.

그림으로 표현하면 아래와 같습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhgyGHS0bOf0pNRNBqhQ8SbypXTMhzF4YjY4iFF8Ru01h_CFHRYODZf42I1_BGsNk9I0YUkDbssvtBPUUZD0jIUxKUOBniJ_PlFMvrYYkuqxWO2kQEtp_1IWXIzea0V7_V9B3KQAjWaqUTaXI4uZ8SZZakF521xDCEqNXOliZqcY2BqUtR2GeXliO3BBL4)

---

### 서브 내비게이션

대시보드의 각 슬롯은 본질적으로 독자적인 내비게이션과 상태 관리 기능을 갖춘 미니 애플리케이션으로 기능할 수 있는데요.

이는 각기 다른 목적을 가진 여러 섹션으로 구성된 복잡한 애플리케이션인 즉, 우리가 만든 대시보드 같은 곳에서 특히 유용합니다.

그래서 우리가 만든 슬롯 밑에도 서브 라우팅을 구현할 수 있습니다.

Next.js에서는 서브 내비게이션이라고 합니다.

그러면 예를 들어 Notifications 슬롯이 미니 애플리케이션으로 구성해야 한다고 가정합시다.

그래서 Notifications 섹션을 두 가지로 보여줄 필요가 있다고 판단할 수 있는데요.

예를 들어 Older Notifications을 보여주는 라우팅을 만들어 봅시다.

url 주소는 `dashboard/older-notifications`으로 만들 겁니다.

단, '@notifications' 섹션의 하위 라우팅 즉, 서브 내비게이션으로 만들겠습니다.

먼저, Notifications 간 전환을 위해 기존 Notifications에 Link 태그를 추가하겠습니다.

```js
//src/app/dashboard/@notifications/page.tsx

import Link from "next/link";

export default function Notifications() {
  return (
    <>
      <div>Notifications</div>
      <Link className="px-4 underline" href="/dashboard/older-notifications">
        Older Notifications
      </Link>
    </>
  );
}
```

'@notifications' 폴더에 'older-notifications' 폴더를 만들고 page.tsx 파일을 만들면 됩니다.

```js
import Link from "next/link";

export default function OlderNotifications() {
  return (
    <>
      <div>Older Notifications</div>
      <Link className="px-4 underline" href="/dashboard">
        Notifications
      </Link>
    </>
  );
}
```

이제 브라우저에서 볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEjXvNlydPczssKckXp3lPKOtuQxFWeM1nVAHaMQR-SoFVqbDS3x0clrBVRtdVCSJOnYOe4AHExG5R8gSrTe0YdDqIxJIyVmu9zjCHIqouNClsYoB_oB4e5YFjWnDU5a5EgQSzHXqUzKzEGjZ03iDmXt4r36DayXFDVIrOUhWKqM2crLCBtOru_hduppN4w)

위와 같이 Older Notifications으로 가는 링크가 잘 적용되고 있네요.

링크를 따라 Older Notifications 주소로 가보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhD3lWNsBfcP05LiLZfoxlhCeXDom3QirOk4T2c30SRk99FYNAThm77lJq991vSp80NjHc7BOg9ACCFIxMoCDQ2wJbSPD8tYpMEg5XG6Jm4s-rqQgkif5_L89to4ArOo8nkYulEKv-jvJHgD78Razan3IdbHhtHq6rtxh6Cq-l-Kb5UOMRzla4Ns2d4qZ8)

위 그림에서 URL 부분을 보시면 'dashboard/older-notifications'이라는 주소가 명확하게 보입니다.

지금까지 구현한 게 바로 병렬 라우팅에서의 서브 내비게이션입니다.

---

## 일치하지 않는 라우팅(Unmatched Routes)

방금까지 배운 게 서브 내비게이션인데요.

UI안에서의 내비게이션의 경우, Next.js는 URL이 변경되더라도 이전에 활성화된 상태의 슬롯을 유지합니다.

그래서 Users, Revenue, Children 이라는 다른 슬롯의 상태를 그대로 유지하면서 Older Notifications과 그냥 Notifications 간 링크를 타고 라우팅이 이루어지는데요.

문제는 페이지 새로고침 시 발생합니다.

older-notifications 주소일 경우 페이지를 강제로 새로고침해볼까요?

![](https://blogger.googleusercontent.com/img/a/AVvXsEifys8_IVKR2eKTgMvsGOOQjmyrwa4frtkUXAGmDpv36Cl0jxX-nZNz9m7fBxycDhHKb4nKOFDgYel7N1Fs6n-TaLFeKhmi4uBOr2uV4E8X6vA8HjAQaWYk7slQh5mbZH-mZ3nIFivWXVzujMN8_A1x1KYkQpko7yx7E1nV5HzJxN1bQx9oRQxPktSBLQE)

위와 같이 404 에러가 발생합니다.

위 그림의 현재 주소는 older-notifications 상태죠.

슬롯이 하나의 미니 애플리케이션 역할을 한다고 했는데요.

'@notifications' 슬롯에는 older-notifications 라우팅에 대한 폴더가 존재합니다.

그런데 새로고침 시는 현재 활성화된 상태의 슬롯을 유지 못합니다.

상태가 어떻게 이어져 왔는지 메모리에 있어야 하는데 페이지 새로 고침시 강제로 해당 상태가 사라지기 때문이죠.

이럴 때 Children, Users, Revenue 슬롯이 Unmatched Rotues 가 되었다고 합니다.

용어 Unmatched Routes는 이럴 때 사용하는 용어입니다.

그러면 404 에러 페이지 말고 그냥 각 슬롯의 page.tsx 파일을 보여주면 되는 거 아닌가 싶은데요.

Next.js는 이럴 때를 대비해서 'default.tsx' 파일이라는 Special files를 준비해 놨습니다.

즉, 페이지 새로고침 시, Next.js는 각 일치하지 않는 슬롯 내에서 default.tsx 파일을 즉시 검색합니다.

이 파일의 존재 여부가 중요한데, Next.js가 화면에 렌더링할 기본 컨텐츠를 제공하기 때문입니다.

현재 라우트에 대해 일치하지 않는 슬롯 중 하나라도 default.tsx 파일이 없다면, Next.js는 404 오류를 렌더링합니다.

Next.js에서 'default.tsx' 파일은 프레임워크가 현재 URL에서 슬롯의 활성 상태를 가져올 수 없을 때 컨텐츠를 렌더링하기 위한 fallback 역할을 하는 건데요.

이때 일치하지 않는 라우팅에 대한 UI를 프로그래머가 자유롭게 정의할 수 있습니다.

즉, page.tsx에 있는 컨텐츠를 그대로 반영하거나 아니면 좀 더 다른 UI를 구성할 수 있는 거죠.

여기서는 테스트를 위해 page.tsx 파일 안의 내용을 그대로 쓰겠습니다.

그리면 여기서 default.tsx 파일이 몇 개가 필요할까요?

현재 Notifications 슬롯은 Matched Routes이니까 나머지 슬롯인 Children, Users, Revenue 세 개의 슬롯에 대한 default.tsx 파일이 있어야 합니다.

하나라도 없으면 페이지 새로고침 시 404 에러가 납니다.

dashboard 폴더에 layout.tsx, page.tsx 파일과 같은 위치에 default.tsx 파일을 아래와 같이 만들면 됩니다.

```js
// src/app/dashboard/default.tsx
export default function DefaultDashboardPage() {
    return <h1>Default DashBoard</h1>;
  }

// src/app/dashboard/@revenue/default.tsx
export default function DefaultRevenue() {
    return <div>Default Revenue</div>;
  }
  
// src/app/dashboard/@users/default.tsx
export default function DefaultUsers() {
    return <div>Default Users</div>;
  }
```

이제 older-notifications 상태에서도 페이지 새로고침 해도 404 에러가 나오지 않을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhUtJsgI1NPYojS7Za4pcwp_C2HVts-vy7B4LsgKDwhggiZJEMi2rsGxiILmPDSvvMKRwUVEoIAhq-NVWmU6thvZqXEGdW45qKBkK_4N2xAtOBz7AsAD6Zh3PErhQeF_G5dAwyPI2d5dX91hXXSsIYdg7-Idetzn3T9e72MdYYh_Gh4es4VkKMuOfmWOs8)

위 그림과 같이 Default 라는 문구가 선명히 보입니다.

즉, 새로고침시 default.tsx 파일이 로드되었다는 뜻이죠.

---

## 조건부 라우팅(Conditional Routes)

이번 섹션은 병렬 라우팅에서 조건부 라우팅을 어떻게 적용하는지 살펴볼 겁니다.

예를 들어 Users 섹션에서 유저가 로그인되었을 때 어떻게 보일 지 조건부 라우팅을 이용하는 거죠.

로그인되었을 때는 기존에 만든 '@users' 슬롯을 보여주고, 로그인되어 있지 않을 때는 '@login' 슬롯을 보여 주는거죠.

그러면 '@login' 슬롯을 새로 만들어야겠네요.

```js
// src/app/dashboard/@login/page.tsx

export default function Login() {
  return <h1>Please login</h1>;
}
```

이제 새로운 슬롯을 만들었으면 layout.tsx 파일에서 슬롯을 props로 처리해 줘야 합니다.

```js
export default function DashBoardLayout({
  children,
  notifications,
  revenue,
  users,
  login,
}: {
  children: React.ReactNode;
  notifications: React.ReactNode;
  revenue: React.ReactNode;
  users: React.ReactNode;
  login: React.ReactNode;
}) {
  const isLoggedIn = true;

  return isLoggedIn ? (
    <div className="flex flex-col w-full">
      <div className="px-2 py-10">{children}</div>
      <div className="flex px-2 py-10">
        <div className="flex flex-col">
          <div className="px-2 py-10 border">{users}</div>
          <div className="px-2 py-10 border">{revenue}</div>
        </div>
        <div className="flex flex-1 px-2 py-10 border">{notifications}</div>
      </div>
    </div>
  ) : (
    login
  );
}
```

위와 같이 props에 login을 추가했고, isLoggedIn 변수를 만들어서 조건부 라우팅을 구현했습니다.

슬롯을 다시 만들었기 때문에 개발 서버를 재시동해야할 겁니다.

이제, isLoggedIn 변수를 강제로 false 바꿔서 테스트를 진행해 보겠습니다.

```js
const isLoggedIn = false;

  return isLoggedIn ? (
    <div className="flex flex-col w-full">
      <div className="px-2 py-10">{children}</div>
      <div className="flex px-2 py-10">
        <div className="flex flex-col">
          <div className="px-2 py-10 border">{users}</div>
          <div className="px-2 py-10 border">{revenue}</div>
        </div>
        <div className="flex flex-1 px-2 py-10 border">{notifications}</div>
      </div>
    </div>
  ) : (
    login
  );
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEi-7DTt19BnDlr7heWlA4dN1Igym9TPsza2HJtsoiiKnDT8d8V3Yk_Qb6MC4-X0cHhY6BUJ7d2M6ynuR6HpwWnrnPB0NzlXgo2fHnSlBKe-e54UpX_I1vpjVgyS8ADiubYsQ_6V1FGUz3ArXdYYItYfLO7eXIp50ovDAtMFf6VuK8FzJAg1dum2s8Ozs1w)

위와 같이 조건부 라우팅이 완벽하게 작동하네요.

지금까지 병렬 라우팅에 대해 알아봤는데요.

병렬 라우팅이야 말로 Next.js의 가장 강력한 기능이라고 말할 수 있겠네요.

그럼.