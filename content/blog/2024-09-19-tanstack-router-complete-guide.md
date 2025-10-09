---
slug: 2024-09-19-tanstack-router-complete-guide
title: TanStack Router 완전 정복 - 웹 개발을 위한 최적의 라우터
date: 2024-09-19 08:07:34.773000+00:00
summary: TanStack Router는 타입 안전한 자바스크립트 기반의 강력한 라우팅 프레임워크입니다. 이 글에서는 Router의 주요 기능과 활용 방법을 상세히 소개하며, 풀스택 웹 애플리케이션 구축에 필요한 정보를 제공합니다.
tags: ["TanStack Router", "Type Safe", "Routes", "Routing", "라우팅"]
contributors: []
draft: false
---

![](https://blogger.googleusercontent.com/img/a/AVvXsEidjHhbi-YXQlslzNKNuzT4g9k0nolw_oabiO6CySVzJ2LWS3nHgZovp4ILGqeznMZ2yc2zxYeNm7cehj1jIfb_Mq52H_vJX4kOHHV81F1IefAEa7BPcnsVvToCB0O3oRy0P8PvFg1dsn7UR4Ykl3CL-lqVlBSMUiBaL1XqJt4EZ4pOqmmYnGuebDPBsyI)

안녕하세요?

오늘은 Tanstack Router에 대해 공부해 보겠습니다.

[TanStack Router](https://tanstack.com/router/latest)는 기본적으로 완벽한 기능을 갖춘 클라이언트 사이드 자바스크립트 애플리케이션 프레임워크입니다.

이 프레임워크는 중첩된 레이아웃과 라우팅의 모든 지점에서 효율적인 데이터 로딩 기능을 갖춘 네비게이션 시스템을 제공하는데요, 무엇보다도, 모든 것이 Type-Safe 하게 작동한다는 점이 가장 큰 장점입니다.

그리고 TanStack Router에 서버 사이드 기능을 추가하는 [TanStack Start](https://tanstack.com/start/latest)라는 프로젝트가 현재 진행되고 있어 기대가 큰데요.

이를 통해 서버 사이드 기능을 갖춘 Router를 사용하여 풀스택 웹 애플리케이션을 구축할 수 있게 됩니다.

Remix Framework이 React Router와 통합을 발표했듯이 Router 프레임워크에서 풀스택을 구현하는게 추세가 되었습니다.

또한 TanStack Start는 TanStack Router 위에 서버 레이어를 직접 적용할 예정이어서, 아직 Router를 잘 모르는 분들에게는 지금이 Router를 알아두기에 완벽한 시기인 것 같습니다.

---

## 설치

Tanstack Router는 별도의 CLI 프로그램을 제공해줍니다.

터미널 상에서 아래와 같이 실행하면 됩니다.

```sh
npm create @tanstack/router@latest tanstack-router-test
Need to install the following packages:
@tanstack/create-router@1.58.4
Ok to proceed? (y)
? Select a bundler vite
✔ dependencies installed
✔ project built
Success Created tanstack-router-test at /Users/cpro95/Codings/blog/tanstack-router-test

now go to your project using:
  cd /Users/cpro95/Codings/blog/tanstack-router-test

then start the development server via:
  npm run dev

➜ cd tanstack-router-test
```

트리 구조를 조금 살펴보면, src 폴더에 main.tsx 파일이 있고, 그 다음으로 routes 폴더가 있습니다.

routes 폴더에서 Tanstack Router의 모든 코드를 작성하면 됩니다.

개발 서버를 돌려보면 브라우저에 아래와 같이 나옵니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiKeL_bqA1gnh4AwX9k5Qzzjanl1iFWHCKzBlPcpzULceQFl8MD9-AcbkjOazovufavfrVos5JPVRI5WtQNK_GA1Qx2ZevYtmgXFMZdmssm7iTntGYTTZYqDtmgD15bE9K6tYUqb8i2BukRVDFMvox1YWsXRhBPIAZi5mAQ6lgoRPsTDrRQofSumvCSJsQ)

그리고 오른쪽 밑에 Devtools도 보이는데요, 클릭하시면 아래와 같이 보일겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiGOhccsawgSr484dSBaNuvVxDkzl_6ECoMY6Y8QXWXkHCiF6g7GLYoD5SelirAErM9pn_v8piPzLH9_drLBrH4hsSIsLSpjqjVVpqQORcN1TyEwMOz9bzJuf7WwM2BQIl4u8xvu9qH5Rlv59z8l7aZvDDjs0-xO2v4xMKlH7LF2ghYvlCoOSq_5C3Pu98)

이제 개발 준비가 모두 끝났습니다.

본격적인 공부에 들어가 보도록 하겠습니다.

---

### The Root Route

src 폴더 밑에 routes 폴더가 있고 그 밑에 `__root.tsx` 파일이 있습니다.

보통 루트 레이아웃(root layout)이라고 합니다.

이 파일은 `routes` 폴더 바로 아래에 위치합니다.

```javascript
import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2 text-lg">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>{' '}
        <Link
          to="/about"
          activeProps={{
            className: 'font-bold',
          }}
        >
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
```

`createRootRoute` 함수는 이름에서도 알 수 있듯이 그 역할을 그대로 수행합니다.

`<Link />` 컴포넌트는 링크를 생성하는 역할로, 사용법이 비교적 직관적입니다.

Router는 현재 활성화된 링크에 `active` 클래스를 추가해주어 스타일링을 쉽게 할 수 있으며, `aria-current="page"` 속성도 함께 추가됩니다.

마지막으로, `<Outlet />` 컴포넌트는 이 레이아웃에서 "콘텐츠"를 렌더링할 위치를 Router에 알려주는 역할을 합니다.

Tanstack Router 개발에서 가장 중요한 점은, 개발 중인 watch 프로세스가 우리가 추가할 경로를 모니터링하고 `routeTree.gen.ts` 파일을 유지 관리한다는 것입니다.

이 파일은 경로에 대한 메타데이터(metadata)를 동기화하여 정적 타입(static types)을 구축하는 데 도움을 주며, 이를 통해 안전하게 경로를 다룰 수 있습니다.

위 예제에서는 `createRootRoute` 함수의 RootComponent를 별도로 만들었는데요.

한꺼번에 만드는 방법도 있습니다.

```tsx
import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/about"
            activeProps={{
              className: "font-bold",
            }}
          >
            About
          </Link>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </>
    );
  },
});
```

어떤 방식이 더 좋을지는 개발자 마음입니다.

### 루트("/") 페이지

이제 루트 페이지를 알아봅시다.

Tanstack Router에서는 `index.tsx` 파일을 사용하여 루트 `/` 경로를 나타냅니다.

이 파일은 경로 트리의 어느 위치에 있든지 상관없습니다.

개발 서버가 실행 중이라면 다음과 같은 코드가 자동으로 생성되는데요.

`index.tsx` 파일을 지우고 다시 `index.tsx`파일을 만들면 아래와 같이 자동으로 코드가 채워집니다.

```javascript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <div>Hello /!</div>,
})

```

메타 프레임워크(Meta Framework)인 Next.js나 SvelteKit과는 다르게 약간의 보일러플레이트(boilerplate)가 더 많이 필요합니다.

이러한 프레임워크에서는 단순히 React 컴포넌트를 `export default`하거나, 일반적인 Svelte 컴포넌트를 작성하면 모든 것이 자동으로 작동하지만, TanStack Router에서는 `createFileRoute` 함수를 호출하고 현재 위치한 경로를 전달해야 합니다.

경로는 Router의 타입 안전성을 위해 필요하지만, 개발 프로세스는 새로운 파일에 대해 이러한 코드를 자동으로 생성하고 경로 값을 동기화해줍니다.

예를 들어, 경로를 다른 것으로 변경하고 파일을 저장하면 자동으로 다시 변경됩니다.

예를 들어 `junk`라는 폴더를 생성하고 파일을 그곳으로 이동시키면 경로가 `/junk/`로 변경됩니다.

(junk 폴더로 이동한 후)

```javascript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/junk/')({
  component: () => <div>Hello /!</div>,
})
```

이제 다시 routes 폴더 바로 밑으로 이동시킵시다.

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <div>Hello /!</div>,
})
```

위 코드와 같이 "/" 로 바뀐걸 볼 수 있을 겁니다.

---

### 라우팅 추가하기

이제 라우팅을 더 추가해서 만들어볼까요?

루트 레이아웃에서 'tasks' 라우팅과 'epic' 라우팅을 추가해 보겠습니다.

Router는 기본적으로 파일 기반 라우팅(file-based routing)을 사용하지만, 다른 방식과 혼합하여 사용할 수 있습니다.

경로와 일치하는 폴더 안에 파일을 넣을 수도 있고, 개별 파일 이름에 점(.)을 사용하여 경로 계층 구조를 나타낼 수도 있습니다.

플랫 라우트(flat routes)를 잠깐 알아봅시다.

`tasks.index.tsx` 파일을 생성해보겠습니다.

이는 가상의 `tasks` 폴더 안에 `index.tsx`를 만드는 것과 동일한데요.

파일 이름만 저장하면 아래와 같이 개발 서버가 기본 라우팅 코드를 제공합니다.

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tasks/')({
  component: () => <div>Hello /tasks/!</div>,
})
```

좀 더 다른 내용을 추가해 보겠습니다.

```javascript
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks/")({
  component: Index,
});

function Index() {
  const tasks = [
    { id: "1", title: "Task 1" },
    { id: "2", title: "Task 2" },
    { id: "3", title: "Task 3" },
  ];

  return (
    <div>
      <h3>Tasks page!</h3>
      <div>
        {tasks.map((t, idx) => (
          <div key={idx}>
            <div>{t.title}</div>
            <Link to="/tasks/$taskId" params={{ taskId: t.id }}>
              View
            </Link>
            <Link to="/tasks/$taskId/edit" params={{ taskId: t.id }}>
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEiyU-v8LoCG0poAs6WD4023qilCxff8Yl5sbft8EdkXGQmfJfQlngLZRT0fYQBoZI52_Zq8ykOfyTZ-P2pnl-wEfm0FcflTd8mlzUgucYq4VWKx8xwbJNvBdnlkEcB_wohzxUPiKZ93AmmDQB8XrgI7JZun-H6PoISkd92L6J81Iv8kbO9a14EZPgwGq6w)

위 그림과 같이 라우팅이 제대로 작동합니다.

다만 루트 레이아웃에 tasks 라는 상단 네비게이션이 없는데 여러분께서 직접 추가해보십시요.

계속하기 전에 모든 `tasks` 경로에 대한 레이아웃 파일을 추가해봅시다.

이는 `/tasks` 아래로 라우팅(routed)되는 모든 페이지에 공통적으로 표시될 내용을 담고 있는데요.

Next.js나 Remix에서는 레이아웃 라우팅이라고 하죠.

`tasks` 폴더가 있다면 `route.tsx` 파일을 그 안에 넣으면 되지만, 플랫 파일(flat files)을 사용하고 있으므로 `tasks.route.tsx` 파일을 추가하겠습니다.

`tasks.route.tsx` 이라는 파일을 만들기만 해도 아래와 같이 자동으로 코드가 생성됩니다.

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tasks')({
  component: () => <div>Hello /tasks!</div>,
})

```

이제 `tasks` 라우팅의 레이아웃 라우팅을 아래와 같이 수정해 봅시다.

```javascript
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks")({
  component: () => (
    <div>
      Tasks layout <Outlet />
    </div>
  ),
});
```

그리고, 항상 그렇듯이 `<Outlet />`을 잊어버리면 안됩니다.

현재 만든건 레이아웃 라우팅이라 하위 라우팅이 속하는 위치를 `<Outlet />`으로 지정해야합니다.

그렇지 않으면 해당 경로의 실제 내용이 렌더링되지 않습니다.

다시 말해, `xyz.route.tsx`는 전체 경로에 대해 렌더링되는 컴포넌트이며, 이는 기본적으로 레이아웃(layout) 역할을 하지만 Router는 이를 경로(route)라고 부릅니다.

반면 `xyz.index.tsx`는 해당 경로의 개별 경로 파일입니다.

이제 렌더링된 모습을 확인해보겠습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjr7f8Sx6TzhTn1RcfEg-egulNvhIAj-MKwycgJFHmH2q_EqjlaF3dUSuTHjvSkbDE5lrDwl2EuJhQcabXzbaP1X7sw1YzSMm0RsX91ppwKAvC2LoSvbnwr14saZwISuGj0tiOHMh9DQGANFOK8z6TWLC-j5Sd6H-DC3JBJUMOJ_Bz4TeNwHkyaOnfvBGs)

위 그림과 같이 레이아웃 라우팅이 제대로 작동하고 있음을 알 수 있습니다.

루트 레이아웃의 네비게이션 링크도 바꿔는데 참고 바라며,

그 아래로는 `Tasks layout`이 나타나고, 그 아래는 작업 페이지의 내용이 표시됩니다.

아까 `tasks.index.tsx` 파일을 보시면 `<Link>` 태그 아래 라우팅 파라미터를 추가했는데요.

즉, `/tasks/123`과 `/tasks/123/edit` 경로 같은겁니다.

여기서 `123`은 해당 작업의 `taskId`를 나타냅니다.

TanStack Router는 경로 내의 변수를 경로 매개변수(path parameters)로 표현하며, 이는 달러 기호($)로 시작하는 경로 세그먼트(path segments)로 나타냅니다.

따라서 `tasks.$taskId.index.tsx`와 `tasks.$taskId.edit.tsx` 파일을 추가해보겠습니다.

전자는 `/tasks/123`으로 라우팅되고, 후자는 `/tasks/123/edit`으로 라우팅됩니다.

이제 `tasks.$taskId.index.tsx` 파일을 살펴보며 전달되는 경로 매개변수를 어떻게 가져오는지 알아보겠습니다.

```javascript
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks/$taskId/")({
  component: () => {
    const { taskId } = Route.useParams();

    return (
      <div>
        <div>
          <Link to="/tasks">Back</Link>
        </div>
        <div>View task {taskId}</div>
      </div>
    );
  },
});
```

`Route.useParams()` 객체는 우리의 매개변수를 반환합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEjNFEf3b5o0YZVD8MB-Y5Dr2q4BDh2hFi-gmEFzEymnR2O8gzL4Afb5VfQk-TJKIlvM_Im28UqYwn2VWE8RgUR90CUYWtvecW6gQ_0_iBymwxt5bkm-iSROzLTyhlzmtefoSI3B32gbXHR8bgPbE4sCMHZYqDUMdbB3RK6YhInLivtZVJOjdPJFAt6ojYs)

실제로 브라우저를 보시면 제대로 작동하는 걸 볼 수 있습니다.

다른 모든 라우팅 프레임워크과 다른 흥미로운 점은 이 매개변수가 정적으로 타입이 지정되어 있다는 것입니다.

Router는 이 경로에 존재하는 매개변수(상위 경로에서 상속된 매개변수 포함)를 알고 있으므로, 자동 완성뿐만 아니라 잘못된 경로 매개변수를 사용할 경우 TypeScript 오류를 발생시킵니다.

```javascript
<Link to="/tasks/$taskId" params={{ taskId: t.id }}>View</Link>
```

위 코드에서 `params`를 생략하거나 `taskId` 이외의 값을 지정하면 오류가 발생합니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgs3ELdO9hNHIQigkdKZM8YEuwa7z1WkQ8fYmfxy3MGY82fAinGnEDmyIakef2VCSvExaQqeai0OMb1QUt3Wp60UXaVBJQjm0FgXeFq9u4aGPK8xOLYdJd67QffeUfGlaG2Vmt8aogHGjYCDhMWHFzRALYfBa2fnc87qaKDBGFWwVqmcuxu_OLaNHIJG2g)

위 그림과 같이 `params`의 항목을 잘못 기입하면 타입스크립트가 오류를 발생시킵니다.

그리고 아래 그림과 같이 Typescript가 제대로 작동함을 알 수 있습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEi2M-UXp5VXAgeDMntTtv8le983NtUPDGbkGprvh6hgxT18d_RWRxSMD1sb-FTKaA6sYv_pQ0WH6Xaej-mo3HWyyDcxAViVqqQLSdwKRXM8d09QtT6CDMFS9VCE7o53mPNyB_Oy3Cs_ZRuANBb_gopIBnOOtLjiTzAajT1wFx9BTCLBqKR50pwhEb4el90)

---

## 고급 라우팅 규칙

이제 Tanstack Router의 고급 라우팅 규칙을 알아보겠습니다.

사실 잘 사용되지는 않지만, 알고 있으면 유용합니다.

개념적으로 우리는 두 가지 계층 구조를 가지고 있습니다.

URL 경로와 컴포넌트 트리(component tree)가 그건데요.

지금까지 이 두 가지는 1:1로 일치했는데요.

- **URL 경로:**
  ```
  /tasks/123/edit
  ```
  
- **렌더링(Rendered):**
  ```
  root route -> tasks route layout -> edit task path
  ```

URL 계층 구조와 컴포넌트 계층 구조가 완벽하게 일치했지만, 반드시 그럴 필요는 없습니다.

재미 삼아, `/edit` 경로에서 메인 `tasks` 레이아웃 파일을 제거해보겠습니다.

즉, `/tasks/123/edit` URL `tasks.route.tsx` 파일은 렌더링되지 않게 하겠습니다.

이렇게 하기 위해 `tasks.$taskId.edit.tsx` 파일 이름을 `tasks_.$taskId.edit.tsx`로 변경합니다.

`tasks`가 `tasks_`로 변경되었음을 유의하십시요.

코드는 아래와 같습니다.

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tasks/$taskId/edit")({
  component: () => {
    const { taskId } = Route.useParams();

    return (
      <div className="flex flex-col gap-3 p-3">
        <div>
          <Link to="/tasks">Back</Link>
        </div>
        <div>Edit task {taskId}</div>
      </div>
    );
  },
});
```

여전히 `tasks`는 URL에 남아 있으므로 Tanstack Router는 URL을 기반으로 `edit.tsx` 파일을 찾을 수 있습니다.

그러나 `tasks_`로 이름을 변경함으로써 컴포넌트 트리(component tree)에서 레이아웃 컴포넌트가 렌더링되지 않게 됩니다.

이제 다음과 같은 결과를 얻습니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgbtcuz1pFqun8PwCl0K7bkkoOmXUQl3GEruIm0OChtncg6l2SlDlMlFFSq0nSIpuw7rZsuklNO7T1Oh2_ru4-eomScYJGH6WY_oCdRDj0bVHEmyJtqJVK2O9JH7r0Z-LI97lqtohSEdcP4khn1p0AVefn9YP0E19dDex1vQhqmnyEqcDxa9ZIVHL9cN2I)

레이아웃 라우팅의 내용이 안보입니다.

이제 파일이름을 다시 `tasks.$taskId.edit.tsx`으로 바꾸면 다음과 같이 레이아웃 라우팅이 잘 보입니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEibgp1QW78dULKXUtXFH0qWB0Lb2F_71gBTInVq90mjFi27F5apojkE9Y_fGh22is1Ff7Yjp3zntGxWbwIsCHt8HevMFFUNN9YvDp77EcaQPxjBhFGxN33KrctNUXGe16Rrm5THEkRBdS42txDbzUUhu211o8mHJnvjStqyFmtPqflaPSvvWr7qzPNBJPI)

어떤가요?

---

### 고급 라우팅 기법 2

지금까지와는 반대로 생각해 볼 수 있는데요.

지금까지는 레이아웃 라우팅을 제외시키는 라우팅을 구현했었는데요.

반대로 레이아웃 라우팅을 특별한 레이아웃 라우팅으로 구현하려면 어떻게 해야 할까요?

예를 들어, `tasks_.$taskId.edit.tsx` 파일을 생성하면 `/tasks/1/edit`을 방문했을 때 커스텀 레이아웃이 렌더링되지만 URL에는 영향을 주지 않습니다.

대신 특별한 레이아웃을 적용시키고 싶다면 일단 특별 레이아웃 라우팅인 `_taskEdit.tsx` 파일을 생성해보겠습니다.

파일이름을 저장하면 자동으로 생성된 코드를 아래 코드로 바꿔 놓읍시다.

```javascript
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_taskEdit")({
  component: () => (
    <div>
      Special Task Edit Layout <Outlet />
    </div>
  ),
});
```

이제 `tasks_.$taskId.edit.tsx` 파일을 `_taskEdit.tasks_.$taskId.edit.tsx`로 변경하면, `/tasks/1/edit`을 방문했을 때 URL에는 영향을 주지 않으면서 커스텀 레이아웃이 렌더링됩니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgakjZ7QJM2ZLR-0y9FDPwIhPfP-CmIalGSc9utuX9JLjidXFwnUoQNlkn-WGMxJQeSQpWi7Tg6j_-ZF6Aw6F2m7viw5HxkMFaW528H-qnK-8F2KbARlyMEoE2t5vZxR661_qUfiQeb5afaT0Ggw63WKySmC_llHVJdMYr1FWtxbU0ajtq043qIR0dKcCw)

위 그림과 같이 특별 레이아웃 라우팅이 적용된 걸 볼 수 있을겁니다.

이 기능은 상당히 고급기능으로 한번 익혀두면 유용하게 사용할 수 있을 겁니다.

## 디렉토리 기반 라우팅

파일 이름에 점을 사용하는 대신 디렉토리에 계층 구조를 이용해서 라우팅을 구현할 수 있습니다.

저는 보통 디렉토리 기반 라우팅을 선호하지만, 간단한 구조의 애플리케이션이면 파일 이름에 점을 사용하는 플랫 라우팅도 아주 좋은 선택지가 될 수 있습니다.

모든지 개발자가 원하는 걸 사용하면 됩니다.

디렉토리 라우팅은 간단한 구조라서 아까 만들기로 한 `/epic` 라우팅을 예로 들어 설명해 보겠습니다.

플랫 라우팅이었다면 아마도 `epic.index.tsx`와 `epic.route.tsx` 파일을 만들면 되는데요.

디렉토리 기반 라우팅은 대신 `epic/index.tsx`와 `epic/route.tsx` 파일을 사용합니다.

역시 동일한 규칙이 적용됩니다.

단순하게 파일 이름의 점을 슬래시로 교체하면 그게 바로 디렉토리 기반 라우팅이 되는 겁니다.

epic 폴더를 만들고 각각 `index.tsx` 파일과 `route.tsx`파일을 아래와 같이 만듭니다.

```tsx
import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/epic/')({
  component: Index,
})

function Index() {
  const epics = [
    { id: '1', title: 'Epic 1' },
    { id: '2', title: 'Epic 2' },
    { id: '3', title: 'Epic 3' },
  ]

  return (
    <div className="p-3">
      <h3 className="text-red-500">Epics page!</h3>
      <div className="flex flex-col gap-2 p-3">
        {epics.map((e, idx) => (
          <div key={idx} className="flex gap-3">
            <div>{e.title}</div>
            <Link to="/epic/$epicId" params={{ epicId: e.id }}>
              View
            </Link>
            <Link to="/epic/$epicId/edit" params={{ epicId: e.id }}>
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
```

```tsx
import React from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/epic')({
  component: () => (
    <div className="p-3">
      Epics layout <Outlet />
    </div>
  ),
})
```

그리고 메인 루트 레이아웃에 네비게이션도 업데이트 합니다.

```tsx
import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <div className="p-2 flex gap-2 text-lg">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{" "}
          <Link
            to="/about"
            activeProps={{
              className: "font-bold",
            }}
          >
            About
          </Link>
          <Link
            to="/tasks"
            activeProps={{
              className: "font-bold",
            }}
          >
            Tasks
          </Link>
          <Link
            to="/epic"
            activeProps={{
              className: "font-bold",
            }}
          >
            Epic
          </Link>
        </div>
        <hr />
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </>
    );
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEg22hmiYUhcE_YWdi1tpOAluaijfaBC7A3hFvCmY7Gmil8QpTpCm4gd14Y6yy_p9e7aHegsLwZ_hEmRgYTWJn_7To3qQsCaWYLjpavatsbXXU_TxDdGvy88cD5F_Jgg1vXCu1M-2EgBy-3kwqAUvja64EtpY2EjvgPl3bLkviNksRrp4kezbWtL2Q5umVw)

위와 같이 라우팅이 제대로 구현되고 있습니다.

`epic/index.tsx` 파일에 보시면 `epicId`가 또 파라미터로 구현되어 있습니다.

이제 이 epicId 파리미터를 이용한 View와 Edit를 구현해야 합니다.

먼저, View 로직입니다.

당연히 epic 폴더 밑에 $epicId 폴더를 만들고 그 밑에 `index.tsx` 파일을 만들면 이 파일이 URL 주소로 보자면 `/epic/1` 처럼 작동하게 됩니다.

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/epics/$epicId/")({
  component: () => {
    const { epicId } = Route.useParams();

    return (
      <div className="flex flex-col gap-3 p-3">
        <div>Viewing epic {epicId}</div>
        <Link to="/epic/$epicId/milestones" params={{ epicId }} search={{ search: "", page: 1, tags: [] }}>
          View milestones
        </Link>
      </div>
    );
  },
});
```

이중 파라미터를 위해 milestones이라는 파라미터를 또 지정했습니다.

일단은 epic 라우팅에서 Edit까지 완성시켜 보겠습니다.

`/epic/$epicId/edit.tsx` 파일을 만들면 되겠죠.

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/epic/$epicId/edit")({
  component: () => {
    const { epicId } = Route.useParams();
    return <div className="p-3">Edit epic {epicId}</div>;
  },
});
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEhlZwKdZH2Z6L1-3B1Gui4_Lul0B9rQkRCCJsJhBxDLjnHjNyvQR9plDvrK1-vtZRJH8JWA0q8EFEQyGN_Ka2hxxLvey7r9O__7uVr_yXfHQOh9VvWfrxAC12u360NQwcoxZEuoiF4uXP_Z9Q1cpxLghAVizfkTst4Ctf2pBPVnVo9I5BRQbsDUWkHj_7o)

![](https://blogger.googleusercontent.com/img/a/AVvXsEhcVyoXZOpLb-gWr58vn4pOiyMtq1tlV64lBsqrDGG8unckpXce-BVtkieQyQ61ZJ5WCidYh7zqERgDiiRyUMogllC_CRrUVKmcHm1DNfOVomqI_N8Dg1vjgo2QlyQoLx-gn73iltnzbft5lUpDGKW7TN9JdwKeOCh4V8lG6EmJX1YsPTGtbQvnhybVDeg)

위 그림을 보시면 차례대로 View, Edit 라우팅이 구현될 걸 볼 수 있습니다.

여기서 `$milestoneId` 관련한 코드를 추가로 만들어 보겠습니다.

`/epic/1` 주소에서 'View milestone' 링크를 누르면 주소창에 아래와 같이 나오는데요.

```sh
http://localhost:3001/epic/1/milestones?search=&page=1&tags=%5B%5D
```

자세히 보시면 이제 우리는 검색 매개변수(search params) 또는 쿼리스트링(querystrings)을 다뤄야 하네요.

### 검색 매개변수(Search Params) 다루기

아마도 지금 주제가 웹 개발의 가장 귀찮은 측면 중 하나일 것입니다.

다름이 아니라 검색 매개변수(search params) 또는 쿼리스트링(querystrings)입니다.

이는 URL의 `?` 뒤에 오는 부분으로, 예를 들어 `/tasks?search=foo&status=open`과 같은 형식입니다.

보통 웹 표준인 `URLSearchParams`는 다루기 번거로울 수 있으며, 다른 프레임워크들도 보통 별다른 개선 유틸리티를 제공하지 않아 비타입화된 속성 집합을 제공하거나 해서 최소한의 도움만을 기대할 수 있는데요.

하지만 TanStack Router는 검색 매개변수를 관리하기 위한 편리하고 완전한 기능을 제공하며, 이는 타입 안전성(type-safe)도 보장됩니다.

자세히 알아볼까요?

공식문서이자 전체 내용을 보고 싶으시면 [여기](https://tanstack.com/router/docs)를 참조하시면 됩니다.

epic의 milestones 경로인 `/epic/$epicId/milestones`에 검색 매개변수 지원을 추가해보겠습니다.

일단 View 라우팅을 구현해야 해서 `/epic/$epicId` 폴더 밑에 milestones 폴더를 만들고 그 밑에 index.tsx 파일을 만듭니다.

먼저, 코드를 보면 조금 복잡한데요.

```tsx
import { createFileRoute } from "@tanstack/react-router";

type SearchParams = {
  page: number;
  search: string;
  tags: string[];
};

export const Route = createFileRoute("/epic/$epicId/milestones/")({
  validateSearch(search: Record<string, unknown>): SearchParams {
    return {
      page: Number(search.page ?? "1") ?? 1,
      search: (search.search as string) || "",
      tags: Array.isArray(search.tags) ? search.tags : [],
    };
  },
  component: ({}) => {
    const { epicId } = Route.useParams();
    const { page, search, tags } = Route.useSearch();

    return (
      <div className="flex flex-col gap-3 p-3">
        <div>Epic: {epicId}</div>
        <div>Search values in route</div>
        <pre>{JSON.stringify({ page, search, tags })}</pre>
        <div>Current search values</div>
      </div>
    );
  },
});

```

검색 매개변수에 대해서는 `validateSearch`를 사용합니다.

이는 이 경로가 지원하는 검색 매개변수가 무엇인지, 그리고 현재 URL에 있는 값을 어떻게 검증할지를 Router에 알려주는 역할을 합니다.

결국 사용자는 URL에 원하는 대로 무엇이든 입력할 수 있으므로, 잠재적으로 유효하지 않은 값을 받아서 유효한 값으로 변환하는 것은 개발자의 책임입니다.

먼저, 검색 매개변수의 타입(type)을 정의해보겠습니다.

```typescript
type SearchParams = {
  page: number;
  search: string;
  tags: string[];
};
```

이제 `validateSearch` 메서드를 살펴보겠습니다.

이 메서드는 사용자가 URL에 입력한 것을 나타내는 `Record<string, unknown>`을 받아들여, 우리가 정의한 `SearchParams` 타입에 맞는 객체를 반환합니다.

```typescript
export const Route = createFileRoute("/epics/$epicId/milestones/")({
  validateSearch(search: Record<string, unknown>): SearchParams {
    return {
      page: Number(search.page ?? "1") ?? 1,
      search: (search.search as string) || "",
      tags: Array.isArray(search.tags) ? search.tags : [],
    };
  },
  component: ({}) => {
    // ...
  }
});
```

`URLSearchParams`와 달리, 우리는 문자열(string) 값에만 국한되지 않습니다.

객체나 배열도 저장할 수 있으며, TanStack Router가 이를 직렬화(serialize) 및 역직렬화(deserialize)까지 해줍니다.

더 나아가, 커스텀 직렬화(custom serialization) 메커니즘도 지정할 수 있습니다.

실제 애플리케이션에서는 `Zod`와 같은 더 정교한 검증 메커니즘을 사용하는 것이 좋습니다.

실제로 Tanstack Router는 `Zod`를 포함하여 다양한 어댑터(adapter)를 기본적으로 제공하는데요, 검색 매개변수에 대한 문서는 [여기](https://tanstack.com/router/docs/search-params)를 참조하세요.

이제 검색 매개변수 없이 이 경로로 직접 접속했을 때 어떤 일이 일어나는지 살펴보겠습니다. 예를 들어,

```
http://localhost:3001/epic/1/milestones
```

로 접속하면 Tanstack Router는 (리다이렉트하지 않고) 다음과 같이 URL을 대체합니다:

```
http://localhost:3001/epic/1/milestones?page=1&search=&tags=%5B%5D
```

TanStack Router는 우리의 검증 함수를 실행하여 유효한 검색 매개변수로 URL을 대체했습니다.

`Route.useParams` 메서드를 여러 번 사용했는데, 검색 매개변수에 대해서는 `Route.useSearch`를 사용할 수 있습니다.

하지만 이번에는 조금 다른 방법을 시도해보겠습니다. 이전에는 모든 것을 같은 라우트 파일(route file)에 넣었기 때문에 같은 렉시컬 스코프(lexical scope)에서 Route 객체를 직접 참조할 수 있었지만, 별도의 컴포넌트를 만들어 검색 매개변수를 읽고 업데이트해보겠습니다.

`MilestoneSearch.tsx` 컴포넌트를 추가해 보겠습니다.

src 폴더 밑에 app 폴더를 만들고 `MilestoneSearch.tsx` 파일을 저장하면 됩니다.

자바스크립트이기 때문에 단순하게 라우트 파일(route file)에서 Route 객체를 직접 임포트(import)할 수 있다고 생각할 수 있지만, 이는 순환 의존성(circular dependency)을 일으킬 수 있어 위험합니다.

번들러(bundler)에 따라 다르겠지만, 문제가 발생할 수 있습니다.

다행히도 Router는 이를 처리할 수 있는 직접적인 API인 `getRouteApi`를 제공합니다. 이를 통해 (정적 타입이 지정된) 경로(route)를 전달하면 올바른 라우트 객체를 반환받을 수 있습니다.

```javascript
const route = getRouteApi("/epic/$epicId/milestones/");
```

먼저, `MilestoneSearch.tsx` 파일입니다.

```tsx
import { getRouteApi } from "@tanstack/react-router";
import type { FC } from "react";

const route = getRouteApi("/epic/$epicId/milestones/");

export const MilestoneSearch: FC<{}> = () => {
  const { epicId } = route.useParams();
  const { page, search, tags } = route.useSearch();

  return (
    <div className="flex flex-col gap-3">
      <div>Epic {epicId}</div>
      <div>
        Search values in another component:{" "}
        <pre>{JSON.stringify({ page, search, tags })}</pre>
      </div>
    </div>
  );
};
```

![](https://blogger.googleusercontent.com/img/a/AVvXsEggx58biqCPq_lmTp1iTuKvAmw64YURtuDWlDL4vYMk16DgsqsR-qto1qgh6D0dO03dDkeaL0gHd2nDaMtOar1qO4Q3ysHrKI3SlLPhBFLxqUbKsQWE2J7E1Mr0-h9Wq5t4mucZKCOM88sf5Z9AfGCOg69POgiieLqJnRxIUSNAJHNq4HbcCNBDlDu7eJU)

실행결과는 위 그림과 같습니다.

이제 이 라우트 객체에 대해 `useSearch`를 호출하여 타입이 지정된 결과를 얻을 수 있습니다.

## useNavigate 사용

좀 더 고급 사용법으로 들어가서, 먼저 `useNavigate` 훅(hook)을 사용해 보겠습니다.

일단 아래와 같이 현재 위치를 지정해서 usenavigate 훅을 navigate라는 변수에 저장했습니다.

```javascript
const navigate = useNavigate({ 
  from: "/epic/$epicId/milestones/"
});
```

이제 결과값을 사용해 현재 위치와 동일한 곳으로 이동하면서 검색 매개변수를 업데이트할 수 있습니다.

TypeScript는 누락된 값이 있다면 오류를 발생시킵니다. 편의상, Router는 현재 값을 전달하므로 새로운 값을 추가하거나 덮어쓰기가 쉽습니다. 예를 들어 페이지를 올리려면 다음과 같이 할 수 있습니다.

이제 아래와 같이 `MilestoneSearch.tsx` 파일을 고쳐봅시다.

```javascript
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import type { FC } from "react";

const route = getRouteApi("/epic/$epicId/milestones/");

export const MilestoneSearch: FC<{}> = () => {
  const { epicId } = route.useParams();
  const { page, search, tags } = route.useSearch();
  const navigate = useNavigate({ from: "/epic/$epicId/milestones/" });

  const pageDown = () => {
    navigate({
      to: ".",
      search: (prev) => {
        return { ...prev, page: prev.page - 1 };
      },
    });
  };
  const pageUp = () => {
    navigate({
      to: ".",
      search: (prev) => {
        return { ...prev, page: prev.page + 1 };
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div>Epic {epicId}</div>
      <div>
        Search values in another component:{" "}
        <pre>{JSON.stringify({ page, search, tags })}</pre>
      </div>

      <div className="flex gap-2">
        <button disabled={page == 1} className="border p-2" onClick={pageDown}>
          Page Down
        </button>
        <button className="border p-2" onClick={pageUp}>
          Page Up
        </button>
      </div>
    </div>
  );
};
```

이제 브라우저에서 Page Up 버튼과 Page Down 버튼을 눌러보면 브라우저에서 $epicId 값이 올라가거나 내려가는 걸 볼 수 있을 겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEhMhAgZen5ZaO-tZHc5yuQSD0uEJPac7UTYoLt1Pz_NQBGbCbiNrmb86u026vNQxzsUnFUpEgz85zuhV5DZ15sqRxmdiLpI0QHwMvbTzcPUCKagVl6Xnhti_8T4DaQ5IrUwT-apSv8dc9pe3_GvCDPVJZ5BIJ8d2JTqmYI2LG8-1ishpvKeFsdCTXB8Meg)

브라우저에서 보시면 page 값이 올라가는걸 볼 수 있을 겁니다.

---

여기서 더 나아가 search 값과 tags 배열을 업데이트 하는 로직을 구현해 보겠습니다.

```javascript
const tag1 = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);
const tag2 = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);
const tag3 = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);

const searchRef = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);
```

먼저, Form 요소를 이용하기 위해 useRef를 위와 같이 정의하겠습니다.

UI부분은 아래 코드를 추가하면 됩니다.

```js
<div>Tags</div>
<div className="flex gap-2">
  <input type="text" className="border p-2 w-13" ref={tag1} />
  <input type="text" className="border p-2 w-13" ref={tag2} />
  <input type="text" className="border p-2 w-13" ref={tag3} />
</div>
<div>Search</div>
<div className="flex gap-2">
  <input type="text" className="border p-2 w-13" ref={searchRef} />
</div>
<div>
  <button className="border p-2" onClick={updateSearchParams}>
    Update
  </button>
</div>
```

일단 위와 같이 하면 에러가 나는데, updateSearchParams 함수가 없다고 나옵니다.

일단은 설명은 나중에 하고 updateSearchParams 함수를 아래와 같이 pageUp 함수 다음에 넣읍시다.

```ts
const updateSearchParams = () => {
  let tags: any = [
    tag1.current.value,
    tag2.current.value,
    tag3.current.value,
  ].filter((val) => val);
  if (tags.length === 0) {
    tags = undefined;
  }

  navigate({
    to: ".",
    search: (prev) => {
      return { ...prev, search: searchRef.current.value, tags };
    },
  });
};
```

이제 에러없이 브라우저에 아래와 같이 나올겁니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEguQj8LtGrniN7UH0kZ4zdR0CnrVZilsQgTrSCJUGftLP09ZZHBlzE7tseLBggIGlYG-Uxe1KGGeB_QIPzOC1TG7MUw_DmGh4qIK1IQJ_HNlYyr-VWzpNfyVIkHyvVTkCO7Faszy4hN9nICDGZTcMzdg3P42tGssZVP1kL4x5s2-GvLik8JI7SttjWAehQ)

tag와 search 값에 아무거나 넣고 update 버튼을 누르면 브라우저가 업데이트 될건데요.

![](https://blogger.googleusercontent.com/img/a/AVvXsEgLKXz5Oi6WPWc2XKDsK1fM47TUYyyEZeLLyIJawP0jYc0WsoGOpfXmE4pR6JB3fBV9EsK4yXT-8XzquuRM1I0E0yKFnoZGaU2ySKw59kEZZsmEM5t2udVuX62fRrVUOceWvm6VOXaPV_wlmLr1NZraMxNnRZe-jd3OWYxQ6L9s_1ECNVpD4qDVViWM0fI)

위 그림과 같이 나옵니다.

이렇게 하면 URL은 다음과 같이 표시됩니다:

```sh
/epic/1/milestones?search=tan&page=16&tags=%5B"1"%2C"2"%2C"3"%5D
```

search 값과 tag의 배열이 자동으로 직렬화됩니다.

이 모든 로직이 아래 함수인 updateSearchParams 함수때문인데요.

이 함수에서는 아까 얘기했듯이 useNavigate 훅을 이용해서 값을 업데이트 시키고 있습니다.

```ts
const updateSearchParams = () => {
  let tags: any = [
    tag1.current.value,
    tag2.current.value,
    tag3.current.value,
  ].filter((val) => val);
  if (tags.length === 0) {
    tags = undefined;
  }

  navigate({
    to: ".",
    search: (prev) => {
      return { ...prev, search: searchRef.current.value, tags };
    },
  });
  };
```

그리고 항상 그렇듯이, 누락된 값이 있으면 TypeScript가 오류를 발생시킵니다.

타입 강제(type enforcement)는 좋은 일입니다.

현재, 다음과 같이 접속하면:

```sh
http://localhost:3001/epic/1/milestones
```

Router는 URL을 다음과 같이 변경합니다:

```sh
http://localhost:3001/epic/1/milestones?page=1&search=&tags=%5B%5D
```

이는 우리가 Router에 페이지마다 반드시 `page`, `search`, `tags` 값을 갖도록 지정했기 때문입니다.

URL을 깔끔하게 유지하고 싶다면, 이러한 변환이 발생하지 않도록 몇 가지 옵션이 있습니다.

이 값들을 모두 선택적으로(optional) 만들 수 있습니다.

JavaScript(및 TypeScript)에서는 값이 `undefined`이면 존재하지 않는 것으로 간주됩니다.

따라서 타입을 다음과 같이 변경할 수 있습니다:

```typescript
type SearchParams = {
  page: number | undefined;
  search: string | undefined;
  tags: string[] | undefined;
};
```

또는 다음과 같이 타입스크립트의 Partial 유틸리피 타입을 이용해서 표현할 수도 있습니다:

```typescript
type SearchParams = Partial<{
  page: number;
  search: string;
  tags: string[];
}>;
```

그런 다음, 기본값 대신 `undefined` 값을 설정하도록 검증 로직을 수정합니다:

```typescript
type SearchParams = Partial<{
  page: number;
  search: string;
  tags: string[];
}>;


validateSearch(search: Record<string, unknown>): SearchParams {
  const page = Number(search.page ?? "1") ?? 1;
  const searchVal = (search.search as string) || "";
  const tags = Array.isArray(search.tags) ? search.tags : [];

  return {
    page: page === 1 ? undefined : page,
    search: searchVal || undefined,
    tags: tags.length ? tags : undefined,
  };
},
```

이렇게 하면 값을 사용할 때 `undefined`일 수 있으므로 약간의 복잡성이 추가되지만, URL에서 기본 값을 가진 검색 매개변수를 생략할 수 있습니다.

또한, Link 태그에서도 모든 검색 값을 선택적으로 지정할 수 있게 됩니다.

다시, 다음과 같이 접속하면:

```sh
http://localhost:3001/epic/1/milestones
```

Router는 URL을 다음과 같이 아무런 변화도 생기지 않습니다.

```sh
http://localhost:3001/epic/1/milestones
```

그리고 브라우저 화면을 보시면 아래와 같아집니다.

![](https://blogger.googleusercontent.com/img/a/AVvXsEiOGm7bX_kc6zIWlpERVTueSr1qvtXIg3RJ6enQDWCYm24cfXlXeS3tAUL40UCz34-Tnx8qZgInJy_LpXysx0hA0asFWa4EJhANVe7ZB06lvcVpso9EhLbz2WfSBIePwBQuU-xU3upi3ywIdKr5xG1dwq_gCmXLWitYlB4QfZnDUPw1PxTSKirggLwRJ6s)

---

Tanstack Router는 이를 처리할 수 있는 또 다른 방법을 제공합니다.

현재 `validateSearch`는 URL에 무엇이 들어올지 모르기 때문에 `Record<string, unknown>` 타입을 받습니다.

하지만 Tanstack Router는 입력 검색 매개변수의 구조를 지정하고, 반환 타입을 정의할 수 있는 또 다른 모드를 제공합니다.

이를 통해 애플리케이션 코드에서 사용할 검증된, 최종적인 타입을 지정할 수 있습니다.

먼저, 두 가지 타입을 정의해보겠습니다:

```typescript
type SearchParams = {
  page: number;
  search: string;
  tags: string[];
};

type SearchParamsInput = Partial<{
  page: number;
  search: string;
  tags: string[];
}>;
```

이제 `SearchSchemaInput`를 가져옵니다:

```javascript
import { SearchSchemaInput } from "@tanstack/react-router";
```

`SearchSchemaInput`은 들어오는 검색 매개변수의 구조를 지정하고, 반환 타입과 구분할 수 있도록 도와줍니다. 이를 사용하여 `validateSearch` 메서드를 다음과 같이 정의합니다:

```typescript
validateSearch(search: SearchParamsInput & SearchSchemaInput): SearchParams {
  const page = Number(search.page ?? "1") ?? 1;
  const searchVal = (search.search as string) || "";
  const tags = Array.isArray(search.tags) ? search.tags : [];

  return {
    page: page === 1 ? undefined : page,
    search: searchVal || undefined,
    tags: tags.length ? tags : undefined,
  };
},
```

이제 `<Link>` 태그를 사용해 검색 매개변수를 지정하지 않고도 페이지로 이동할 수 있으며, URL을 변경하지 않으면서도 타입이 지정된 검색 매개변수 값을 유지할 수 있습니다.

---

### 마무리

TanStack Router는 정말 흥미로운 프로젝트입니다.

훌륭하게 만들어진 유연한 클라이언트 사이드 프레임워크로, 가까운 미래에 멋진 서버 사이드 통합을 약속하고 있습니다.

우리는 아직 기본적인 부분만 다뤘습니다.

데이터 로딩과 server integration에 대해 알아야 할 것이 더 많습니다.

그럼.

---

